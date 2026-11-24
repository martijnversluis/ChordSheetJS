import ChordSheetSerializer from '../chord_sheet_serializer';
import Line from '../chord_sheet/line';
import Tag from '../chord_sheet/tag';

const EMPTY_LINE = '[]';

/** The serialized items of one line, without the section delimiters that wrap the block */
function fingerprintLine(line: Line, serializer: ChordSheetSerializer): string {
  return JSON.stringify(
    line.items
      .filter((item) => !(item instanceof Tag && item.isSectionDelimiter()))
      .map((item) => serializer.serializeItem(item)),
  );
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
