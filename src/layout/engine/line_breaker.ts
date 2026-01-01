import ChordLyricsPair from '../../chord_sheet/chord_lyrics_pair';
import { ItemProcessor } from './item_processor';
import { LayoutFactory } from './layout_factory';
import Line from '../../chord_sheet/line';
import SoftLineBreak from '../../chord_sheet/soft_line_break';
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

    const { firstChunk, secondChunk } = this.splitAtBestSoftBreak(items, softBreakIndices, totalWidth);

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

    const firstChunk = items.slice(0, breakIndex);
    const secondChunk = items.slice(breakIndex);

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
  ): { firstChunk: MeasuredItem[]; secondChunk: MeasuredItem[] } {
    const targetWidth = totalWidth / 2;
    const breakOptions = softBreakIndices.map((idx) => ({
      index: idx,
      widthUpToBreak: this.getWidthUpToIndex(items, idx),
    }));
    const bestBreak = breakOptions.reduce((best, current) => {
      const currentDistance = Math.abs(current.widthUpToBreak - targetWidth);
      const bestDistance = Math.abs(best.widthUpToBreak - targetWidth);

      if (currentDistance === bestDistance) {
        return current.index > best.index ? current : best;
      }

      return currentDistance < bestDistance ? current : best;
    });

    const firstChunk = items.slice(0, bestBreak.index);
    const secondChunk = items.slice(bestBreak.index + 1);

    this.removeTrailingComma(firstChunk);
    this.capitalizeNextItem(secondChunk, secondChunk, 0);

    return { firstChunk, secondChunk };
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
    const chordFont = this.itemProcessor.config.fonts.chord;
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

    const chordFont = this.itemProcessor.config.fonts.chord;
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
