import ChordLyricsPair from '../../chord_sheet/chord_lyrics_pair';
import { ItemProcessor } from './item_processor';
import { LayoutFactory } from './layout_factory';
import Line from '../../chord_sheet/line';
import SoftLineBreak from '../../chord_sheet/soft_line_break';
import { isFlowSymbolKind } from '../../chord_sheet/chord_line_token';
import { LineLayout, MeasuredItem } from './types';

/**
 * Handles breaking lines into layouts based on available width
 */
export class LineBreaker {
  private readonly itemProcessor: ItemProcessor;

  private readonly layoutFactory: LayoutFactory;

  constructor(itemProcessor: ItemProcessor, layoutFactory: LayoutFactory) {
    this.itemProcessor = itemProcessor;
    this.layoutFactory = layoutFactory;
  }

  /**
   * Break a line into layouts that fit within the available width
   */
  breakLineIntoLayouts(line: Line, availableWidth: number, lyricsOnly = false): LineLayout[] {
    const rawMeasuredItems = this.itemProcessor.measureLineItems(line, lyricsOnly);
    const measuredItems = this.consolidateConsecutiveSoftBreaks(rawMeasuredItems);
    return this.breakContent(measuredItems, availableWidth, line);
  }

  /**
   * Recursively break content into layouts that fit within the available width
   */
  private breakContent(items: MeasuredItem[], availableWidth: number, line: Line | null): LineLayout[] {
    if (items.length === 0) {
      return [];
    }

    const { totalWidth, softBreakIndices } = this.analyzeContent(items);

    if (this.shouldReturnSingleLayout(totalWidth, availableWidth)) {
      return [this.layoutFactory.createLineLayout(items, line as Line)];
    }

    if (softBreakIndices.length === 0) {
      return this.handleNoSoftBreaks(items, availableWidth, line);
    }

    const { firstChunk, secondChunk } = this.splitAtBestSoftBreak(items, softBreakIndices, totalWidth, availableWidth);

    if (firstChunk.length === 0) {
      return this.breakContent(secondChunk, availableWidth, line);
    }

    const firstLayout = this.layoutFactory.createLineLayout(firstChunk, line as Line);

    return [
      firstLayout,
      ...this.breakContent(secondChunk, availableWidth, line),
    ];
  }

  /**
   * Handle content with no soft breaks
   */
  private handleNoSoftBreaks(items: MeasuredItem[], availableWidth: number, line: Line | null): LineLayout[] {
    const breakIndex = this.findBreakIndex(items, availableWidth);

    if (breakIndex === -1) {
      return [this.layoutFactory.createLineLayout(items, line as Line)];
    }

    if (breakIndex === 0) {
      return this.handleOversizedFirstItem(items, availableWidth, line);
    }

    let firstChunk = items.slice(0, breakIndex);
    let secondChunk = items.slice(breakIndex);

    ({ firstChunk, secondChunk } = this.avoidLeadingRhythmSymbol(firstChunk, secondChunk, availableWidth));

    this.removeTrailingComma(firstChunk);

    return [
      this.layoutFactory.createLineLayout(firstChunk, line as Line),
      ...this.breakContent(secondChunk, availableWidth, line),
    ];
  }

  /**
   * Consolidate consecutive soft line breaks into single breaks
   */
  private consolidateConsecutiveSoftBreaks(items: MeasuredItem[]): MeasuredItem[] {
    const consolidated: MeasuredItem[] = [];

    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      consolidated.push(item);

      if (item.item instanceof SoftLineBreak) {
        index = this.skipConsecutiveSoftBreaks(items, index);
      }
    }

    return consolidated;
  }

  private skipConsecutiveSoftBreaks(items: MeasuredItem[], startIndex: number): number {
    let index = startIndex;

    while (index + 1 < items.length && items[index + 1].item instanceof SoftLineBreak) {
      index += 1;
    }

    return index;
  }

  private findBreakIndex(items: MeasuredItem[], availableWidth: number): number {
    let currentWidth = 0;

    for (let i = 0; i < items.length; i += 1) {
      if (currentWidth + items[i].width > availableWidth) {
        return i;
      }
      currentWidth += items[i].width;
    }

    return -1;
  }

  private handleOversizedFirstItem(
    items: MeasuredItem[],
    availableWidth: number,
    line: Line | null,
  ): LineLayout[] {
    const [firstPart, secondPart] = this.itemProcessor.splitMeasuredItem(items[0], availableWidth);
    const remainingItems = secondPart ? [secondPart, ...items.slice(1)] : items.slice(1);

    return [
      this.layoutFactory.createLineLayout([firstPart], line as Line),
      ...this.breakContent(remainingItems, availableWidth, line),
    ];
  }

  private analyzeContent(items: MeasuredItem[]): {
    totalWidth: number;
    softBreakIndices: number[];
  } {
    const softBreakIndices: number[] = [];
    const totalWidth = items.reduce((sum, measuredItem, index) => {
      if (measuredItem.item instanceof SoftLineBreak) {
        softBreakIndices.push(index);
      }
      return sum + measuredItem.width;
    }, 0);

    return { totalWidth, softBreakIndices };
  }

  private shouldReturnSingleLayout(
    totalWidth: number,
    availableWidth: number,
  ): boolean {
    return totalWidth <= availableWidth;
  }

  private splitAtBestSoftBreak(
    items: MeasuredItem[],
    softBreakIndices: number[],
    totalWidth: number,
    availableWidth: number,
  ): { firstChunk: MeasuredItem[]; secondChunk: MeasuredItem[] } {
    const bestBreak = this.findBestSoftBreak(items, softBreakIndices, totalWidth);
    const softBreak = items[bestBreak.index];

    let firstChunk = items.slice(0, bestBreak.index);
    let secondChunk = items.slice(bestBreak.index + 1);

    ({ firstChunk, secondChunk } = this.avoidLeadingRhythmSymbol(
      firstChunk,
      secondChunk,
      availableWidth,
      softBreak,
    ));

    this.removeTrailingComma(firstChunk);
    this.capitalizeNextItem(secondChunk, secondChunk, 0);

    return { firstChunk, secondChunk };
  }

  private findBestSoftBreak(items: MeasuredItem[], softBreakIndices: number[], totalWidth: number) {
    const targetWidth = totalWidth / 2;
    const breakOptions = softBreakIndices.map((idx) => ({
      index: idx,
      widthUpToBreak: this.getWidthUpToIndex(items, idx),
    }));

    return breakOptions.reduce((best, current) => this.selectBetterSoftBreak(best, current, targetWidth));
  }

  private selectBetterSoftBreak<T extends { index: number; widthUpToBreak: number }>(
    best: T,
    current: T,
    targetWidth: number,
  ): T {
    const currentDistance = Math.abs(current.widthUpToBreak - targetWidth);
    const bestDistance = Math.abs(best.widthUpToBreak - targetWidth);

    if (currentDistance === bestDistance) {
      return current.index > best.index ? current : best;
    }

    return currentDistance < bestDistance ? current : best;
  }

  /**
   * Avoid wrapping a line so that the next visual line starts with a rhythm symbol.
   *
   * Prefer keeping the leading rhythm symbol(s) with the previous line, but only
   * when the previous line still fits. If they do not fit, break earlier by
   * moving the nearest preceding non-rhythm chord to the next line. Width checks
   * are recalculated in the final line context so trailing chord-spacing is not
   * counted for a line-ending rhythm symbol such as `|`.
   */
  private avoidLeadingRhythmSymbol(
    firstChunk: MeasuredItem[],
    secondChunk: MeasuredItem[],
    availableWidth: number,
    separator: MeasuredItem | null = null,
  ): { firstChunk: MeasuredItem[]; secondChunk: MeasuredItem[] } {
    if (!this.shouldAvoidLeadingRhythmSymbol(secondChunk)) {
      return { firstChunk, secondChunk };
    }

    return this.tryMoveLeadingRhythmSymbolsToFirstChunk(firstChunk, secondChunk, availableWidth, separator) ||
      this.movePrecedingChordToSecondChunk(firstChunk, secondChunk, separator);
  }

  private shouldAvoidLeadingRhythmSymbol(secondChunk: MeasuredItem[]): boolean {
    const leadingRhythmSymbolCount = this.countLeadingRhythmSymbols(secondChunk);
    return this.startsWithRhythmSymbol(secondChunk) &&
      this.hasChordAfterLeadingRhythmSymbols(secondChunk, leadingRhythmSymbolCount);
  }

  private tryMoveLeadingRhythmSymbolsToFirstChunk(
    firstChunk: MeasuredItem[],
    secondChunk: MeasuredItem[],
    availableWidth: number,
    separator: MeasuredItem | null,
  ): { firstChunk: MeasuredItem[]; secondChunk: MeasuredItem[] } | null {
    const leadingRhythmSymbolCount = this.countLeadingRhythmSymbols(secondChunk);
    const separatorItems = separator ? [separator] : [];
    const laterFirstChunk = [...firstChunk, ...separatorItems, ...secondChunk.slice(0, leadingRhythmSymbolCount)];
    const laterSecondChunk = secondChunk.slice(leadingRhythmSymbolCount);

    if (this.calculateLineContextWidth(laterFirstChunk) <= availableWidth) {
      return { firstChunk: laterFirstChunk, secondChunk: laterSecondChunk };
    }

    return null;
  }

  private movePrecedingChordToSecondChunk(
    firstChunk: MeasuredItem[],
    secondChunk: MeasuredItem[],
    separator: MeasuredItem | null,
  ): { firstChunk: MeasuredItem[]; secondChunk: MeasuredItem[] } {
    const precedingChordIndex = this.findLastNonRhythmChordIndex(firstChunk);

    if (precedingChordIndex <= 0) {
      return { firstChunk, secondChunk };
    }

    return {
      firstChunk: firstChunk.slice(0, precedingChordIndex),
      secondChunk: [...firstChunk.slice(precedingChordIndex), ...this.separatorItems(separator), ...secondChunk],
    };
  }

  private separatorItems(separator: MeasuredItem | null): MeasuredItem[] {
    return separator ? [separator] : [];
  }

  private startsWithRhythmSymbol(items: MeasuredItem[]): boolean {
    return this.isFlowSymbolItem(items[0]);
  }

  private countLeadingRhythmSymbols(items: MeasuredItem[]): number {
    let count = 0;

    while (count < items.length && this.isFlowSymbolItem(items[count])) {
      count += 1;
    }

    return count;
  }

  private hasChordAfterLeadingRhythmSymbols(items: MeasuredItem[], leadingRhythmSymbolCount: number): boolean {
    return this.isNonRhythmChordItem(items[leadingRhythmSymbolCount]);
  }

  private findLastNonRhythmChordIndex(items: MeasuredItem[]): number {
    for (let index = items.length - 1; index >= 0; index -= 1) {
      if (this.isNonRhythmChordItem(items[index])) {
        return index;
      }
    }

    return -1;
  }

  private isFlowSymbolItem(item: MeasuredItem | undefined): boolean {
    return item?.item instanceof ChordLyricsPair && isFlowSymbolKind(item.item.tokenKind);
  }

  private isNonRhythmChordItem(item: MeasuredItem | undefined): boolean {
    return item?.item instanceof ChordLyricsPair &&
      !isFlowSymbolKind(item.item.tokenKind) &&
      (item.item.chords || '').trim() !== '';
  }

  private calculateLineContextWidth(items: MeasuredItem[]): number {
    return items.reduce((width, item, index) => {
      const nextItem = items[index + 1] || null;
      return width + this.recalculateWidthForLineContext(item, nextItem);
    }, 0);
  }

  private recalculateWidthForLineContext(item: MeasuredItem, nextItem: MeasuredItem | null): number {
    if (item.item instanceof ChordLyricsPair) {
      return this.recalculateChordLyricWidth(item, nextItem);
    }

    if (!nextItem && item.item instanceof SoftLineBreak) {
      return 0;
    }

    return item.width;
  }

  private removeTrailingComma(items: MeasuredItem[]): void {
    const lastItem = items[items.length - 1];
    if (lastItem?.item instanceof ChordLyricsPair && lastItem.item.lyrics?.endsWith(',')) {
      lastItem.item.lyrics = lastItem.item.lyrics.slice(0, -1) || '';
      lastItem.width = this.remeasureLyrics(lastItem);
    }
  }

  /**
   * Calculate the total width of items up to (but not including) the given index
   */
  private getWidthUpToIndex(items: MeasuredItem[], index: number): number {
    let width = 0;
    for (let i = 0; i < index && i < items.length; i += 1) {
      width += items[i].width;
    }
    return width;
  }

  /**
   * Remeasure the width of lyrics after modification
   */
  private remeasureLyrics(item: MeasuredItem): number {
    if (item.item instanceof ChordLyricsPair) {
      return this.itemProcessor.measurer.measureTextWidth(
        item.item.lyrics || '',
        this.itemProcessor.config.fonts.lyrics,
      );
    }
    return item.width;
  }

  /**
   * Recalculate the full chord-lyric pair width (similar to ItemProcessor logic)
   */
  private recalculateChordLyricWidth(item: MeasuredItem, nextItem: MeasuredItem | null = null): number {
    if (!(item.item instanceof ChordLyricsPair)) {
      return item.width;
    }

    const pair = item.item;
    const widths = this.measureChordAndLyricWidths(pair);
    const adjustedChordWidth = this.adjustChordWidth(pair, widths, nextItem);

    return Math.max(adjustedChordWidth, widths.lyricsWidth);
  }

  private measureChordAndLyricWidths(pair: ChordLyricsPair): { chordWidth: number; lyricsWidth: number } {
    const chordFont = this.itemProcessor.config.fonts[pair.styleRole] || this.itemProcessor.config.fonts.chord;
    const lyricsFont = this.itemProcessor.config.fonts.lyrics;
    const chordWidth = pair.chords ? this.itemProcessor.measurer.measureTextWidth(pair.chords, chordFont) : 0;
    const lyricsWidth = pair.lyrics ? this.itemProcessor.measurer.measureTextWidth(pair.lyrics, lyricsFont) : 0;

    return { chordWidth, lyricsWidth };
  }

  private adjustChordWidth(
    pair: ChordLyricsPair,
    widths: { chordWidth: number; lyricsWidth: number },
    nextItem: MeasuredItem | null,
  ): number {
    if (this.shouldSkipChordSpacing(widths.chordWidth, nextItem)) {
      return widths.chordWidth;
    }

    const lyricsFont = this.itemProcessor.config.fonts.lyrics;
    const spaceWidth = this.itemProcessor.measurer.measureTextWidth(' ', lyricsFont);

    if (widths.chordWidth < (widths.lyricsWidth - spaceWidth)) {
      return widths.chordWidth;
    }

    const chordFont = this.itemProcessor.config.fonts[pair.styleRole] || this.itemProcessor.config.fonts.chord;
    const spacing = ' '.repeat(this.itemProcessor.config.chordSpacing);
    const chordsWithSpacing = `${pair.chords || ''}${spacing}`;

    return this.itemProcessor.measurer.measureTextWidth(chordsWithSpacing, chordFont);
  }

  private shouldSkipChordSpacing(chordWidth: number, nextItem: MeasuredItem | null): boolean {
    if (this.itemProcessor.config.displayLyricsOnly || chordWidth === 0) {
      return true;
    }

    if (!nextItem || !(nextItem.item instanceof ChordLyricsPair)) {
      return true;
    }

    return (nextItem.item.chords || '').trim() === '';
  }

  /**
   * Capitalize the first letter of the next item with lyrics
   */
  private capitalizeNextItem(currentLine: MeasuredItem[], measuredItems: MeasuredItem[], index: number): void {
    const nextItemWithLyrics = this.itemProcessor.findNextItemWithLyrics(currentLine, measuredItems, index);
    if (nextItemWithLyrics && nextItemWithLyrics.item instanceof ChordLyricsPair) {
      const currentLyrics = nextItemWithLyrics.item.lyrics ?? '';
      nextItemWithLyrics.item.lyrics = this.itemProcessor.capitalizeFirstWord(currentLyrics);

      // Find the next item after this one to determine if it has chords (for spacing logic)
      const nextItemIndex = measuredItems.indexOf(nextItemWithLyrics);
      const itemAfterNext = nextItemIndex >= 0 && nextItemIndex < measuredItems.length - 1 ?
        measuredItems[nextItemIndex + 1] :
        null;

      // Recalculate the full chord-lyric pair width, considering spacing
      nextItemWithLyrics.width = this.recalculateChordLyricWidth(nextItemWithLyrics, itemAfterNext);
    }
  }
}
