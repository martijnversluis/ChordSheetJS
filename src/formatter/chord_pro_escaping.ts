const LYRICS_SPECIAL_CHARS = /[\\[\]{}#]/g;
const TAG_VALUE_SPECIAL_CHARS = /[\\{}]/g;
const ATTRIBUTE_VALUE_SPECIAL_CHARS = /[\\}"]/g;
const META_EXPRESSION_START = '%{';

function escape(string: string, specialChars: RegExp): string {
  return string.replace(specialChars, (char) => `\\${char}`);
}

function metaExpressionEnd(value: string, start: number): number {
  let depth = 0;

  for (let index = start + 1; index < value.length; index += 1) {
    if (value[index] === '{') depth += 1;
    if (value[index] === '}') depth -= 1;
    if (depth === 0) return index + 1;
  }

  return value.length;
}

export function escapeLyrics(lyrics: string): string {
  return escape(lyrics, LYRICS_SPECIAL_CHARS);
}

export function escapeAttributeValue(value: string): string {
  return escape(value, ATTRIBUTE_VALUE_SPECIAL_CHARS);
}

export function escapeTagValue(value: string): string {
  return escape(value, TAG_VALUE_SPECIAL_CHARS);
}

export function escapeTagValuePreservingMetaExpressions(value: string): string {
  let escaped = '';
  let index = 0;

  while (index < value.length) {
    const start = value.indexOf(META_EXPRESSION_START, index);
    if (start === -1) return escaped + escapeTagValue(value.slice(index));

    const end = metaExpressionEnd(value, start);
    escaped += escapeTagValue(value.slice(index, start)) + value.slice(start, end);
    index = end;
  }

  return escaped;
}
