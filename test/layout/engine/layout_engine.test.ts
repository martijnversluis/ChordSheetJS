import Item from '../../../src/chord_sheet/item';
import Line from '../../../src/chord_sheet/line';
import Paragraph from '../../../src/chord_sheet/paragraph';
import Song from '../../../src/chord_sheet/song';
import Tag from '../../../src/chord_sheet/tag';

import { LayoutEngine } from '../../../src/layout/engine/layout_engine';
import { LayoutConfig, ParagraphLayoutResult } from '../../../src/layout/engine/types';
import { Measurer, TextDimensions } from '../../../src/layout/measurement';
import {
  createChordLyricsPair,
  createLine,
  createParagraph,
  createTag,
} from '../../util/utilities';

describe('LayoutEngine', () => {
  class MockMeasurer implements Measurer {
    measureText(text: string, font: { size: number }): TextDimensions {
      const width = this.measureTextWidth(text, font);
      const height = this.measureTextHeight(text, font);
      return { width, height };
    }

    measureTextWidth(text: string, _font: { size: number }): number {
      const length = text ? text.length : 0;
      return length * 8;
    }

    measureTextHeight(_text: string, font: { size: number }): number {
      return font.size * 1.2;
    }

    splitTextToSize(text: string, maxWidth: number, font: { size: number }): string[] {
      if (!text) {
        return [''];
      }

      const words = text.split(' ');
      const lines: string[] = [];
      const charWidth = this.measureTextWidth('a', font);
      const maxChars = Math.max(1, Math.floor(maxWidth / (charWidth || 1)));
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
    }
  }

  const measurer = new MockMeasurer();

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

  const defaultMetadata = { title: 'Test Song', artist: 'Test Artist', key: 'C' };

  const defaultConfig: LayoutConfig = {
    width: 500,
    fonts: {
      chord: baseFonts.chord,
      lyrics: baseFonts.lyrics,
      comment: baseFonts.comment,
      sectionLabel: baseFonts.sectionLabel,
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
  };

  function createTestConfig(overrides: Partial<LayoutConfig> = {}): LayoutConfig {
    return {
      ...defaultConfig,
      fonts: { ...defaultConfig.fonts },
      ...overrides,
    };
  }

  function createSongFromParagraphs(paragraphs: Paragraph[]): Song {
    const song = new Song(defaultMetadata);
    song.lines = [];

    paragraphs.forEach((paragraph, paragraphIndex) => {
      paragraph.lines.forEach((line) => {
        song.lines.push(line.clone());
      });

      if (paragraphIndex < paragraphs.length - 1) {
        song.lines.push(new Line());
      }
    });

    return song;
  }

  function createTestSong(paragraphs?: Paragraph[]): Song {
    if (!paragraphs) {
      const paragraphOne = createParagraph([
        createLine([createChordLyricsPair('C', 'Hello world')]),
      ]);
      const paragraphTwo = createParagraph([
        createLine([createChordLyricsPair('G', 'Another line')]),
      ]);
      return createSongFromParagraphs([paragraphOne, paragraphTwo]);
    }

    return createSongFromParagraphs(paragraphs);
  }

  function createSimpleParagraph(lineCount: number): Paragraph {
    const lines: Line[] = [];
    for (let i = 0; i < lineCount; i += 1) {
      lines.push(createLine([createChordLyricsPair('C', `Line ${i + 1}`)]));
    }
    return createParagraph(lines);
  }

  function countLineLayouts(results: ParagraphLayoutResult[]): number {
    return results.reduce((total, result) => total + result.units.reduce((inner, unit) => inner + unit.length, 0), 0);
  }

  function hasColumnBreak(results: ParagraphLayoutResult[]): boolean {
    return results.some((result) => result.units.some((unit) => (
      unit.some((layout) => (
        layout.type === 'Tag' &&
        layout.items.some((item) => item.item instanceof Tag && item.item.name === 'column_break')
      ))
    )));
  }

  function createSectionLabelParagraph(label: string, type: string, includeContent = true): Paragraph {
    const startTag = createTag(`start_of_${type}`, '', null, null, false);
    startTag.attributes.label = label;
    const lineItems: Item[] = [startTag];

    if (includeContent) {
      lineItems.push(createChordLyricsPair('C', `${label} lyrics`));
    }

    const line = createLine(lineItems);
    line.type = type;

    return createParagraph([line]);
  }

  function createTallParagraph(lineCount: number, lyricPrefix = 'Long line'): Paragraph {
    const lines: Line[] = [];
    for (let i = 0; i < lineCount; i += 1) {
      const lyrics = `${lyricPrefix} ${'content '.repeat(5)}${i}`;
      lines.push(createLine([createChordLyricsPair('C', lyrics)]));
    }
    return createParagraph(lines);
  }

  describe('constructor', () => {
    it('initializes with song, measurer, and config', () => {
      const song = createTestSong();
      const config = createTestConfig();

      const engine = new LayoutEngine(song, measurer, config);

      expect(engine).toBeDefined();
    });

    it('processes repeated sections when configured', () => {
      const chorusParagraph = createSectionLabelParagraph('Chorus', 'chorus');
      const paragraphs = [createSimpleParagraph(1), chorusParagraph, chorusParagraph];
      const song = createTestSong(paragraphs);
      const config = createTestConfig({ repeatedSections: 'hide' });

      const engine = new LayoutEngine(song, measurer, config);
      const processedParagraphs = (engine as any).song.renderParagraphs;

      expect(processedParagraphs.length).toBeLessThan(paragraphs.length);
    });

    it('skips repeated section processing when not configured', () => {
      const chorusParagraph = createSectionLabelParagraph('Chorus', 'chorus');
      const paragraphs = [createSimpleParagraph(1), chorusParagraph, chorusParagraph];
      const song = createTestSong(paragraphs);
      const config = createTestConfig();

      const engine = new LayoutEngine(song, measurer, config);
      const processedParagraphs = (engine as any).song.renderParagraphs;

      expect(processedParagraphs.length).toEqual(paragraphs.length);
    });
  });

  describe('computeParagraphLayouts', () => {
    it('computes layouts for all paragraphs', () => {
      const paragraphs = [createSimpleParagraph(1), createSimpleParagraph(1), createSimpleParagraph(1)];
      const song = createTestSong(paragraphs);
      const config = createTestConfig();
      const engine = new LayoutEngine(song, measurer, config);

      const result = engine.computeParagraphLayouts();

      expect(result).toHaveLength(3);
      result.forEach((layout) => {
        expect(layout.units.length).toBeGreaterThan(0);
        expect(layout.sectionType).toBeDefined();
        expect(layout.addSpacing).toBe(true);
      });
    });

    it('returns empty array for song with no paragraphs', () => {
      const song = new Song(defaultMetadata);
      const config = createTestConfig();
      const engine = new LayoutEngine(song, measurer, config);

      const result = engine.computeParagraphLayouts();

      expect(result).toEqual([]);
    });

    it('handles single paragraph', () => {
      const paragraphs = [createSimpleParagraph(2)];
      const song = createTestSong(paragraphs);
      const config = createTestConfig();
      const engine = new LayoutEngine(song, measurer, config);

      const result = engine.computeParagraphLayouts();

      expect(result).toHaveLength(1);
      expect(result[0].units.length).toBeGreaterThan(0);
    });

    it('skips empty paragraphs in lyrics-only mode', () => {
      const paragraph = createSectionLabelParagraph('Chorus', 'chorus', false);
      const song = createTestSong([paragraph]);
      const config = createTestConfig({ displayLyricsOnly: true });
      const engine = new LayoutEngine(song, measurer, config);

      const result = engine.computeParagraphLayouts();

      expect(result).toHaveLength(0);
    });

    it('includes paragraphs with chord-lyric pairs in lyrics-only mode', () => {
      const paragraph = createSectionLabelParagraph('Chorus', 'chorus', true);
      const song = createTestSong([paragraph]);
      const config = createTestConfig({ displayLyricsOnly: true });
      const engine = new LayoutEngine(song, measurer, config);

      const result = engine.computeParagraphLayouts();

      expect(result).toHaveLength(1);
    });

    it('inserts column breaks when paragraph does not fit', () => {
      const tallParagraph = createTallParagraph(20);
      const song = createTestSong([tallParagraph]);
      const config = createTestConfig({ columnBottomY: 120, columnCount: 2 });
      const engine = new LayoutEngine(song, measurer, config);

      const result = engine.computeParagraphLayouts();

      expect(hasColumnBreak(result)).toBe(true);
    });

    it('keeps paragraph together when it fits', () => {
      const shortParagraph = createSimpleParagraph(2);
      const song = createTestSong([shortParagraph]);
      const config = createTestConfig({ columnBottomY: 800 });
      const engine = new LayoutEngine(song, measurer, config);

      const result = engine.computeParagraphLayouts();

      expect(hasColumnBreak(result)).toBe(false);
    });

    it('tracks column position across paragraphs', () => {
      const paragraphs = [createTallParagraph(15), createTallParagraph(15)];
      const song = createTestSong(paragraphs);
      const config = createTestConfig({ columnBottomY: 150, columnCount: 2 });
      const engine = new LayoutEngine(song, measurer, config);

      const result = engine.computeParagraphLayouts();

      const columnBreakCount = result.reduce((count, layout) => (
        count + layout.units.filter((unit) => unit.some((lineLayout) => lineLayout.type === 'Tag')).length
      ), 0);
      expect(columnBreakCount).toBeGreaterThan(0);
    });

    it('adds paragraph spacing', () => {
      const paragraphs = [createSimpleParagraph(1), createSimpleParagraph(1)];
      const song = createTestSong(paragraphs);
      const config = createTestConfig({ paragraphSpacing: 15 });
      const engine = new LayoutEngine(song, measurer, config);

      const result = engine.computeParagraphLayouts();

      result.forEach((layout) => expect(layout.addSpacing).toBe(true));
    });

    it('sets section type from paragraph', () => {
      const verseParagraph = createSectionLabelParagraph('Verse', 'verse');
      const chorusParagraph = createSectionLabelParagraph('Chorus', 'chorus');
      const song = createTestSong([verseParagraph, chorusParagraph]);
      const config = createTestConfig();
      const engine = new LayoutEngine(song, measurer, config);

      const result = engine.computeParagraphLayouts();

      const sectionTypes = result.map((layout) => layout.sectionType);
      expect(sectionTypes).toContain('verse');
      expect(sectionTypes).toContain('chorus');
    });
  });

  describe('repeated sections processing', () => {
    function createRepeatedSong(
      label: string,
      mode: 'hide' | 'title_only' | 'lyrics_only' | 'full',
    ): { song: Song; config: LayoutConfig } {
      const sectionParagraph = createSectionLabelParagraph(label, 'chorus');
      const song = createTestSong([sectionParagraph, sectionParagraph, createSimpleParagraph(1)]);
      const config = createTestConfig({ repeatedSections: mode });
      return { song, config };
    }

    it('hide mode removes repeated sections', () => {
      const { song, config } = createRepeatedSong('Chorus', 'hide');
      const engine = new LayoutEngine(song, measurer, config);

      const layouts = engine.computeParagraphLayouts();
      expect(layouts.length).toBeLessThan(3);
    });

    it('title_only mode shows only section labels for repeats', () => {
      const { song, config } = createRepeatedSong('Verse', 'title_only');
      const engine = new LayoutEngine(song, measurer, config);

      const layouts = engine.computeParagraphLayouts();

      // Original (layouts[0]) should have chord-lyrics content
      const originalItems = layouts[0].units[0][0].items;
      const originalHasContent = originalItems.some(
        (item) => item.item && item.item.constructor.name === 'ChordLyricsPair',
      );
      expect(originalHasContent).toBe(true);

      // Repeated (layouts[1]) should only have section label, no chord-lyrics content
      const repeatedItems = layouts[1].units[0][0].items;
      const repeatedHasContent = repeatedItems.some(
        (item) => item.item && item.item.constructor.name === 'ChordLyricsPair',
      );
      expect(repeatedHasContent).toBe(false);

      // Repeated should have a section delimiter tag
      const repeatedHasLabel = repeatedItems.some(
        (item) => item.item instanceof Tag && (item.item as Tag).isSectionDelimiter(),
      );
      expect(repeatedHasLabel).toBe(true);
    });

    it('title_only mode consolidates consecutive repeated sections', () => {
      const label = 'Chorus';
      const paragraph = createSectionLabelParagraph(label, 'chorus');
      const song = createTestSong([paragraph, paragraph, paragraph]);
      const config = createTestConfig({ repeatedSections: 'title_only' });
      const engine = new LayoutEngine(song, measurer, config);

      const layouts = engine.computeParagraphLayouts();

      // Should have 2 layouts: original + consolidated repeats
      expect(layouts.length).toBe(2);

      // The consolidated repeated section (layouts[1]) should have title separators
      const consolidated = layouts[1].units[0][0].items
        .filter((item) => item.item instanceof Tag && (item.item as Tag).value === ' > ');

      expect(consolidated.length).toBeGreaterThan(0);
    });

    it('full mode shows full content for repeats', () => {
      const { song, config } = createRepeatedSong('Bridge', 'full');
      const engine = new LayoutEngine(song, measurer, config);

      const layouts = engine.computeParagraphLayouts();
      expect(layouts).toHaveLength(3);
    });

    it('lyrics_only mode for repeated sections includes content', () => {
      const { song, config } = createRepeatedSong('Bridge', 'lyrics_only');
      const engine = new LayoutEngine(song, measurer, config);

      const layouts = engine.computeParagraphLayouts();
      expect(layouts).toHaveLength(3);
    });

    it('normalizes section labels for caching', () => {
      const paragraphOne = createSectionLabelParagraph('Chorus (2x)', 'chorus');
      const paragraphTwo = createSectionLabelParagraph('Chorus', 'chorus');
      const song = createTestSong([paragraphOne, paragraphTwo]);
      const config = createTestConfig({ repeatedSections: 'hide' });
      const engine = new LayoutEngine(song, measurer, config);

      const processedParagraphs = (engine as any).song.renderParagraphs;
      expect(processedParagraphs.length).toBe(1);
    });

    it('handles sections without labels', () => {
      const unlabeledParagraph = createSimpleParagraph(1);
      const song = createTestSong([unlabeledParagraph, unlabeledParagraph]);
      const config = createTestConfig({ repeatedSections: 'hide' });
      const engine = new LayoutEngine(song, measurer, config);

      const processedParagraphs = (engine as any).song.renderParagraphs;
      expect(processedParagraphs.length).toBe(2);
    });

    it('title_only mode does not corrupt cached paragraph when different sections repeat consecutively', () => {
      // Create: Verse 1 (original), Chorus 1 (original), Verse 1 (repeat), Chorus 1 (repeat)
      const verse1 = createSectionLabelParagraph('Verse 1', 'verse');
      const chorus1 = createSectionLabelParagraph('Chorus 1', 'chorus');
      const song = createTestSong([verse1, chorus1, verse1, chorus1]);
      const config = createTestConfig({ repeatedSections: 'title_only' });
      const engine = new LayoutEngine(song, measurer, config);

      const layouts = engine.computeParagraphLayouts();

      // Should have 3 layouts: original Verse 1, original Chorus 1, consolidated repeated titles
      expect(layouts.length).toBe(3);

      // The first Verse 1 (original) should NOT have title separators - it shouldn't be corrupted
      const firstVerseFirstLine = layouts[0].units[0][0];
      const hasTitleSeparatorInOriginal = firstVerseFirstLine.items.some(
        (item) => item.item instanceof Tag && (item.item as Tag).value === ' > ',
      );
      expect(hasTitleSeparatorInOriginal).toBe(false);

      // The original Verse 1 header should only contain the original label, not repeated labels
      const verse1TagItems = firstVerseFirstLine.items.filter(
        (item) => item.item instanceof Tag && (item.item as Tag).isSectionDelimiter(),
      );
      // Should only have ONE section delimiter tag (the original Verse 1)
      expect(verse1TagItems.length).toBe(1);
    });

    it('title_only mode keeps original section content intact when section repeats multiple times', () => {
      // Create: Verse 1 (original), Verse 1 (repeat), Verse 1 (repeat again)
      const verse1 = createSectionLabelParagraph('Verse', 'verse');
      const song = createTestSong([verse1, verse1, verse1]);
      const config = createTestConfig({ repeatedSections: 'title_only' });
      const engine = new LayoutEngine(song, measurer, config);

      // Process layouts
      engine.computeParagraphLayouts();

      // The original cached paragraph should not be modified
      // Check that the first paragraph in renderParagraphs (the original) still has its content
      const processedParagraphs = (engine as any).song.renderParagraphs;
      const originalParagraph = processedParagraphs[0];
      const originalFirstLine = originalParagraph.lines[0];

      // Original should have the chord-lyrics content, not just the title
      const hasChordLyricsPair = originalFirstLine.items.some(
        (item: Item) => !(item instanceof Tag) && item.constructor.name === 'ChordLyricsPair',
      );
      expect(hasChordLyricsPair).toBe(true);
    });
  });

  describe('integration with components', () => {
    it('delegates to ItemProcessor for measuring', () => {
      const paragraph = createSimpleParagraph(1);
      const song = createTestSong([paragraph]);
      const config = createTestConfig();
      const engine = new LayoutEngine(song, measurer, config);

      jest.spyOn((engine as any).itemProcessor, 'measureLineItems');

      engine.computeParagraphLayouts();

      expect((engine as any).itemProcessor.measureLineItems).toHaveBeenCalled();
    });

    it('delegates to LineBreaker for line breaking', () => {
      const paragraph = createParagraph([
        createLine([
          createChordLyricsPair(
            'C',
            'This is a long line that should wrap into multiple layouts and validate line breaking behaviour',
          ),
        ]),
      ]);
      const song = createTestSong([paragraph]);
      const config = createTestConfig({ columnWidth: 100 });
      const engine = new LayoutEngine(song, measurer, config);

      jest.spyOn((engine as any).lineBreaker, 'breakLineIntoLayouts');

      const layouts = engine.computeParagraphLayouts();

      expect((engine as any).lineBreaker.breakLineIntoLayouts).toHaveBeenCalled();
      expect(countLineLayouts(layouts)).toBeGreaterThan(1);
    });

    it('delegates to ParagraphSplitter for column breaks', () => {
      const paragraph = createTallParagraph(20);
      const song = createTestSong([paragraph]);
      const config = createTestConfig({ columnBottomY: 120 });
      const engine = new LayoutEngine(song, measurer, config);

      jest.spyOn((engine as any).paragraphSplitter, 'splitParagraph');

      engine.computeParagraphLayouts();

      expect((engine as any).paragraphSplitter.splitParagraph).toHaveBeenCalled();
    });

    it('uses LayoutFactory for creating layouts', () => {
      const commentTag = createTag('comment', 'A comment line');
      const sectionTag = createTag('start_of_chorus', '', null, null, false);
      sectionTag.attributes.label = 'Chorus';
      const paragraph = createParagraph([
        createLine([createChordLyricsPair('C', 'Chord lyrics line')]),
        createLine([commentTag]),
        createLine([sectionTag]),
      ]);
      const song = createTestSong([paragraph]);
      const config = createTestConfig();
      const engine = new LayoutEngine(song, measurer, config);

      jest.spyOn((engine as any).layoutFactory, 'createLineLayout');

      const layouts = engine.computeParagraphLayouts();

      expect((engine as any).layoutFactory.createLineLayout).toHaveBeenCalled();

      const types = layouts.flatMap((layout) => layout.units.flat().map((lineLayout) => lineLayout.type));
      expect(types).toEqual(expect.arrayContaining(['ChordLyricsPair', 'Comment', 'SectionLabel']));
    });
  });
});
