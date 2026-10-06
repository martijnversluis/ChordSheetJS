import ChordLyricsPair from '../../chord_sheet/chord_lyrics_pair';
import SoftLineBreak from '../../chord_sheet/soft_line_break';
import Tag from '../../chord_sheet/tag';

import { LineLayout, MeasuredItem } from '../../layout/engine/types';
import { TerminalRow, TerminalSpan } from './types';

import { TerminalMeasurer } from '../../layout/measurement/terminal_measurer';
import { isComment } from '../../template_helpers';

export class TerminalRows {
  readonly rows: TerminalRow[] = [];

  constructor(private readonly measurer: TerminalMeasurer, private readonly linePadding = 0) {}

  blank(): void {
    this.rows.push({ y: this.rows.length, spans: [] });
  }

  append(line: LineLayout): void {
    const start = this.rows.length;
    for (let i = 0; i < line.lineHeight; i += 1) this.blank();
    let x = 0;
    line.items.forEach((measured) => {
      this.paint(measured, x, start, line.lineHeight - this.linePadding);
      x += measured.width;
    });
  }

  private add(y: number, x: number, text: string, semantic: Omit<TerminalSpan, 'x' | 'width' | 'text'>): void {
    const { width } = this.measurer.measureText(text);
    if (!text.trim() || !this.rows[y]) return;
    this.rows[y].spans.push({
      x, width, text, ...semantic,
    });
  }

  private paint(measured: MeasuredItem, x: number, y: number, height: number): void {
    const { item } = measured;
    if (item instanceof ChordLyricsPair) {
      this.add(y, x, measured.adjustedChord ?? item.chords, {
        kind: item.tokenKind, styleRole: item.styleRole, tokenVariant: item.tokenVariant,
      });
      this.add(y + Math.max(0, height - 1), x, item.lyrics || '', { kind: 'lyrics' });
    } else if (item instanceof SoftLineBreak) {
      this.add(y + Math.max(0, height - 1), x, item.content, { kind: 'lyrics' });
    } else if (item instanceof Tag) this.paintTag(item, x, y);
  }

  private paintTag(tag: Tag, x: number, y: number): void {
    if (isComment(tag)) this.add(y, x, tag.value, { kind: 'comment' });
    else if (tag.isSectionDelimiter()) this.add(y, x, tag.label || '', { kind: 'section-label' });
  }
}
