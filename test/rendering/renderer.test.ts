import ChordLyricsPair from '../../src/chord_sheet/chord_lyrics_pair';
import Dimensions from '../../src/layout/engine/dimensions';
import Line from '../../src/chord_sheet/line';
import Song from '../../src/chord_sheet/song';
import Tag from '../../src/chord_sheet/tag';

import { FontConfiguration } from '../../src/formatter/configuration';
import { createColumnBreakLineLayout } from '../../src/layout/engine/layout_helpers';
import { LineLayout, MeasuredItem } from '../../src/layout/engine/types';
import Renderer, { ParagraphLayout, PositionedElement } from '../../src/rendering/renderer';

describe('Renderer base class', () => {
  interface TestRendererConfiguration {
    page: {
      width: number;
      height: number;
    };
    margins: {
      left: number;
      right: number;
      top: number;
      bottom: number;
    };
    headerHeight: number;
    footerHeight: number;
    columns: {
      count: number;
      spacing: number;
    };
    fonts: {
      chord: FontConfiguration;
      text: FontConfiguration;
      sectionLabel: FontConfiguration;
      comment: FontConfiguration;
    };
    paragraphSpacing: number;
    chordLyricSpacing: number;
    flags: {
      useUnicodeModifiers: boolean;
      normalizeChords: boolean;
      lyricsOnly: boolean;
    };
    decapo: number;
  }

  class TestRenderer extends Renderer {
    private config: TestRendererConfiguration;

    public pagesCreated: number[] = [];

    public initializeCalled = false;

    public chordDiagramsRendered = false;

    public headersFootersRendered = false;

    public finalized = false;

    public backendInitialized = false;

    public callOrder: string[] = [];

    constructor(song: Song, config: TestRendererConfiguration) {
      super(song);
      this.config = config;
    }

    public override initialize(): void {
      this.callOrder.push('initialize');
      super.initialize();
      this.initializeCalled = true;
    }

    protected override initializeBackend(): void {
      this.backendInitialized = true;
      this.callOrder.push('initializeBackend');
    }

    protected override createNewPage(): void {
      this.pagesCreated.push(this.currentPage + 1);
      this.callOrder.push('createNewPage');
    }

    protected override renderChordDiagrams(): void {
      this.chordDiagramsRendered = true;
      this.callOrder.push('renderChordDiagrams');
    }

    protected override renderHeadersAndFooters(): void {
      this.headersFootersRendered = true;
      this.callOrder.push('renderHeadersAndFooters');
    }

    protected override measureText(text: string, font: FontConfiguration): { width: number; height: number } {
      const width = text.length * 8;
      const height = Math.round(font.size * 1.2 * 1000) / 1000;
      return { width, height };
    }

    protected override calculateChordBaseline(yOffset: number, items: MeasuredItem[], chordText: string): number {
      const chordItem = items.find(({ item }) => item instanceof ChordLyricsPair && item.chords === chordText);
      const chordHeight = chordItem?.chordHeight ?? this.getFontConfiguration('chord').size;
      const maxChordHeight = this.getMaxChordHeight(items);
      const baseline = yOffset + maxChordHeight - chordHeight;
      return baseline;
    }

    protected override finalizeRendering(): void {
      this.finalized = true;
      this.callOrder.push('finalizeRendering');
    }

    protected override getConfiguration(): TestRendererConfiguration {
      return this.config;
    }

    protected override get dimensions(): Dimensions {
      return new Dimensions(
        this.config.page.width,
        this.config.page.height,
        {
          global: { margins: this.config.margins },
          header: { height: this.config.headerHeight, content: [] },
          footer: { height: this.config.footerHeight, content: [] },
          sections: {
            global: {
              columnWidth: 200,
              columnCount: this.config.columns.count,
              columnSpacing: this.config.columns.spacing,
              chordLyricSpacing: this.config.chordLyricSpacing,
              linePadding: 0,
              chordSpacing: 0,
              paragraphSpacing: this.config.paragraphSpacing,
            },
            base: {},
          },
        },
        {
          columnCount: this.config.columns.count,
          columnSpacing: this.config.columns.spacing,
        },
      );
    }

    protected override getDocPageSize(): { width: number; height: number } {
      return this.config.page;
    }

    protected override getHeaderHeight(): number {
      return this.config.headerHeight;
    }

    protected override getFooterHeight(): number {
      return this.config.footerHeight;
    }

    protected override getColumnCount(): number {
      return this.config.columns.count;
    }

    protected override getColumnSpacing(): number {
      return this.config.columns.spacing;
    }

    protected override getChordLyricSpacing(): number {
      return this.config.chordLyricSpacing;
    }

    protected override getParagraphSpacing(): number {
      return this.config.paragraphSpacing;
    }

    protected override useUnicodeModifiers(): boolean {
      return this.config.flags.useUnicodeModifiers;
    }

    protected override normalizeChords(): boolean {
      return this.config.flags.normalizeChords;
    }

    protected override isLyricsOnly(): boolean {
      return this.config.flags.lyricsOnly;
    }

    public override renderParagraphs(paragraphLayouts: ParagraphLayout[]): void {
      this.callOrder.push('renderParagraphs');
      super.renderParagraphs(paragraphLayouts);
    }

    public override renderLines(lines: LineLayout[]): void {
      this.callOrder.push('renderLines');
      super.renderLines(lines);
    }

    public override moveToNextColumn(): void {
      this.callOrder.push('moveToNextColumn');
      super.moveToNextColumn();
    }

    public override addTextElement(text: string, x: number, y: number, type: string): void {
      super.addTextElement(text, x, y, type);
    }

    public override getColumnStartX(): number {
      return super.getColumnStartX();
    }

    public override getColumnBottomY(): number {
      return super.getColumnBottomY();
    }

    public override getColumnWidth(): number {
      return super.getColumnWidth();
    }

    public override getMinX(): number {
      return super.getMinX();
    }

    public override getMinY(): number {
      return super.getMinY();
    }

    public override calculateChordLyricYOffsets(
      items: MeasuredItem[],
      yOffset: number,
    ): { chordsYOffset: number; lyricsYOffset: number } {
      return super.calculateChordLyricYOffsets(items, yOffset);
    }

    public override getElementsForPage(page: number): PositionedElement[] {
      return super.getElementsForPage(page);
    }

    public override processChords(chords: string, line: Line): string {
      return super.processChords(chords, line);
    }

    public override getFontConfiguration(objectType: string): FontConfiguration {
      if (objectType === 'chord') {
        return this.config.fonts.chord;
      }

      if (objectType === 'sectionLabel') {
        return this.config.fonts.sectionLabel;
      }

      if (objectType === 'comment') {
        return this.config.fonts.comment;
      }

      return this.config.fonts.text;
    }

    public getElements(): PositionedElement[] {
      return this.elements;
    }

    public resetCallOrder() {
      this.callOrder = [];
    }

    public getX(): number {
      return this.x;
    }

    public setX(value: number): void {
      this.x = value;
    }

    public getY(): number {
      return this.y;
    }

    public setY(value: number): void {
      this.y = value;
    }

    public getCurrentColumn(): number {
      return this.currentColumn;
    }

    public setCurrentColumn(value: number): void {
      this.currentColumn = value;
    }

    public getCurrentPage(): number {
      return this.currentPage;
    }

    public setCurrentPage(value: number): void {
      this.currentPage = value;
    }

    public getStartTime(): number {
      return this.startTime;
    }

    protected override recordRenderingTime(): void {
      super.recordRenderingTime();
      this.callOrder.push('recordRenderingTime');
    }

    public override getDocumentMetadata(): Record<string, any> {
      return {
        pageWidth: this.getPageWidth(),
        pageHeight: this.getPageHeight(),
        margins: this.config.margins,
        columnCount: this.getColumnCount(),
        columnWidth: this.getColumnWidth(),
        columnSpacing: this.getColumnSpacing(),
        renderTime: this.getRenderTime(),
        currentPage: this.getCurrentPage(),
        totalPages: this.getTotalPages(),
      };
    }
  }

  function createFontConfig(overrides: Partial<FontConfiguration> = {}): FontConfiguration {
    return {
      name: 'Helvetica',
      style: 'normal',
      size: 12,
      color: '#000000',
      ...overrides,
    };
  }

  function createMargins(
    overrides: Partial<TestRendererConfiguration['margins']> = {},
  ): TestRendererConfiguration['margins'] {
    return {
      left: 50,
      right: 50,
      top: 50,
      bottom: 50,
      ...overrides,
    };
  }

  function createColumns(
    overrides: Partial<TestRendererConfiguration['columns']> = {},
  ): TestRendererConfiguration['columns'] {
    return {
      count: overrides.count ?? 1,
      spacing: overrides.spacing ?? 20,
    };
  }

  function createFonts(
    overrides: Partial<TestRendererConfiguration['fonts']> = {},
  ): TestRendererConfiguration['fonts'] {
    return {
      chord: overrides.chord ?? createFontConfig({ size: 14 }),
      text: overrides.text ?? createFontConfig({ size: 12 }),
      sectionLabel: overrides.sectionLabel ?? createFontConfig({ size: 12, style: 'bold' }),
      comment: overrides.comment ?? createFontConfig({ size: 12, style: 'italic', color: '#666666' }),
    };
  }

  function createFlags(
    overrides: Partial<TestRendererConfiguration['flags']> = {},
  ): TestRendererConfiguration['flags'] {
    return {
      useUnicodeModifiers: overrides.useUnicodeModifiers ?? false,
      normalizeChords: overrides.normalizeChords ?? false,
      lyricsOnly: overrides.lyricsOnly ?? false,
    };
  }

  function createTestConfig(overrides: Partial<TestRendererConfiguration> = {}): TestRendererConfiguration {
    const page = {
      width: 612,
      height: 792,
      ...(overrides.page ?? {}),
    };

    return {
      page,
      margins: createMargins(overrides.margins),
      headerHeight: overrides.headerHeight ?? 30,
      footerHeight: overrides.footerHeight ?? 30,
      columns: createColumns(overrides.columns),
      fonts: createFonts(overrides.fonts),
      paragraphSpacing: overrides.paragraphSpacing ?? 10,
      chordLyricSpacing: overrides.chordLyricSpacing ?? 6,
      flags: createFlags(overrides.flags),
      decapo: overrides.decapo ?? 0,
    };
  }

  function createTestSong(metadataOverrides: Record<string, string> = {}): Song {
    const song = new Song({
      title: 'Test Song',
      artist: 'Test Artist',
      key: 'C',
      ...metadataOverrides,
    });

    song.lines = [];
    return song;
  }

  function createMeasuredItem(
    item: ChordLyricsPair | Tag | null,
    width = 50,
    chordHeight?: number,
  ): MeasuredItem {
    return {
      item,
      width,
      chordHeight,
    };
  }

  function createLineWithItems(items: (ChordLyricsPair | Tag)[], type = 'verse'): Line {
    return new Line({ type, items });
  }

  function createLineLayout(
    items: MeasuredItem[],
    lineHeight = 20,
    line?: Line,
    type: LineLayout['type'] = 'ChordLyricsPair',
  ): LineLayout {
    return {
      type,
      items,
      lineHeight,
      line: line || new Line(),
    };
  }

  function createChordLyricsLineLayout(
    chordText = 'C',
    lyrics = 'Hello',
    width = 50,
    chordHeight = 12,
  ): LineLayout {
    const pair = new ChordLyricsPair(chordText, lyrics);
    const line = createLineWithItems([pair]);
    return createLineLayout([
      createMeasuredItem(pair, width, chordHeight),
    ], 20, line);
  }

  function createParagraphLayout(
    units: LineLayout[][],
    addSpacing = false,
    sectionType = 'verse',
  ): ParagraphLayout {
    return {
      units,
      addSpacing,
      sectionType,
    };
  }

  let song: Song;
  let config: TestRendererConfiguration;
  let renderer: TestRenderer;

  beforeEach(() => {
    song = createTestSong();
    config = createTestConfig();
    renderer = new TestRenderer(song, config);
  });

  describe('constructor', () => {
    it('initializes with song and sets start time', () => {
      expect(renderer).toBeDefined();
      expect((renderer as any).song).toBe(song);
      expect(renderer.getStartTime()).toBeGreaterThan(0);
    });
  });

  describe('initialize', () => {
    it('sets initial position and state', () => {
      renderer.initialize();

      expect(renderer.backendInitialized).toBe(true);
      expect(renderer.getX()).toEqual(config.margins.left);
      expect(renderer.getY()).toEqual(config.margins.top + config.headerHeight);
      expect(renderer.getCurrentColumn()).toEqual(1);
      expect(renderer.getCurrentPage()).toEqual(1);
      expect(renderer.getElements()).toHaveLength(0);
    });

    it('resets state on subsequent calls', () => {
      renderer.initialize();
      renderer.addTextElement('Test', 0, 0, 'chord');
      renderer.setX(999);
      renderer.setY(888);
      renderer.setCurrentColumn(3);
      renderer.setCurrentPage(5);

      renderer.initialize();

      expect(renderer.backendInitialized).toBe(true);
      expect(renderer.getX()).toEqual(config.margins.left);
      expect(renderer.getY()).toEqual(config.margins.top + config.headerHeight);
      expect(renderer.getCurrentColumn()).toEqual(1);
      expect(renderer.getCurrentPage()).toEqual(1);
      expect(renderer.getElements()).toHaveLength(0);
    });
  });

  describe('render', () => {
    it('orchestrates full rendering pipeline', () => {
      const layouts = [
        createParagraphLayout([[createChordLyricsLineLayout()]]),
        createParagraphLayout([[createChordLyricsLineLayout()]]),
      ];

      const renderParagraphsSpy = jest.spyOn(renderer, 'renderParagraphs');
      const renderChordDiagramsSpy = jest.spyOn(renderer as any, 'renderChordDiagrams');
      const renderHeadersFootersSpy = jest.spyOn(renderer as any, 'renderHeadersAndFooters');
      const finalizeSpy = jest.spyOn(renderer as any, 'finalizeRendering');
      const recordSpy = jest.spyOn(renderer as any, 'recordRenderingTime');

      renderer.render(layouts);

      expect(renderParagraphsSpy).toHaveBeenCalledWith(layouts);
      expect(renderChordDiagramsSpy).toHaveBeenCalledTimes(1);
      expect(renderHeadersFootersSpy).toHaveBeenCalledTimes(1);
      expect(finalizeSpy).toHaveBeenCalledTimes(1);
      expect(recordSpy).toHaveBeenCalledTimes(1);
      const { callOrder } = renderer;
      const getIndex = (label: string) => {
        const index = callOrder.indexOf(label);
        expect(index).toBeGreaterThanOrEqual(0);
        return index;
      };

      expect(getIndex('initialize')).toBeLessThan(getIndex('initializeBackend'));
      expect(getIndex('initializeBackend')).toBeLessThan(getIndex('renderParagraphs'));
      expect(getIndex('renderParagraphs')).toBeLessThan(getIndex('renderChordDiagrams'));
      expect(getIndex('renderChordDiagrams')).toBeLessThan(getIndex('renderHeadersAndFooters'));
      expect(getIndex('renderHeadersAndFooters')).toBeLessThan(getIndex('finalizeRendering'));
      expect(getIndex('finalizeRendering')).toBeLessThan(getIndex('recordRenderingTime'));
    });

    it('records rendering time', () => {
      renderer.render([]);
      expect(renderer.getRenderTime()).toBeGreaterThanOrEqual(0);
    });
  });

  describe('renderParagraphs', () => {
    it('renders all paragraph units', () => {
      renderer.initialize();
      renderer.resetCallOrder();

      const line1 = createChordLyricsLineLayout('C', 'Line1');
      const line2 = createChordLyricsLineLayout('G', 'Line2');
      const line3 = createChordLyricsLineLayout('Am', 'Line3');
      const line4 = createChordLyricsLineLayout('F', 'Line4');

      const paragraphs = [
        createParagraphLayout([[line1], [line2]]),
        createParagraphLayout([[line3], [line4]]),
      ];

      renderer.renderParagraphs(paragraphs);

      const renderLineCalls = renderer.callOrder.filter((entry) => entry === 'renderLines');
      expect(renderLineCalls).toHaveLength(4);
    });

    it('adds paragraph spacing when specified', () => {
      renderer.initialize();
      const initialY = renderer.getY();
      const line = createChordLyricsLineLayout('C', 'Line', 10, 10);
      const paragraph = createParagraphLayout([[line]], true);

      renderer.renderParagraphs([paragraph]);

      expect(renderer.getY()).toEqual(initialY + line.lineHeight + config.paragraphSpacing);
    });

    it('skips spacing when addSpacing is false', () => {
      renderer.initialize();
      const initialY = renderer.getY();
      const line = createChordLyricsLineLayout('C', 'Line', 10, 10);
      const paragraph = createParagraphLayout([[line]], false);

      renderer.renderParagraphs([paragraph]);

      expect(renderer.getY()).toEqual(initialY + line.lineHeight);
    });
  });

  describe('renderLines', () => {
    it('handles column break and moves to next column', () => {
      config.columns.count = 2;
      renderer.initialize();
      renderer.resetCallOrder();

      const columnBreak = createColumnBreakLineLayout();

      renderer.renderLines([columnBreak]);

      expect(renderer.getCurrentColumn()).toEqual(2);
      expect(renderer.getX()).toEqual(renderer.getColumnStartX());
      expect(renderer.getY()).toEqual(renderer.getMinY());
    });

    it('moves to next column when line does not fit', () => {
      config.columns.count = 2;
      config.page.height = 200;
      config.margins.top = 10;
      config.headerHeight = 10;
      config.margins.bottom = 10;
      config.footerHeight = 10;
      renderer = new TestRenderer(song, config);
      renderer.initialize();
      renderer.setY(renderer.getColumnBottomY() - 5);
      const tallLine = createChordLyricsLineLayout('C', 'Tall', 50, 12);
      tallLine.lineHeight = 20;

      renderer.renderLines([tallLine]);

      expect(renderer.getCurrentColumn()).toEqual(2);
      expect(renderer.getY()).toEqual(renderer.getMinY() + tallLine.lineHeight);
    });

    it('renders chord-lyric pairs correctly', () => {
      renderer.initialize();
      const line = createChordLyricsLineLayout('C', 'Hello');

      renderer.renderLines([line]);

      const elements = renderer.getElements();
      expect(elements).toHaveLength(2);
      expect(elements[0]).toMatchObject({ type: 'chord', content: 'C' });
      expect(elements[1]).toMatchObject({ type: 'lyrics', content: 'Hello' });
    });

    it('skips chords in lyrics-only mode', () => {
      config.flags.lyricsOnly = true;
      renderer = new TestRenderer(song, config);
      renderer.initialize();
      const pair = new ChordLyricsPair('C', 'Hello');
      const line = createLineLayout([
        createMeasuredItem(pair, 50, 12),
      ], 20, createLineWithItems([pair]));

      renderer.renderLines([line]);

      const elements = renderer.getElements();
      expect(elements).toHaveLength(1);
      expect(elements[0].type).toBe('lyrics');
    });

    it('renders section labels', () => {
      renderer.initialize();
      const tag = new Tag('start_of_chorus', '');
      tag.attributes.label = 'Chorus';
      const line = createLineLayout([
        createMeasuredItem(tag, 50),
      ], 0, createLineWithItems([tag], 'sectionLabel'), 'Tag');

      renderer.renderLines([line]);

      const sectionElement = renderer.getElements().find((element) => element.type === 'sectionLabel');
      expect(sectionElement?.content).toBe('Chorus');
    });

    it('renders comments', () => {
      renderer.initialize();
      const commentTag = new Tag('comment', 'This is a comment');
      const line = createLineLayout([
        createMeasuredItem(commentTag, 50),
      ], 0, createLineWithItems([commentTag], 'comment'), 'Comment');

      renderer.renderLines([line]);

      const commentElement = renderer.getElements().find((element) => element.type === 'comment');
      expect(commentElement?.content).toBe('This is a comment');
    });

    it('updates y position after rendering line', () => {
      renderer.initialize();
      const initialY = renderer.getY();
      const line = createChordLyricsLineLayout('C', 'Hello');
      line.lineHeight = 15;

      renderer.renderLines([line]);

      expect(renderer.getY()).toEqual(initialY + 15);
    });

    it('resets x to column start after each line', () => {
      renderer.initialize();
      renderer.setX(999);
      const line = createChordLyricsLineLayout('C', 'Hello');

      renderer.renderLines([line]);

      expect(renderer.getX()).toEqual(renderer.getColumnStartX());
    });
  });

  describe('moveToNextColumn', () => {
    it('increments column and resets position', () => {
      config.columns.count = 2;
      renderer = new TestRenderer(song, config);
      renderer.initialize();

      renderer.moveToNextColumn();

      expect(renderer.getCurrentColumn()).toEqual(2);
      expect(renderer.getX()).toEqual(renderer.getColumnStartX());
      expect(renderer.getY()).toEqual(renderer.getMinY());
    });

    it('starts new page when exceeding column count', () => {
      config.columns.count = 2;
      renderer = new TestRenderer(song, config);
      renderer.initialize();
      renderer.setCurrentColumn(2);
      const startNewPageSpy = jest.spyOn(renderer as any, 'startNewPage');

      renderer.moveToNextColumn();

      expect(startNewPageSpy).toHaveBeenCalled();
      expect(renderer.getCurrentColumn()).toEqual(1);
      expect(renderer.getCurrentPage()).toEqual(2);
    });
  });

  describe('calculateChordLyricYOffsets', () => {
    it('positions chords above lyrics when both present', () => {
      const pair = new ChordLyricsPair('C', 'Hello');
      const items = [createMeasuredItem(pair, 50, 14)];

      const { chordsYOffset, lyricsYOffset } = renderer.calculateChordLyricYOffsets(items, 100);

      expect(chordsYOffset).toEqual(100);
      expect(lyricsYOffset).toEqual(100 + 14 + config.chordLyricSpacing);
    });

    it('positions chords only when no lyrics', () => {
      const pair = new ChordLyricsPair('C', '');
      const items = [createMeasuredItem(pair, 50, 12)];

      const { chordsYOffset, lyricsYOffset } = renderer.calculateChordLyricYOffsets(items, 80);

      expect(chordsYOffset).toEqual(80);
      expect(lyricsYOffset).toEqual(80);
    });

    it('positions lyrics only when no chords', () => {
      const pair = new ChordLyricsPair('', 'Hello');
      const items = [createMeasuredItem(pair, 50)];

      const { chordsYOffset, lyricsYOffset } = renderer.calculateChordLyricYOffsets(items, 70);

      expect(chordsYOffset).toEqual(70);
      expect(lyricsYOffset).toEqual(70);
    });
  });

  describe('addTextElement', () => {
    it('adds element to elements array with correct properties', () => {
      renderer.initialize();
      renderer.addTextElement('Test', 50, 100, 'chord');

      const [element] = renderer.getElements();
      expect(element).toMatchObject({
        x: 50,
        y: 100,
        content: 'Test',
        type: 'chord',
        page: 1,
        column: 1,
      });
      expect(element.width).toBe(32);
      expect(element.height).toBeCloseTo(config.fonts.chord.size * 1.2, 5);
    });

    it('uses correct font for element type', () => {
      renderer.initialize();
      renderer.addTextElement('Chord', 0, 0, 'chord');
      renderer.addTextElement('Lyrics', 0, 0, 'lyrics');
      renderer.addTextElement('Section', 0, 0, 'sectionLabel');
      renderer.addTextElement('Comment', 0, 0, 'comment');

      const [chord, lyrics, section, comment] = renderer.getElements();
      expect(chord.style).toEqual(config.fonts.chord);
      expect(lyrics.style).toEqual(config.fonts.text);
      expect(section.style).toEqual(config.fonts.sectionLabel);
      expect(comment.style).toEqual(config.fonts.comment);
    });
  });

  describe('getColumnStartX', () => {
    it('calculates correct X for column 1', () => {
      renderer.initialize();
      renderer.setCurrentColumn(1);
      expect(renderer.getColumnStartX()).toEqual(config.margins.left);
    });

    it('calculates correct X for column 2', () => {
      config.columns.count = 2;
      config.columns.spacing = 20;
      renderer = new TestRenderer(song, config);
      renderer.initialize();
      renderer.setCurrentColumn(2);
      const expected = config.margins.left + renderer.getColumnWidth() + config.columns.spacing;
      expect(renderer.getColumnStartX()).toEqual(expected);
    });

    it('calculates correct X for column 3', () => {
      config.columns.count = 3;
      config.columns.spacing = 20;
      renderer = new TestRenderer(song, config);
      renderer.initialize();
      renderer.setCurrentColumn(3);
      const columnWidth = renderer.getColumnWidth();
      const expected = config.margins.left + 2 * (columnWidth + config.columns.spacing);
      expect(renderer.getColumnStartX()).toEqual(expected);
    });
  });

  describe('getColumnBottomY', () => {
    it('calculates bottom Y considering margins and footer', () => {
      config.page.height = 792;
      config.margins.bottom = 50;
      config.footerHeight = 30;
      renderer = new TestRenderer(song, config);
      const expected = 792 - 50 - 30;
      expect(renderer.getColumnBottomY()).toEqual(expected);
    });
  });

  describe('getColumnWidth', () => {
    it('calculates width for single column', () => {
      const expected = config.page.width - config.margins.left - config.margins.right;
      expect(renderer.getColumnWidth()).toEqual(expected);
    });

    it('calculates width for multiple columns with spacing', () => {
      config.columns.count = 2;
      config.columns.spacing = 20;
      renderer = new TestRenderer(song, config);
      const availableWidth = config.page.width - config.margins.left - config.margins.right;
      const expected = (availableWidth - config.columns.spacing) / 2;
      expect(renderer.getColumnWidth()).toEqual(expected);
    });
  });

  describe('getElementsForPage', () => {
    it('filters elements by page number', () => {
      renderer.initialize();
      renderer.addTextElement('Page1', 0, 0, 'lyrics');
      renderer.addTextElement('Page1 second', 0, 0, 'lyrics');

      renderer.setCurrentPage(2);
      renderer.addTextElement('Page2', 0, 0, 'lyrics');

      const page1Elements = renderer.getElementsForPage(1);
      const page2Elements = renderer.getElementsForPage(2);

      expect(page1Elements).toHaveLength(2);
      expect(page2Elements).toHaveLength(1);
      expect(page2Elements[0].content).toBe('Page2');
    });
  });

  describe('processChords', () => {
    it('processes chords with song context', () => {
      const line = new Line();
      const processed = renderer.processChords('C', line);
      expect(processed).toBe('C');
    });

    it('applies unicode modifiers when enabled', () => {
      config.flags.useUnicodeModifiers = true;
      renderer = new TestRenderer(song, config);
      const line = new Line();
      const processed = renderer.processChords('F#', line);
      expect(processed).toContain('♯');
    });
  });
});
