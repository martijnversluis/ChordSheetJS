import Line from '../../chord_sheet/line';
import LineExpander from '../../chord_sheet/line_expander';
import Paragraph from '../../chord_sheet/paragraph';
import SoftLineBreak from '../../chord_sheet/soft_line_break';
import Song from '../../chord_sheet/song';
import Tag from '../../chord_sheet/tag';

/** Line.clone omits musical context; positioned preprocessing must retain it. */
export function clonePositionedLine(line: Line): Line {
  const clone = line.clone();
  clone.key = line.key;
  clone.transposeKey = line.transposeKey;
  clone.lineNumber = line.lineNumber;
  clone.items = line.items.map((item) => {
    const copy = item.clone();
    if (item instanceof SoftLineBreak && copy instanceof SoftLineBreak) copy.content = item.content;
    return copy;
  });
  return clone;
}

export function clonePositionedSong(song: Song): Song {
  const clone = new Song(song.metadata);
  clone.lines = song.lines.map(clonePositionedLine);
  clone.warnings = [...song.warnings];
  return clone;
}

export function isColumnBreakItem(item: unknown): boolean {
  return item instanceof Tag && item.name === 'column_break';
}

/** Song.bodyParagraphs intentionally discards non-renderable controls; this opt-in path retains them. */
export function positionedParagraphs(song: Song, expandChorus = false): Paragraph[] {
  const lines = expandChorus ? song.lines.flatMap((line) => LineExpander.expand(line, song)) : song.lines;
  const paragraphs: Paragraph[] = [];
  let paragraph = new Paragraph();
  lines.forEach((line, index) => {
    if (line.isEmpty() || (line.isSectionEnd() && lines[index + 1] && !lines[index + 1].isEmpty())) {
      if (paragraph.lines.length) paragraphs.push(paragraph);
      paragraph = new Paragraph();
    } else if (line.hasRenderableItems() || line.items.some(isColumnBreakItem)) paragraph.addLine(line);
  });
  if (paragraph.lines.length) paragraphs.push(paragraph);
  return paragraphs;
}

/** Split controls out even when a caller constructs a mixed-content Line programmatically. */
export function splitPositionedLine(line: Line): Line[] {
  const segments: Line[] = [];
  let current = clonePositionedLine(line);
  current.items = [];
  line.items.forEach((item) => {
    if (isColumnBreakItem(item)) {
      if (current.items.length) segments.push(current);
      const control = clonePositionedLine(line);
      control.items = [item];
      segments.push(control);
      current = clonePositionedLine(line);
      current.items = [];
    } else current.items.push(item);
  });
  if (current.items.length) segments.push(current);
  return segments;
}
