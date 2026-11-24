import ChordSheetSerializer from '../chord_sheet_serializer';
import Line from '../chord_sheet/line';
import Tag from '../chord_sheet/tag';

import { SerializedComponent } from '../serialized_types';

const EMPTY_LINE = '[]';

/** The text of a serialized item, or `null` for an item that holds no text */
function textOf(item: SerializedComponent): string | null {
  if (typeof item === 'string') return item;

  const { lyrics } = item as { lyrics?: string | null };

  return typeof lyrics === 'string' ? lyrics : null;
}

/** The serialized item with its text replaced */
function withText(item: SerializedComponent, text: string): SerializedComponent {
  return typeof item === 'string' ? text : { ...item, lyrics: text } as SerializedComponent;
}

/** Drops the whitespace at the start and the end of a line, which does not make a section a different one */
function trimEdges(items: SerializedComponent[]): SerializedComponent[] {
  return items.map((item, index) => {
    const text = textOf(item);

    if (text === null) return item;

    let trimmed = index === 0 ? text.trimStart() : text;
    if (index === items.length - 1) trimmed = trimmed.trimEnd();

    return trimmed === text ? item : withText(item, trimmed);
  });
}

/** An item that holds nothing: rendering the line would not show it either */
function isBlank(item: SerializedComponent): boolean {
  if (typeof item === 'string') return item.length === 0;

  const { chords, annotation } = item as { chords?: string | null, annotation?: string | null };

  return textOf(item) === '' && !chords && !annotation;
}

/** The serialized items of one line, without the section delimiters that wrap the block */
function fingerprintLine(line: Line, serializer: ChordSheetSerializer): string {
  const items = line.items
    .filter((item) => !(item instanceof Tag && item.isSectionDelimiter()))
    .map((item) => serializer.serializeItem(item));

  return JSON.stringify(trimEdges(items).filter((item) => !isBlank(item)));
}

/**
 * The content fingerprint of a block of lines: two blocks share a fingerprint when they hold the same
 * content, apart from the section delimiters that wrap them and the blank lines between them. The
 * fingerprint is taken from the parsed song, so it does not depend on how a formatter would render it.
 * Returns `null` for a block that holds an item that cannot be serialized, so that block identifies as a
 * section of its own instead of merging with another one by accident.
 */
function sectionFingerprint(lines: Line[]): string | null {
  const serializer = new ChordSheetSerializer();

  try {
    return lines
      .map((line) => fingerprintLine(line, serializer))
      .filter((contents) => contents !== EMPTY_LINE)
      .join('\n');
  } catch {
    return null;
  }
}

export default sectionFingerprint;
