import { LineType } from '../src/chord_sheet/line';
import Metadata from '../src/chord_sheet/metadata';
import { TernaryProperties } from '../src/chord_sheet/chord_pro/ternary';
import Item from '../src/chord_sheet/item';
import ChordSheetSerializer, {
  SerializedChordLyricsPair, SerializedComment, SerializedComposite,
  SerializedItem,
  SerializedSong,
  SerializedTag, SerializedTernary,
} from '../src/chord_sheet_serializer';

import {
  ChordLyricsPair,
  Line,
  Tag,
  NONE,
  Paragraph,
  Literal,
  Composite,
  Ternary,
  Song,
} from '../src';
import { ChordType, Modifier } from '../src/constants';
import Key from '../src/key';

export function createSong(lines, metadata: Record<string, string> = {}) {
  const song = new Song(metadata || new Metadata());

  lines.forEach((line) => {
    if (Array.isArray(line)) {
      song.addLine();
      line.forEach((item) => song.addItem(item));
    } else {
      song.lines.push(line);
    }
  });

  return song;
}

export function createLine(items: Item[] = [], type: LineType = NONE) {
  const line = new Line();
  items.forEach((item) => line.addItem(item));
  line.type = type;
  return line;
}

export function createParagraph(lines) {
  const paragraph = new Paragraph();
  lines.forEach((line) => paragraph.addLine(line));
  return paragraph;
}

export function createChordLyricsPair(chords, lyrics) {
  return new ChordLyricsPair(chords, lyrics);
}

export function createTag(name: string, value: string = '') {
  return new Tag(name, value);
}

export function createComposite(expressions) {
  return new Composite(expressions);
}

export function createLiteral(expression) {
  return new Literal(expression);
}

export function createTernary(properties: TernaryProperties) {
  return new Ternary(properties);
}

export function createSongFromAst(lines: SerializedItem[][]): Song {
  const serializedSong: SerializedSong = {
    type: 'chordSheet',
    lines: lines.map((items: SerializedItem[]) => ({
      type: 'line',
      items,
    })),
  };

  return new ChordSheetSerializer().deserialize(serializedSong);
}

export function tag(name: string, value: string = ''): SerializedTag {
  return { type: 'tag', name, value };
}

export function chordLyricsPair(chords: string, lyrics: string): SerializedChordLyricsPair {
  return { type: 'chordLyricsPair', chords, lyrics };
}

export function comment(commentStr: string): SerializedComment {
  return { type: 'comment', comment: commentStr };
}

export function ternary(
  {
    variable,
    valueTest,
    trueExpression,
    falseExpression,
  }: {
    variable?: string | null,
    valueTest?: string | null,
    trueExpression?: SerializedComposite,
    falseExpression?: SerializedComposite,
  },
): SerializedTernary {
  return {
    type: 'ternary',
    variable: variable || null,
    valueTest: valueTest || null,
    trueExpression: trueExpression || [],
    falseExpression: falseExpression || [],
  };
}

export function buildKey(
  keyString: string | number,
  keyType: ChordType,
  modifier?: Modifier | null,
  minor: boolean = false,
) {
  const resolvedKey = Key.resolve({
    key: keyString,
    keyType,
    modifier: modifier || null,
    minor: minor || false,
  });

  if (resolvedKey === null) {
    throw Error(`Could not resolve ${keyType} key ${keyString}`);
  }

  return resolvedKey;
}
