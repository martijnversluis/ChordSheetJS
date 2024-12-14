import {
  SerializedChordLyricsPair,
  SerializedItem,
  SerializedLine,
  SerializedSoftLineBreak,
  SerializedTag,
} from '../../serialized_types';

import { FileRange } from './peg_parser';

function splitSectionContent(content: string): string[] {
  return content
    .replace(/\n$/, '')
    .split('\n');
}

export function buildLine(items: SerializedItem[]): SerializedLine {
  return {
    type: 'line',
    items,
  };
}

export function buildSection(startTag: SerializedTag, endTag: SerializedTag, content: string): SerializedLine[] {
  return [
    buildLine([startTag]),
    ...splitSectionContent(content).map((line: string) => buildLine([line])),
    buildLine([endTag]),
  ];
}

export function buildTag(
  name: string,
  value: Partial<{ value: string | null, attributes: Record<string, string>}> | null,
  selector: { value: string | null, isNegated: boolean } | null,
  location: FileRange,
): SerializedTag {
  return {
    type: 'tag',
    name,
    location: location.start,
    value: value?.value || '',
    attributes: value?.attributes || {},
    selector: selector?.value,
    isNegated: selector?.isNegated,
  };
}

export function stringSplitReplace(
  string: string,
  search: string,
  replaceMatch: (subString: string) => any,
  replaceRest: (subString: string) => any = (subString) => subString,
): any[] {
  const regExp = new RegExp(search, 'g');
  const occurrences = Array.from(string.matchAll(regExp));
  const result: string[] = [];
  let index = 0;

  occurrences.forEach((match) => {
    const before = string.slice(index, match.index);
    if (before !== '') result.push(replaceRest(before));
    result.push(replaceMatch(match[0]));
    index = match.index + match[0].length;
  });

  const rest = string.slice(index);
  if (rest !== '') result.push(replaceRest(rest));

  return result;
}

export function applySoftLineBreaks(lyrics: string): SerializedChordLyricsPair[] {
  return stringSplitReplace(
    lyrics,
    '\xa0',
    () => ({ type: 'softLineBreak' }),
    (lyric) => ({ type: 'chordLyricsPair', chords: '', lyrics: lyric }),
  ) as SerializedChordLyricsPair[];
}

export function breakChordLyricsPairOnSoftLineBreak(
  chords: string,
  lyrics: string,
): (SerializedChordLyricsPair | SerializedSoftLineBreak)[] {
  const pairs =
    applySoftLineBreaks(lyrics || '') as (SerializedChordLyricsPair | SerializedSoftLineBreak)[];
  const [_first, ...rest] = pairs;
  let first = pairs[0];
  let addedLeadingChord: SerializedChordLyricsPair | null = null;

  if (chords !== '') {
    if (!first || first.type === 'softLineBreak') {
      addedLeadingChord = { type: 'chordLyricsPair', chords, lyrics: '' };
    } else {
      first = { ...first, chords };
    }
  }

  return [addedLeadingChord, first || null, ...rest].filter((item) => item !== null);
}
