import { createChordLyricsPair, createLine, createTag } from '../../util/utilities';

import ChordLyricsPair from '../../../src/chord_sheet/chord_lyrics_pair';
import Item from '../../../src/chord_sheet/item';
import Line from '../../../src/chord_sheet/line';
import SoftLineBreak from '../../../src/chord_sheet/soft_line_break';
import Song from '../../../src/chord_sheet/song';
import Tag from '../../../src/chord_sheet/tag';

import { ItemProcessor } from '../../../src/layout/engine/item_processor';
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

function createProcessor(overrides: { config?: Partial<LayoutConfig>; songMetadata?: Record<string, string> } = {}) {
  const measurer = createMockMeasurer();
  const config = createTestConfig(overrides.config || {});
  const song = new Song({
    title: 'Test',
    artist: 'Artist',
    key: 'C',
    ...(overrides.songMetadata || {}),
  });
  const processor = new ItemProcessor(measurer, config, song);
  return {
    processor,
    measurer,
    config,
    song,
  };
}

describe('ItemProcessor', () => {
  describe('constructor', () => {
    it('initializes with measurer, config, and song', () => {
      const context = createProcessor();
      expect(context.processor).toBeDefined();
      expect(context.processor.measurer).toBe(context.measurer);
      expect(context.processor.config).toBe(context.config);
      expect(typeof context.song).toBe('object');
    });
  });

  describe('measureLineItems', () => {
    it('measures chord-lyric pairs', () => {
      const { processor } = createProcessor();
      const line = createLine([createChordLyricsPair('C', 'Hello')]);
      const measured = processor.measureLineItems(line);
      expect(measured).toHaveLength(1);
      const [{ item, width, chordHeight }] = measured;
      expect(item).toBeInstanceOf(ChordLyricsPair);
      expect(width).toBeGreaterThan(0);
      expect(chordHeight).toBeGreaterThanOrEqual(0);
    });

    it('measures soft line breaks', () => {
      const { processor } = createProcessor();
      const line = new Line();
      line.addItem(new SoftLineBreak('  ') as unknown as Item);
      const measured = processor.measureLineItems(line);
      expect(measured[0].width).toBeGreaterThan(0);
    });

    it('measures tags for comments and section labels', () => {
      const { processor } = createProcessor();
      const commentTag = createTag('comment', 'This is a comment');
      const sectionTag = createTag('start_of_chorus', '', null, null, false);
      sectionTag.attributes.label = 'Chorus';
      const commentLine = createLine([commentTag]);
      const sectionLine = createLine([sectionTag]);

      const commentMeasured = processor.measureLineItems(commentLine);
      const sectionMeasured = processor.measureLineItems(sectionLine);

      expect(commentMeasured[0].width).toBeGreaterThan(0);
      expect(sectionMeasured[0].width).toBeGreaterThan(0);
    });

    it('handles mixed item types', () => {
      const { processor } = createProcessor();
      const line = createLine([
        createChordLyricsPair('C', 'Hello'),
        new SoftLineBreak(' ') as unknown as Item,
        createTag('comment', 'Commentary'),
      ]);

      const measured = processor.measureLineItems(line);
      expect(measured).toHaveLength(3);
    });

    it('returns empty array for empty line', () => {
      const { processor } = createProcessor();
      const line = createLine([]);
      const measured = processor.measureLineItems(line);
      expect(measured).toEqual([]);
    });

    it('handles lyrics-only mode by removing chords and hyphens', () => {
      const { processor } = createProcessor();
      const line = createLine([createChordLyricsPair('C', 'word-word')]);
      const measured = processor.measureLineItems(line, true);
      const [{ item }] = measured;
      const pair = item as ChordLyricsPair;
      expect(pair.chords).toBe('');
      expect(pair.lyrics).toBe('wordword');
    });

    it('handles unsupported item types by returning placeholder', () => {
      const { processor } = createProcessor();
      const line = new Line();
      line.addItem({} as unknown as Tag);
      const measured = processor.measureLineItems(line);
      expect(measured[0].item).toBeNull();
      expect(measured[0].width).toBe(0);
    });
  });

  describe('processChordLyricsPair', () => {
    it('processes pair with chords and lyrics', () => {
      const { processor } = createProcessor();
      const line = createLine([createChordLyricsPair('C', 'Hello')]);
      const items = processor.processChordLyricsPair(line.items[0] as ChordLyricsPair, null, line);
      expect(items).toHaveLength(1);
      expect(items[0].width).toBeGreaterThan(0);
    });

    it('processes pair with only chords', () => {
      const { processor } = createProcessor();
      const line = createLine([createChordLyricsPair('C', null)]);
      const items = processor.processChordLyricsPair(line.items[0] as ChordLyricsPair, null, line);
      expect(items[0].width).toBeGreaterThan(0);
    });

    it('processes pair with only lyrics', () => {
      const { processor } = createProcessor();
      const line = createLine([createChordLyricsPair('', 'Lyrics')]);
      const items = processor.processChordLyricsPair(line.items[0] as ChordLyricsPair, null, line);
      expect(items[0].width).toBeGreaterThan(0);
    });

    it('applies chord spacing when next item has chords', () => {
      const { processor, measurer } = createProcessor();
      const pair = createChordLyricsPair('C', 'Hello');
      const next = createChordLyricsPair('G', 'World');
      const line = createLine([pair, next]);
      const items = processor.processChordLyricsPair(pair, next, line);
      const chordWidth = measurer.measureTextWidth('C', processor.config.fonts.chord);
      expect(items[0].width).toBeGreaterThanOrEqual(chordWidth);
    });

    it('skips chord spacing when next item has no chords', () => {
      const { processor, measurer } = createProcessor();
      const pair = createChordLyricsPair('C', 'Hello');
      const next = createChordLyricsPair('', 'World');
      const line = createLine([pair, next]);
      const items = processor.processChordLyricsPair(pair, next, line);
      const chordWidth = measurer.measureTextWidth('C', processor.config.fonts.chord);
      expect(items[0].width).toBeGreaterThanOrEqual(chordWidth);
    });

    it('splits pair at commas inserting soft breaks', () => {
      const { processor } = createProcessor();
      const pair = createChordLyricsPair('C', 'Hello, world, test');
      const line = createLine([pair]);
      const items = processor.processChordLyricsPair(pair, null, line);
      const softBreaks = items.filter((item) => item.item instanceof SoftLineBreak);
      expect(softBreaks.length).toBeGreaterThan(0);
    });

    it('handles lyrics-only mode by removing chords', () => {
      const { processor } = createProcessor();
      const pair = createChordLyricsPair('C', 'word-word');
      const line = createLine([pair]);
      const items = processor.processChordLyricsPair(pair, null, line, true);
      const chordPairs = items.filter((item) => item.item instanceof ChordLyricsPair);
      chordPairs.forEach((measured) => {
        const measuredPair = measured.item as ChordLyricsPair;
        expect(measuredPair.chords).toBe('');
        expect(measuredPair.lyrics?.includes('-')).toBe(false);
      });
    });

    it('returns null item for empty lyrics in lyrics-only mode', () => {
      const { processor } = createProcessor();
      const pair = createChordLyricsPair('C', null);
      const line = createLine([pair]);
      const items = processor.processChordLyricsPair(pair, null, line, true);
      expect(items[0].item).toBeNull();
    });

    it('renders chords with song key context', () => {
      const { processor } = createProcessor({ songMetadata: { key: 'G' } });
      const pair = createChordLyricsPair('I', 'Hello');
      const line = createLine([pair]);
      const items = processor.processChordLyricsPair(pair, null, line);
      const renderedPair = items[0].item as ChordLyricsPair;
      expect(renderedPair.chords).toBeDefined();
    });

    it('applies unicode modifiers when configured', () => {
      const context = createProcessor({ config: { useUnicodeModifiers: true } });
      const measuredTexts: string[] = [];
      const originalMeasureTextWidth = context.measurer.measureTextWidth;
      context.measurer.measureTextWidth = (text: string, font) => {
        measuredTexts.push(text);
        return originalMeasureTextWidth(text, font);
      };
      const pair = createChordLyricsPair('F#', 'Sharp chord');
      const line = createLine([pair]);
      context.processor.processChordLyricsPair(pair, null, line);
      expect(measuredTexts.some((text) => text.includes('♯'))).toBe(true);
    });

    it('normalizes chords when configured', () => {
      const context = createProcessor({ config: { normalizeChords: true } });
      const measuredTexts: string[] = [];
      const originalMeasureTextWidth = context.measurer.measureTextWidth;
      context.measurer.measureTextWidth = (text: string, font) => {
        measuredTexts.push(text);
        return originalMeasureTextWidth(text, font);
      };
      const pair = createChordLyricsPair('cm', 'Minor chord');
      const line = createLine([pair]);
      context.processor.processChordLyricsPair(pair, null, line);
      expect(measuredTexts.some((text) => text.includes('Cm'))).toBe(true);
    });
  });

  describe('processSoftLineBreak', () => {
    it('measures soft line break content width', () => {
      const { processor } = createProcessor();
      const measured = processor.processSoftLineBreak(new SoftLineBreak(' '));
      expect(measured.width).toBeGreaterThan(0);
    });

    it('returns zero width for empty soft line break', () => {
      const { processor } = createProcessor();
      const measured = processor.processSoftLineBreak(new SoftLineBreak(''));
      expect(measured.width).toBe(0);
    });
  });

  describe('processTag', () => {
    it('processes comment tag with comment font', () => {
      const { processor } = createProcessor();
      const tag = createTag('comment', 'A simple comment');
      const items = processor.processTag(tag);
      expect(items[0].width).toBeGreaterThan(0);
    });

    it('processes section label tag', () => {
      const { processor } = createProcessor();
      const tag = createTag('start_of_chorus', '', null, null, false);
      tag.attributes.label = 'Chorus 1';
      const items = processor.processTag(tag);
      expect(items[0].width).toBeGreaterThan(0);
    });

    it('splits long tag text to fit column width', () => {
      const { processor } = createProcessor({ config: { width: 80 } });
      const tag = createTag('comment', 'This is a very long comment that should wrap across multiple lines');
      const items = processor.processTag(tag);
      expect(items.length).toBeGreaterThan(1);
    });

    it('processes column_break tag with zero width', () => {
      const { processor } = createProcessor();
      const tag = createTag('column_break', '');
      const items = processor.processTag(tag);
      expect(items[0].width).toBe(0);
    });

    it('handles other tag types with zero width placeholder', () => {
      const { processor } = createProcessor();
      const tag = createTag('unknown_tag', 'value');
      const items = processor.processTag(tag);
      expect(items[0].width).toBe(0);
    });
  });

  describe('splitMeasuredItem', () => {
    it('splits item with long lyrics', () => {
      const { processor } = createProcessor();
      const pair = createChordLyricsPair('C', 'This is a long line that should be split into smaller parts');
      const line = createLine([pair]);
      const measured = processor.measureLineItems(line);
      const [first, second] = processor.splitMeasuredItem(measured[0], 60);
      expect(first.width).toBeLessThanOrEqual(60 + 1);
      expect(second).not.toBeNull();
    });

    it('returns original item when lyrics fit', () => {
      const { processor } = createProcessor();
      const pair = createChordLyricsPair('C', 'Short');
      const line = createLine([pair]);
      const measured = processor.measureLineItems(line);
      const [first, second] = processor.splitMeasuredItem(measured[0], 200);
      expect(second).toBeNull();
      expect(first.item).toBeInstanceOf(ChordLyricsPair);
    });

    it('returns original item when no lyrics present', () => {
      const { processor } = createProcessor();
      const pair = createChordLyricsPair('C', null);
      const line = createLine([pair]);
      const measured = processor.measureLineItems(line);
      const [first, second] = processor.splitMeasuredItem(measured[0], 200);
      expect(second).toBeNull();
      expect(first.item).toBeInstanceOf(ChordLyricsPair);
    });

    it('preserves chords in first part when splitting', () => {
      const { processor } = createProcessor();
      const pair = createChordLyricsPair('C', 'This is another long lyric that needs splitting');
      const line = createLine([pair]);
      const measured = processor.measureLineItems(line);
      const [first, second] = processor.splitMeasuredItem(measured[0], 60);
      const firstPair = first.item as ChordLyricsPair;
      const secondPair = (second as MeasuredItem).item as ChordLyricsPair;
      expect(firstPair.chords).toBe('C');
      expect(secondPair.chords).toBe('');
    });
  });

  describe('removeHyphens', () => {
    it('removes hyphens between words', () => {
      const { processor } = createProcessor();
      expect(processor.removeHyphens('word-word')).toBe('wordword');
    });

    it('removes trailing hyphens', () => {
      const { processor } = createProcessor();
      expect(processor.removeHyphens('word-')).toBe('word');
    });

    it('removes standalone hyphens', () => {
      const { processor } = createProcessor();
      expect(processor.removeHyphens(' - ')).toBe('');
    });

    it('preserves hyphens in compound words with apostrophes', () => {
      const { processor } = createProcessor();
      expect(processor.removeHyphens('well-known it\'s'))
        .toBe('wellknown it\'s');
    });

    it('returns text without changes when no hyphens present', () => {
      const { processor } = createProcessor();
      expect(processor.removeHyphens('hello world')).toBe('hello world');
    });
  });

  describe('splitChordLyricsPair', () => {
    it('splits at commas inserting soft breaks and fragments', () => {
      const { processor } = createProcessor();
      const pair = createChordLyricsPair('C', 'Hello, world, test');
      const result = processor.splitChordLyricsPair(pair);
      const commaFragments = result.filter((item) => item instanceof ChordLyricsPair);
      const softBreaks = result.filter((item) => item instanceof SoftLineBreak);
      expect(commaFragments.length).toBeGreaterThan(1);
      expect(softBreaks.length).toBeGreaterThan(0);
    });

    it('preserves chords on first fragment only', () => {
      const { processor } = createProcessor();
      const pair = createChordLyricsPair('C', 'Hello, world');
      const result = processor.splitChordLyricsPair(pair);
      const fragments = result.filter((item) => item instanceof ChordLyricsPair) as ChordLyricsPair[];
      expect(fragments[0].chords).toBe('C');
      expect(fragments[1].chords).toBe('');
    });

    it('adds comma to first fragment when splitting', () => {
      const { processor } = createProcessor();
      const pair = createChordLyricsPair('C', 'Hello, world');
      const result = processor.splitChordLyricsPair(pair);
      const fragments = result.filter((item) => item instanceof ChordLyricsPair) as ChordLyricsPair[];
      expect(fragments[0].lyrics).toContain(',');
    });

    it('returns original pair when no commas present', () => {
      const { processor } = createProcessor();
      const pair = createChordLyricsPair('C', 'Hello world');
      const result = processor.splitChordLyricsPair(pair);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(pair);
    });

    it('returns pair when lyrics empty', () => {
      const { processor } = createProcessor();
      const pair = createChordLyricsPair('C', '');
      const result = processor.splitChordLyricsPair(pair);
      expect(result).toHaveLength(1);
    });

    it('trims leading space in lyrics-only mode for subsequent fragments', () => {
      const { processor } = createProcessor();
      const pair = createChordLyricsPair('C', 'Hello, world');
      const result = processor.splitChordLyricsPair(pair, true);
      const fragments = result.filter((item) => item instanceof ChordLyricsPair) as ChordLyricsPair[];
      expect(fragments[1].lyrics?.startsWith('world')).toBe(true);
    });
  });

  describe('findNextItemWithLyrics', () => {
    it('finds next item with lyrics in measured items', () => {
      const { processor } = createProcessor();
      const items: MeasuredItem[] = [
        { item: createChordLyricsPair('C', ''), width: 0 },
        { item: createChordLyricsPair('G', 'Lyrics'), width: 0 },
      ];
      const result = processor.findNextItemWithLyrics([], items, 0);
      expect(result?.item).toBe(items[1].item);
    });

    it('returns null when no item has lyrics', () => {
      const { processor } = createProcessor();
      const items: MeasuredItem[] = [
        { item: createChordLyricsPair('C', ''), width: 0 },
      ];
      const result = processor.findNextItemWithLyrics([], items, 0);
      expect(result).toBeNull();
    });

    it('searches current line before measured items', () => {
      const { processor } = createProcessor();
      const currentLine: MeasuredItem[] = [
        { item: createChordLyricsPair('C', 'Line lyrics'), width: 0 },
      ];
      const result = processor.findNextItemWithLyrics(currentLine, [], 0);
      expect(result?.item).toBe(currentLine[0].item);
    });
  });

  describe('capitalizeFirstWord', () => {
    it('capitalizes the first letter of text', () => {
      const { processor } = createProcessor();
      expect(processor.capitalizeFirstWord('hello world')).toBe('Hello world');
    });

    it('returns original text when already capitalized', () => {
      const { processor } = createProcessor();
      expect(processor.capitalizeFirstWord('Hello world')).toBe('Hello world');
    });

    it('handles text with leading space', () => {
      const { processor } = createProcessor();
      expect(processor.capitalizeFirstWord(' hello')).toBe(' Hello');
    });

    it('handles empty string', () => {
      const { processor } = createProcessor();
      expect(processor.capitalizeFirstWord('')).toBe('');
    });
  });
});
