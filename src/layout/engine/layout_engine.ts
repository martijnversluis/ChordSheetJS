import Item from '../../chord_sheet/item';
import { ItemProcessor } from './item_processor';
import { LayoutFactory } from './layout_factory';
import Line from '../../chord_sheet/line';
import { LineBreaker } from './line_breaker';
import { Measurer } from '../measurement';
import Paragraph from '../../chord_sheet/paragraph';
import { ParagraphSplitter } from './paragraph_splitter';
import SoftLineBreak from '../../chord_sheet/soft_line_break';
import Song from '../../chord_sheet/song';
import Tag from '../../chord_sheet/tag';
import TitleSeparatorTag from './title_separator_tag';
import { LayoutConfig, LineLayout, ParagraphLayoutResult } from './types';
import { calculateTotalHeight, isColumnBreakLayout } from './layout_helpers';
import { isComment, isTag, lineHasContents } from '../../template_helpers';

interface ProcessParagraphParams {
  paragraph: Paragraph;
  index: number;
  processedParagraphs: Paragraph[];
  skipIndices: Set<number>;
  bodyParagraphs: Paragraph[];
}

interface HandleRepeatedSectionParams {
  cachedParagraph: Paragraph;
  currentParagraph: Paragraph;
  processedParagraphs: Paragraph[];
  skipIndices: Set<number>;
  startIndex: number;
  bodyParagraphs: Paragraph[];
}

interface LayoutSimulationState {
  currentY: number;
  currentColumn: number;
}

interface LineTypeCounts {
  chordLyricLineCount: number;
  nonLyricLineCount: number;
}

/**
 * Engine for layout calculations
 */
export class LayoutEngine {
  private paragraphSplitter: ParagraphSplitter;

  private itemProcessor: ItemProcessor;

  private layoutFactory: LayoutFactory;

  private lineBreaker: LineBreaker;

  private sectionCache: Map<string, Paragraph> = new Map<string, Paragraph>();

  constructor(
    private song: Song,
    private measurer: Measurer,
    private config: LayoutConfig,
  ) {
    // Process repeated sections before layout computation
    this.processRepeatedSections();

    // Initialize component classes
    this.itemProcessor = new ItemProcessor(this.measurer, this.config, this.song);
    this.layoutFactory = new LayoutFactory(config);
    this.lineBreaker = new LineBreaker(this.itemProcessor, this.layoutFactory);
    this.paragraphSplitter = new ParagraphSplitter();
  }

  /**
   * Normalize section label by removing repeat indicators like "(2x)", "(3x)", etc.
   * @param label The section label to normalize
   * @returns The normalized label
   */
  private normalizeSectionLabel(label: string | null): string | null {
    if (!label) return null;

    // Remove patterns like "(2x)", "(3x)", "(repeat)", etc.
    return label
      .replace(/\s*\([^)]*(?:x|\d+|repeat|rep)\s*[^)]*\)\s*$/i, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_');
  }

  /**
   * Get the cache key for a section based on its normalized label
   * @param paragraph The paragraph to get the cache key for
   * @returns The cache key or null if the paragraph doesn't have a label
   */
  private getSectionCacheKey(paragraph: Paragraph): string | null {
    let label: string | null = null;

    // First check if paragraph has a label
    if (paragraph.label) {
      label = paragraph.label;
    } else if (paragraph.lines.length > 0) {
      label = this.extractLabelFromFirstItem(paragraph.lines[0].items[0]);
    }

    const normalizedLabel = this.normalizeSectionLabel(label);
    return normalizedLabel ?? null;
  }

  private extractLabelFromFirstItem(firstItem: Item | undefined): string | null {
    if (!firstItem || !isTag(firstItem)) {
      return null;
    }

    const tag = firstItem as Tag;

    if (!isComment(tag) && !tag.isSectionDelimiter()) {
      return null;
    }

    return tag.label || tag.value || null;
  }

  /**
   * Process repeated sections by modifying the song's bodyParagraphs array
   * This is called in the constructor to preprocess the song before layout computation
   */
  private processRepeatedSections(): void {
    if (!this.config.repeatedSections) {
      return;
    }

    this.sectionCache.clear();

    const processedParagraphs: Paragraph[] = [];
    const skipIndices = new Set<number>();
    const { bodyParagraphs } = this.song.clone();

    bodyParagraphs.forEach((paragraph, index) => {
      this.processParagraph({
        paragraph,
        index,
        processedParagraphs,
        skipIndices,
        bodyParagraphs,
      });
    });

    (this.song as any).renderParagraphs = processedParagraphs;
    this.sectionCache.clear();
  }

  private processParagraph(params: ProcessParagraphParams): void {
    const {
      paragraph,
      index,
      skipIndices,
      processedParagraphs,
    } = params;

    if (this.shouldSkipParagraphIndex(index, skipIndices)) {
      return;
    }

    const cacheKey = this.getSectionCacheKey(paragraph);

    if (!cacheKey) {
      this.addUncachedParagraph(processedParagraphs, paragraph);
      return;
    }

    this.handleParagraphWithCacheKey(cacheKey, params);
  }

  private shouldSkipParagraphIndex(index: number, skipIndices: Set<number>): boolean {
    return skipIndices.has(index);
  }

  private addUncachedParagraph(processedParagraphs: Paragraph[], paragraph: Paragraph): void {
    processedParagraphs.push(this.cloneParagraph(paragraph));
  }

  private handleParagraphWithCacheKey(cacheKey: string, params: ProcessParagraphParams): void {
    const paragraphClone = this.cloneParagraph(params.paragraph);

    if (this.cacheFirstOccurrence(cacheKey, paragraphClone, params.processedParagraphs)) {
      return;
    }

    const cachedParagraph = this.sectionCache.get(cacheKey);

    if (!cachedParagraph) {
      return;
    }

    this.handleRepeatedSection({
      cachedParagraph,
      currentParagraph: paragraphClone,
      processedParagraphs: params.processedParagraphs,
      skipIndices: params.skipIndices,
      startIndex: params.index,
      bodyParagraphs: params.bodyParagraphs,
    });
  }

  private cacheFirstOccurrence(
    cacheKey: string,
    paragraph: Paragraph,
    processedParagraphs: Paragraph[],
  ): boolean {
    if (this.sectionCache.has(cacheKey)) {
      return false;
    }

    this.sectionCache.set(cacheKey, paragraph);
    processedParagraphs.push(paragraph);
    return true;
  }

  private handleRepeatedSection(params: HandleRepeatedSectionParams): void {
    switch (this.config.repeatedSections) {
      case 'hide':
        return;
      case 'title_only':
        this.handleTitleOnlyMode(params);
        return;
      case 'lyrics_only':
        params.processedParagraphs.push(params.currentParagraph);
        return;
      case 'full':
        this.handleFullMode(params);
        return;
      default:
        params.processedParagraphs.push(params.currentParagraph);
    }
  }

  private handleTitleOnlyMode(params: HandleRepeatedSectionParams): void {
    const titleParagraphs = this.collectTitleParagraphs(params);
    // Note: We intentionally do NOT call appendTitlesToCachedParagraph here
    // as it would corrupt the cached paragraph for subsequent renders
    params.processedParagraphs.push(this.resolveTitleOnlyParagraph(titleParagraphs));
  }

  private collectTitleParagraphs(params: HandleRepeatedSectionParams): Paragraph[] {
    const {
      currentParagraph,
      skipIndices,
      startIndex,
      bodyParagraphs,
    } = params;
    const titles: Paragraph[] = [this.createTitleOnlyParagraph(currentParagraph)];

    for (let nextIndex = startIndex + 1; nextIndex < bodyParagraphs.length; nextIndex += 1) {
      const nextParagraph = bodyParagraphs[nextIndex];

      if (skipIndices.has(nextIndex)) {
        // Already consolidated earlier
      } else if (!this.shouldIncludeTitle(nextParagraph)) {
        break;
      } else {
        titles.push(this.createTitleOnlyParagraph(nextParagraph));
        skipIndices.add(nextIndex);
      }
    }

    return titles;
  }

  private shouldIncludeTitle(paragraph: Paragraph): boolean {
    const cacheKey = this.getSectionCacheKey(paragraph);
    return Boolean(cacheKey && this.sectionCache.has(cacheKey));
  }

  private resolveTitleOnlyParagraph(titles: Paragraph[]): Paragraph {
    if (titles.length === 1) {
      return titles[0];
    }

    return this.consolidateTitles(titles);
  }

  private handleFullMode(params: HandleRepeatedSectionParams): void {
    const { cachedParagraph, currentParagraph, processedParagraphs } = params;
    const mergedParagraph = new Paragraph();

    this.buildFullModeLines(currentParagraph, cachedParagraph).forEach((line) => {
      mergedParagraph.addLine(line);
    });

    processedParagraphs.push(mergedParagraph);
  }

  private buildFullModeLines(currentParagraph: Paragraph, cachedParagraph: Paragraph): Line[] {
    if (currentParagraph.lines.length === 0) {
      return cachedParagraph.lines.map((line) => line.clone());
    }

    const firstLine = currentParagraph.lines[0];
    const firstItem = firstLine.items[0];

    if (firstItem && isTag(firstItem)) {
      return [
        firstLine.clone(),
        ...cachedParagraph.lines.slice(1).map((line) => line.clone()),
      ];
    }

    return [
      ...currentParagraph.lines.map((line) => line.clone()),
      ...cachedParagraph.lines.slice(1).map((line) => line.clone()),
    ];
  }

  private consolidateTitles(titleParagraphs: Paragraph[]): Paragraph {
    const consolidated = this.cloneParagraph(titleParagraphs[0]);

    if (consolidated.lines.length === 0) {
      return consolidated;
    }

    const consolidatedLine = consolidated.lines[0];

    titleParagraphs.slice(1).forEach((titleParagraph) => {
      if (titleParagraph.lines.length === 0) {
        return;
      }

      const titleLine = titleParagraph.lines[0];
      this.addTitleSeparator(consolidatedLine);
      titleLine.items.forEach((item) => {
        consolidatedLine.items.push(this.cloneItem(item));
      });
    });

    return consolidated;
  }

  private addTitleSeparator(line: Line): void {
    line.items.push(...this.buildTitleSeparatorItems());
  }

  private buildTitleSeparatorItems(): Item[] {
    return [
      new SoftLineBreak(' '),
      new TitleSeparatorTag() as unknown as Item,
      new SoftLineBreak(' '),
    ] as unknown as Item[];
  }

  private createTitleOnlyParagraph(originalParagraph: Paragraph): Paragraph {
    const titleParagraph = new Paragraph();

    if (originalParagraph.lines.length === 0) {
      return titleParagraph;
    }

    const firstLine = originalParagraph.lines[0];
    const titleLine = new Line({ type: firstLine.type, items: [] });

    firstLine.items.forEach((item) => {
      if (isTag(item)) {
        titleLine.addItem(this.cloneItem(item));
      }
    });

    if (titleLine.items.length === 0) {
      titleLine.items = [
        ...firstLine.items.map((item) => this.cloneItem(item)),
      ];
    }

    titleParagraph.addLine(titleLine);
    return titleParagraph;
  }

  private cloneParagraph(paragraph: Paragraph): Paragraph {
    const clonedParagraph = new Paragraph();
    paragraph.lines.forEach((line) => clonedParagraph.addLine(line.clone()));
    return clonedParagraph;
  }

  private cloneItem(item: Item): Item {
    if (item instanceof SoftLineBreak) {
      return new SoftLineBreak(item.content) as unknown as Item;
    }

    if (typeof (item as { clone?: () => Item }).clone === 'function') {
      return (item as { clone: () => Item }).clone();
    }

    return item;
  }

  /**
   * Compute layouts for all paragraphs in the song
   */
  public computeParagraphLayouts(): ParagraphLayoutResult[] {
    const layouts: ParagraphLayoutResult[] = [];
    let state: LayoutSimulationState = {
      currentY: this.config.minY,
      currentColumn: 1,
    };

    this.song.renderParagraphs.forEach((paragraph) => {
      state = this.processParagraphLayout(paragraph, layouts, state);
    });

    return layouts;
  }

  private processParagraphLayout(
    paragraph: Paragraph,
    layouts: ParagraphLayoutResult[],
    state: LayoutSimulationState,
  ): LayoutSimulationState {
    const lineLayouts = this.computeParagraphLayout(
      paragraph,
      this.config.columnWidth,
      this.config.displayLyricsOnly,
    );
    const counts = this.computeLineTypeCounts(lineLayouts);
    if (this.shouldSkipParagraphLayout(counts)) {
      return state;
    }
    const adjustedLayouts = this.adjustParagraphLayouts(
      lineLayouts,
      state,
      counts.chordLyricLineCount,
    );
    const updatedState = this.calculateNextSimulationState(adjustedLayouts, state);
    this.addParagraphLayout(layouts, paragraph, adjustedLayouts);
    return updatedState;
  }

  private computeLineTypeCounts(lineLayouts: LineLayout[][]): LineTypeCounts {
    let chordLyricLineCount = 0;
    let nonLyricLineCount = 0;

    lineLayouts.forEach((lines) => {
      lines.forEach((layout) => {
        if (layout.type === 'ChordLyricsPair') {
          chordLyricLineCount += 1;
        } else if (layout.type === 'Comment' || layout.type === 'SectionLabel') {
          nonLyricLineCount += 1;
        }
      });
    });

    return { chordLyricLineCount, nonLyricLineCount };
  }

  private shouldSkipParagraphLayout(counts: LineTypeCounts): boolean {
    const lyricsOnly = Boolean(this.config.displayLyricsOnly);
    return lyricsOnly &&
      counts.nonLyricLineCount === 1 &&
      counts.chordLyricLineCount === 0;
  }

  private adjustParagraphLayouts(
    lineLayouts: LineLayout[][],
    state: LayoutSimulationState,
    chordLyricLineCount: number,
  ): LineLayout[][] {
    const totalHeight = calculateTotalHeight(lineLayouts);

    if (state.currentY + totalHeight <= this.config.columnBottomY) {
      return lineLayouts;
    }

    return this.paragraphSplitter.splitParagraph(
      lineLayouts,
      state.currentY,
      this.config.minY,
      this.config.columnBottomY,
      chordLyricLineCount,
    );
  }

  private calculateNextSimulationState(
    layouts: LineLayout[][],
    state: LayoutSimulationState,
  ): LayoutSimulationState {
    let { currentY, currentColumn } = state;

    layouts.forEach((lines) => {
      if (isColumnBreakLayout(lines)) {
        currentColumn += 1;
        if (currentColumn > (this.config.columnCount || 1)) {
          currentColumn = 1;
        }
        currentY = this.config.minY;
      } else {
        const linesHeight = lines.reduce((sum, line) => sum + line.lineHeight, 0);
        currentY += linesHeight;
      }
    });

    currentY += this.config.paragraphSpacing;

    return {
      currentY,
      currentColumn,
    };
  }

  private addParagraphLayout(
    layouts: ParagraphLayoutResult[],
    paragraph: Paragraph,
    units: LineLayout[][],
  ): void {
    layouts.push({
      units,
      addSpacing: true,
      sectionType: paragraph.type,
    });
  }

  /**
   * Compute layout for a single paragraph
   */
  private computeParagraphLayout(
    paragraph: Paragraph,
    availableWidth: number,
    lyricsOnly = false,
  ): LineLayout[][] {
    const paragraphLineLayouts: LineLayout[][] = [];

    paragraph.lines.forEach((line) => {
      if (lineHasContents(line)) {
        // Delegate to LineBreaker
        const lineLayouts = this.lineBreaker.breakLineIntoLayouts(line, availableWidth, lyricsOnly);
        paragraphLineLayouts.push(lineLayouts);
      }
    });

    return paragraphLineLayouts;
  }
}
