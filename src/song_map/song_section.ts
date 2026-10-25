import Line from '../chord_sheet/line';

import { NONE } from '../constants';

export interface SongSectionProperties {
  type: string;
  label: string | null;
  ordinal: number;
  token: string;
  lines: Line[];
}

function titleize(type: string): string {
  return type.replace(/(^|[\s-])(\p{L})/gu, (_match, separator, character) => separator + character.toUpperCase());
}

/**
 * A reusable unit of chart content that occurrences in a {@link SongMap} refer to
 */
class SongSection {
  /** The section type, for example `verse` or `chorus`. See {@link Line.type} */
  type: string;

  /** The label as written in the source chart, or `null` when the section has no label */
  label: string | null;

  /** The 1-based position of this section among the sections with the same {@link type} */
  ordinal: number;

  /** The compact section identifier, for example `V1` or `C1` */
  token: string;

  /** The source lines that make up the section, including its section delimiters */
  lines: Line[];

  constructor({
    type, label, ordinal, token, lines,
  }: SongSectionProperties) {
    this.type = type;
    this.label = label;
    this.ordinal = ordinal;
    this.token = token;
    this.lines = lines;
  }

  /** Whether the section is delimited by section directives, which can carry a repeat label */
  get hasDelimiter(): boolean {
    return this.lines.some((line) => line.isSectionStart());
  }

  /** The label to display, falling back to the section type and ordinal */
  get displayLabel(): string {
    if (this.label) return this.label;

    const name = this.type === NONE ? 'Section' : titleize(this.type);
    return `${name} ${this.ordinal}`;
  }
}

export default SongSection;
