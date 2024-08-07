import {
  SerializedItem,
  SerializedLine,
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

export function buildTag(name: string, value: string | null, location: FileRange): SerializedTag {
  return {
    type: 'tag',
    name,
    value: value || '',
    location: location.start,
  };
}
