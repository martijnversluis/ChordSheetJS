import { createChordLyricsPair } from '../../util/utilities';

import ChordLyricsPair from '../../../src/chord_sheet/chord_lyrics_pair';
import Line from '../../../src/chord_sheet/line';
import SoftLineBreak from '../../../src/chord_sheet/soft_line_break';
import Song from '../../../src/chord_sheet/song';
import Tag from '../../../src/chord_sheet/tag';

import { ItemProcessor } from '../../../src/layout/engine/item_processor';
import { LayoutFactory } from '../../../src/layout/engine/layout_factory';
import { LineBreaker } from '../../../src/layout/engine/line_breaker';
import { LayoutConfig, MeasuredItem } from '../../../src/layout/engine/types';
import { Measurer, TextDimensions } from '../../../src/layout/measurement';

function createMockMeasurer(): Measurer {
  const measureTextWidth = (text: string, _font: { size: number }): number => (text || '').length * 8;
  const measureTextHeight = (_text: string, font: { size: number }): number => font.size * 1.2;

  const splitTextToSize = (text: string, maxWidth: number, font: { size: number }): string[] => {
    if (!text) {
      return [''];
    }

    const charWidth = measureTextWidth('a', font) || 8;
    const maxChars = Math.max(1, Math.floor(maxWidth / charWidth));
    const words = text.split(' ');
    const lines: string[] = [];
    let current = '';

    words.forEach((word) => {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length <= maxChars) {
        current = candidate;
        return;
      }

      if (current) {
        lines.push(current);
      }

      if (word.length > maxChars) {
        for (let i = 0; i < word.length; i += maxChars) {
          lines.push(word.slice(i, i + maxChars));
        }
        current = '';
        return;
      }

      current = word;
    });

    if (current) {
      lines.push(current);
    }

    return lines;
  };

  const measureText = (text: string, font: { size: number }): TextDimensions => ({
    width: measureTextWidth(text, font),
    height: measureTextHeight(text, font),
  });

  return {
    measureText,
    measureTextWidth,
    measureTextHeight,
    splitTextToSize,
  };
}

const baseFonts = {
  chord: {
    name: 'Helvetica',
    style: 'bold',
    size: 12,
    color: '#000000',
  },
  lyrics: {
    name: 'Helvetica',
    style: 'normal',
    size: 12,
    color: '#000000',
  },
  comment: {
    name: 'Helvetica',
    style: 'italic',
    size: 10,
    color: '#333333',
  },
  sectionLabel: {
    name: 'Helvetica',
    style: 'bold',
    size: 14,
    color: '#000000',
  },
} as const;

function createTestConfig(overrides: Partial<LayoutConfig> = {}): LayoutConfig {
  return {
    width: 500,
    fonts: {
      chord: { ...baseFonts.chord },
      lyrics: { ...baseFonts.lyrics },
      comment: { ...baseFonts.comment },
      sectionLabel: { ...baseFonts.sectionLabel },
    },
    chordSpacing: 2,
    chordLyricSpacing: 4,
    linePadding: 2,
    useUnicodeModifiers: false,
    normalizeChords: false,
    minY: 50,
    columnWidth: 500,
    columnCount: 1,
    columnSpacing: 20,
    paragraphSpacing: 10,
    columnBottomY: 750,
    displayLyricsOnly: false,
    decapo: false,
    ...overrides,
  };
}

class MockItemProcessor extends ItemProcessor {
  measureLineItemsSpy = jest.fn();

  splitMeasuredItemSpy = jest.fn();

  findNextItemWithLyricsSpy = jest.fn();

  capitalizeFirstWordSpy = jest.fn((text: string) => (text ? `${text[0].toUpperCase()}${text.slice(1)}` : text));

  constructor(measurer: Measurer, config: LayoutConfig) {
    super(measurer, config, new Song());
  }

  measureLineItems(line: Line, lyricsOnly = false): MeasuredItem[] {
    if (this.measureLineItemsSpy.mock.calls.length === 0) {
      const measured = line.items.map((item) => {
        if (item instanceof ChordLyricsPair) {
          const rawLyrics = item.lyrics || '';
          const normalizedLyrics = lyricsOnly ? rawLyrics.replace(/-/g, '') : rawLyrics;
          const chords = lyricsOnly ? '' : item.chords || '';
          const lyricsWidth = this.measurer.measureTextWidth(normalizedLyrics, this.config.fonts.lyrics);
          const chordWidth = chords ? this.measurer.measureTextWidth(chords, this.config.fonts.chord) : 0;
          const pair = new ChordLyricsPair(chords, normalizedLyrics);
          return {
            item: pair,
            width: Math.max(lyricsWidth, chordWidth),
            chordHeight: chordWidth ? this.measurer.measureTextHeight(chords, this.config.fonts.chord) : 0,
          };
        }
        if (item instanceof SoftLineBreak) {
          return { item, width: this.measurer.measureTextWidth(item.content, this.config.fonts.lyrics) };
        }
        if (item instanceof Tag) {
          const tagWidth = this.measurer.measureTextWidth(item.value || '', this.config.fonts.comment);
          return { item, width: tagWidth };
        }
        return { item: null, width: 0 };
      });
      this.measureLineItemsSpy.mockImplementation(() => measured);
    }

    const result = this.measureLineItemsSpy(line, lyricsOnly);
    return result;
  }

  splitMeasuredItem(item: MeasuredItem, availableWidth: number): [MeasuredItem, MeasuredItem | null] {
    if (!this.splitMeasuredItemSpy.mock.calls.length) {
      this.splitMeasuredItemSpy.mockImplementation((originalItem: MeasuredItem, width: number) => {
        if (!(originalItem.item instanceof ChordLyricsPair) || !originalItem.item.lyrics) {
          return [originalItem, null];
        }
        const { lyrics } = originalItem.item;
        const font = this.config.fonts.lyrics;
        const lines = this.measurer.splitTextToSize(lyrics, width, font);
        if (lines.length <= 1) {
          return [originalItem, null];
        }
        const firstLyrics = lines[0];
        const remainder = lines.slice(1).join(' ');
        return [
          {
            item: new ChordLyricsPair(originalItem.item.chords, firstLyrics),
            width: this.measurer.measureTextWidth(firstLyrics, font),
            chordHeight: originalItem.chordHeight,
          },
          {
            item: new ChordLyricsPair('', remainder),
            width: this.measurer.measureTextWidth(remainder, font),
            chordHeight: originalItem.chordHeight,
          },
        ];
      });
    }

    return this.splitMeasuredItemSpy(item, availableWidth);
  }

  findNextItemWithLyrics(
    currentLine: MeasuredItem[],
    measuredItems: MeasuredItem[],
    index: number,
  ): MeasuredItem | null {
    if (!this.findNextItemWithLyricsSpy.mock.calls.length) {
      this.findNextItemWithLyricsSpy.mockImplementation((
        lineItems: MeasuredItem[],
        allItems: MeasuredItem[],
        idx: number,
      ) => {
        const combined = [...lineItems, ...allItems.slice(idx)];
        return combined.find((measuredItem) => {
          if (!(measuredItem.item instanceof ChordLyricsPair)) {
            return false;
          }
          const { lyrics } = measuredItem.item;
          return !!lyrics && lyrics.trim().length > 0;
        }) || null;
      });
    }
    return this.findNextItemWithLyricsSpy(currentLine, measuredItems, index);
  }

  capitalizeFirstWord(text: string): string {
    return this.capitalizeFirstWordSpy(text);
  }
}

function createMockItemProcessor(config: LayoutConfig, measurer: Measurer): MockItemProcessor {
  return new MockItemProcessor(measurer, config);
}

function createMockLayoutFactory(config: LayoutConfig): LayoutFactory {
  return new LayoutFactory(config);
}

function createTestLine(items: (ChordLyricsPair | SoftLineBreak | Tag)[]): Line {
  const line = new Line();
  items.forEach((item) => line.addItem(item as unknown as any));
  return line;
}

function createSoftBreak(content = ' '): SoftLineBreak {
  return new SoftLineBreak(content);
}

describe('LineBreaker', () => {
  const measurer = createMockMeasurer();
  const config = createTestConfig();
  let itemProcessor: MockItemProcessor;
  let layoutFactory: LayoutFactory;
  let lineBreaker: LineBreaker;

  beforeEach(() => {
    itemProcessor = createMockItemProcessor(config, measurer);
    layoutFactory = createMockLayoutFactory(config);
    lineBreaker = new LineBreaker(itemProcessor, layoutFactory);
  });

  describe('constructor', () => {
    it('initializes with ItemProcessor and LayoutFactory', () => {
      expect(lineBreaker).toBeDefined();
    });
  });

  describe('breakLineIntoLayouts', () => {
    it('returns single layout when line fits', () => {
      const line = createTestLine([createChordLyricsPair('C', 'Short text')]);
      const layouts = lineBreaker.breakLineIntoLayouts(line, 1000);
      expect(layouts).toHaveLength(1);
      expect(layouts[0].items).toHaveLength(1);
    });

    it('returns empty array for empty line', () => {
      const line = createTestLine([]);
      const layouts = lineBreaker.breakLineIntoLayouts(line, 200);
      expect(layouts).toEqual([]);
    });

    it('breaks line at soft line breaks when exceeding width', () => {
      const line = createTestLine([
        createChordLyricsPair('C', 'Hello'),
        createSoftBreak(),
        createChordLyricsPair('G', 'World'),
      ]);
      const layouts = lineBreaker.breakLineIntoLayouts(line, 70);
      expect(layouts.length).toBeGreaterThan(1);
      const firstLayoutLyrics = layouts[0].items
        .map(({ item }) => item)
        .filter((item): item is ChordLyricsPair => item instanceof ChordLyricsPair)
        .map((pair) => pair.lyrics)
        .join(' ');
      const secondLayoutLyrics = layouts[1].items
        .map(({ item }) => item)
        .filter((item): item is ChordLyricsPair => item instanceof ChordLyricsPair)
        .map((pair) => pair.lyrics)
        .join(' ');
      expect(firstLayoutLyrics).toContain('Hello');
      expect(secondLayoutLyrics).toContain('World');
    });

    it('consolidates consecutive soft line breaks', () => {
      const line = createTestLine([
        createChordLyricsPair('C', 'Hello'),
        createSoftBreak(),
        createSoftBreak(),
        createChordLyricsPair('G', 'World'),
      ]);
      const layouts = lineBreaker.breakLineIntoLayouts(line, 70);
      expect(layouts.length).toBe(2);
    });

    it('breaks at soft break closest to middle when multiple breaks exist and width is limited', () => {
      const line = createTestLine([
        createChordLyricsPair('C', 'First part'),
        createSoftBreak(),
        createChordLyricsPair('G', 'Second part'),
        createSoftBreak(),
        createChordLyricsPair('Am', 'Third part'),
      ]);
      const layouts = lineBreaker.breakLineIntoLayouts(line, 70);
      expect(layouts.length).toBeGreaterThan(1);
      const firstLayoutLyrics = layouts[0].items
        .map(({ item }) => item)
        .filter((item): item is ChordLyricsPair => item instanceof ChordLyricsPair)
        .map((pair) => pair.lyrics)
        .join(' ');
      expect(firstLayoutLyrics).toContain('Second part');
    });

    it('removes trailing comma from first chunk', () => {
      const pairOne = createChordLyricsPair('C', 'Hello,');
      const pairTwo = createChordLyricsPair('G', 'world');
      const line = createTestLine([
        pairOne,
        createSoftBreak(),
        pairTwo,
      ]);
      const layouts = lineBreaker.breakLineIntoLayouts(line, 70);
      const firstLine = layouts[0];
      const [{ item }] = firstLine.items;
      const { lyrics } = item as ChordLyricsPair;
      expect(lyrics?.endsWith(',')).toBe(false);
    });

    it('capitalizes first word of second chunk', () => {
      const pairOne = createChordLyricsPair('C', 'hello,');
      const pairTwo = createChordLyricsPair('G', 'world');
      const line = createTestLine([
        pairOne,
        createSoftBreak(),
        pairTwo,
      ]);
      const layouts = lineBreaker.breakLineIntoLayouts(line, 40);
      const secondLine = layouts[1];
      const [{ item: secondItem }] = secondLine.items;
      const { lyrics: rawLyrics } = secondItem as ChordLyricsPair;
      const firstCharacter = (rawLyrics ?? '').charAt(0);
      expect(firstCharacter).toBe(firstCharacter.toUpperCase());
    });

    it('handles line with no soft breaks', () => {
      const line = createTestLine([
        createChordLyricsPair('C', 'This line is long and should break somewhere without explicit soft breaks'),
      ]);
      const layouts = lineBreaker.breakLineIntoLayouts(line, 70);
      expect(layouts.length).toBeGreaterThan(1);
    });

    it('splits item when single item exceeds width', () => {
      const line = createTestLine([
        createChordLyricsPair('C', 'This single chord lyric pair has very long lyrics that will not fit'),
      ]);
      const splitSpy = jest.spyOn(itemProcessor, 'splitMeasuredItem');
      lineBreaker.breakLineIntoLayouts(line, 40);
      expect(splitSpy).toHaveBeenCalled();
    });

    it('handles lyrics-only mode', () => {
      const line = createTestLine([
        createChordLyricsPair('C', 'words-only'),
      ]);
      const layouts = lineBreaker.breakLineIntoLayouts(line, 40, true);
      const pairs = layouts
        .flatMap((layout) => layout.items.map(({ item }) => item))
        .filter((item): item is ChordLyricsPair => item instanceof ChordLyricsPair);

      pairs.forEach((pair) => {
        expect(pair.chords).toBe('');
      });
    });

    it('recursively breaks content until all fits', () => {
      const line = createTestLine([
        createChordLyricsPair('C', 'One'),
        createChordLyricsPair('G', 'Two'),
        createChordLyricsPair('Am', 'Three'),
        createChordLyricsPair('F', 'Four'),
      ]);
      const layouts = lineBreaker.breakLineIntoLayouts(line, 30);
      expect(layouts.length).toBeGreaterThan(1);
      layouts.forEach((layout) => {
        const totalWidth = layout.items.reduce((sum, item) => sum + item.width, 0);
        expect(totalWidth).toBeLessThanOrEqual(40 + 1);
      });
    });
  });

  describe('edge cases', () => {
    it('handles line with only soft breaks', () => {
      const line = createTestLine([createSoftBreak(), createSoftBreak()]);
      const layouts = lineBreaker.breakLineIntoLayouts(line, 80);
      expect(layouts.length).toBeLessThanOrEqual(1);
    });

    it('handles very narrow available width', () => {
      const line = createTestLine([
        createChordLyricsPair('C', 'Test width handling'),
      ]);
      const layouts = lineBreaker.breakLineIntoLayouts(line, 10);
      expect(layouts.length).toBeGreaterThan(1);
    });

    it('handles line with null or empty lyrics', () => {
      const pair = createChordLyricsPair('C', '');
      const line = createTestLine([pair]);
      const layouts = lineBreaker.breakLineIntoLayouts(line, 80);
      expect(layouts).toHaveLength(1);
    });

    it('handles line with only chords', () => {
      const pair = createChordLyricsPair('C', null);
      const line = createTestLine([pair]);
      const layouts = lineBreaker.breakLineIntoLayouts(line, 80);
      expect(layouts).toHaveLength(1);
    });

    it('handles mixed content (chords, lyrics, soft breaks)', () => {
      const line = createTestLine([
        createChordLyricsPair('C', 'Hello'),
        createSoftBreak(),
        createChordLyricsPair('', 'world'),
        createSoftBreak(),
        createChordLyricsPair('G', 'again'),
      ]);
      const layouts = lineBreaker.breakLineIntoLayouts(line, 80);
      expect(layouts.length).toBeGreaterThan(1);
    });
  });

  describe('integration with ItemProcessor', () => {
    it('calls measureLineItems', () => {
      const spy = jest.spyOn(itemProcessor, 'measureLineItems');
      const line = createTestLine([createChordLyricsPair('C', 'Call measure')]);
      lineBreaker.breakLineIntoLayouts(line, 100);
      expect(spy).toHaveBeenCalledWith(line, false);
    });

    it('calls splitMeasuredItem when needed', () => {
      const spy = jest.spyOn(itemProcessor, 'splitMeasuredItem');
      const line = createTestLine([
        createChordLyricsPair('C', 'This is a very long single item that should be split'),
      ]);
      lineBreaker.breakLineIntoLayouts(line, 60);
      expect(spy).toHaveBeenCalled();
    });

    it('calls capitalizeFirstWord for second chunk', () => {
      const spy = jest.spyOn(itemProcessor, 'capitalizeFirstWord');
      const line = createTestLine([
        createChordLyricsPair('C', 'hello,'),
        createSoftBreak(),
        createChordLyricsPair('G', 'world'),
      ]);
      lineBreaker.breakLineIntoLayouts(line, 70);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('regressions', () => {
    it('does not break at soft line breaks when the content fits within the width', () => {
      const line = createTestLine([
        createChordLyricsPair('Gm', 'Thine is the '),
        createSoftBreak(),
        createChordLyricsPair('F', 'Kingdom'),
        createSoftBreak(),
        createChordLyricsPair('C#dim7', 'the power the '),
        createSoftBreak(),
        createChordLyricsPair('Dm', 'glory'),
      ]);

      const layouts = lineBreaker.breakLineIntoLayouts(line, 400);
      expect(layouts).toHaveLength(1);
    });
  });

  describe('integration with LayoutFactory', () => {
    it('calls createLineLayout for each layout', () => {
      const spy = jest.spyOn(layoutFactory, 'createLineLayout');
      const line = createTestLine([
        createChordLyricsPair('C', 'One'),
        createChordLyricsPair('G', 'Two'),
        createChordLyricsPair('Am', 'Three'),
      ]);
      const layouts = lineBreaker.breakLineIntoLayouts(line, 50);
      expect(spy).toHaveBeenCalledTimes(layouts.length);
    });

    it('passes correct items to createLineLayout', () => {
      const spy = jest.spyOn(layoutFactory, 'createLineLayout');
      const pairOne = createChordLyricsPair('C', 'Hello');
      const pairTwo = createChordLyricsPair('G', 'World');
      const line = createTestLine([
        pairOne,
        createSoftBreak(),
        pairTwo,
      ]);
      lineBreaker.breakLineIntoLayouts(line, 120);
      const firstCallItems = spy.mock.calls[0][0] as MeasuredItem[];
      const firstMeasured = firstCallItems[0].item as ChordLyricsPair;
      expect(firstMeasured.lyrics).toBe(pairOne.lyrics);
    });
  });
});
