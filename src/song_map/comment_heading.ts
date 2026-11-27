import Line from '../chord_sheet/line';
import RepeatInstruction from './repeat_instruction';
import Tag from '../chord_sheet/tag';

import { NONE } from '../constants';

/** Section names a comment heading can use, mapped to the section type they denote */
const SECTION_TYPES: Record<string, string> = {
  'intro': 'intro',
  'verse': 'verse',
  'chorus': 'chorus',
  'pre-chorus': 'pre-chorus',
  'prechorus': 'pre-chorus',
  'bridge': 'bridge',
  'instrumental': 'instrumental',
  'interlude': 'instrumental',
  'tag': 'tag',
  'turn': 'turn',
  'turnaround': 'turn',
  'outro': 'end',
  'ending': 'end',
  'end': 'end',
};

/** A section name, optionally numbered, for example `Verse 2` or `Pre-Chorus` */
const HEADING_PATTERN = /^([a-z]+(?:[- ][a-z]+)?)(?:\s+[1-9]\d*)?$/i;

export interface CommentHeading {
  /** The section type the heading denotes, for example `chorus` */
  type: string;

  /** The heading as written, including a repeat instruction such as `2x` */
  label: string;

  /** The section name without repeat instruction, for example `Verse 1` */
  name: string;
}

function headingTag(line: Line): Tag | null {
  if (line.type !== NONE || line.selector || line.items.length !== 1) return null;

  const [item] = line.items;
  if (!(item instanceof Tag) || !item.isComment() || item.selector) return null;

  return item;
}

/** The section name of a heading, without a trailing repeat instruction such as `2x` or `(2x)` */
function sectionName(label: string): string | null {
  const instruction = RepeatInstruction.parse(label);

  if (!instruction) return label;
  if (!label.endsWith(instruction.text)) return null;

  return label.slice(0, -instruction.text.length).replace(/\($/, '').trim();
}

/**
 * Reads a line that consists of a single comment naming a section, such as `{comment: Chorus}` or
 * `{c: Verse 2}`, as the heading of the paragraph it starts. Charts commonly head their sections this way
 * instead of using section directives. Returns `null` for any other line, including a comment inside a
 * section, a comment with a selector, and a comment that says more than a section name and a repeat instruction,
 * such as `Chorus softly`.
 */
function commentHeading(line: Line): CommentHeading | null {
  const tag = headingTag(line);
  const label = tag?.value?.trim();
  if (!label) return null;

  const match = HEADING_PATTERN.exec(sectionName(label) ?? '');
  const type = match && SECTION_TYPES[match[1].toLowerCase().replace(' ', '-')];

  return type ? { type, label, name: match[0] } : null;
}

export default commentHeading;
