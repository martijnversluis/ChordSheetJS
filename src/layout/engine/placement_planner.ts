import ChordLyricsPair from '../../chord_sheet/chord_lyrics_pair';
import SoftLineBreak from '../../chord_sheet/soft_line_break';
import Tag from '../../chord_sheet/tag';

import type { LineLayout, MeasuredItem } from './types';

export interface LayoutSource {
  /** Paragraph occurrence and line within that occurrence, not a grapheme anchor. */
  paragraph: number;
  line: number;
}

export interface PositionedLine {
  layout: LineLayout;
  page: number;
  column: number;
  x: number;
  y: number;
  source: LayoutSource;
}

export interface PlacementGeometry {
  columnCount: number;
  columnWidth: number;
  columnSpacing: number;
  left: number;
  top: number;
  bodyHeight?: number;
  paragraphSpacing: number;
}

export interface PositionedLayout {
  placements: PositionedLine[];
  pageCount: number;
}

export interface SourceLineLayout {
  layout: LineLayout;
  source: LayoutSource;
}

export function isLayoutColumnBreak(line: LineLayout): boolean {
  return line.items.some(({ item }) => item instanceof Tag && item.name === 'column_break');
}

/** Padding is an advance after visible ink, not content left behind by visibility filtering. */
function hasVisualItem({ item, adjustedChord }: MeasuredItem): boolean {
  if (item instanceof ChordLyricsPair) return !!((adjustedChord ?? item.chords).trim() || item.lyrics?.trim());
  if (item instanceof SoftLineBreak) return !!item.content.trim();
  if (item instanceof Tag && item.isComment()) return !!item.value.trim();
  if (item instanceof Tag && item.isSectionDelimiter()) return !!item.label.trim();
  return false;
}

/** Opt-in cell placement. Legacy renderer pagination deliberately does not use this policy. */
export class PlacementPlanner {
  readonly result: PositionedLayout = { placements: [], pageCount: 1 };

  private column = 1;

  private y = 0;

  private pendingSpacing = 0;

  constructor(private readonly geometry: PlacementGeometry) {}

  appendParagraph(lines: SourceLineLayout[]): void {
    let segment: SourceLineLayout[] = [];
    lines.forEach((line) => {
      if (isLayoutColumnBreak(line.layout) && this.geometry.bodyHeight !== undefined) {
        this.appendSegment(segment);
        segment = [];
        this.advance();
      } else if (!isLayoutColumnBreak(line.layout)) segment.push(line);
    });
    this.appendSegment(segment);
    if (this.y) this.pendingSpacing = this.geometry.paragraphSpacing;
  }

  private appendSegment(lines: SourceLineLayout[]): void {
    const visible = lines.filter(({ layout }) => layout.lineHeight > 0 && layout.items.some(hasVisualItem));
    const height = visible.reduce((sum, { layout }) => sum + layout.lineHeight, 0);
    if (!height) return;
    const limit = this.geometry.bodyHeight ?? Infinity;
    if (visible.some(({ layout }) => layout.lineHeight > limit)) {
      throw new Error('Terminal content height is shorter than an atomic visual line');
    }
    if (this.y && height <= limit && this.y + this.pendingSpacing + height > limit) this.advance();
    visible.forEach((line) => this.place(line));
  }

  private place(line: SourceLineLayout): void {
    const { geometry } = this;
    const spacing = this.y ? this.pendingSpacing : 0;
    if (this.y && this.y + spacing + line.layout.lineHeight > (geometry.bodyHeight ?? Infinity)) this.advance();
    else this.y += spacing;
    this.pendingSpacing = 0;
    this.result.placements.push({
      ...line,
      page: this.result.pageCount,
      column: this.column,
      x: geometry.left + (this.column - 1) * (geometry.columnWidth + geometry.columnSpacing),
      y: geometry.top + this.y,
    });
    this.y += line.layout.lineHeight;
  }

  private advance(): void {
    this.column += 1;
    if (this.column > this.geometry.columnCount) {
      this.column = 1;
      this.result.pageCount += 1;
    }
    this.y = 0;
    this.pendingSpacing = 0;
  }
}
