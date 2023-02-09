import { LineType } from '../src/chord_sheet/line';
import Metadata from '../src/chord_sheet/metadata';
import { TernaryProperties } from '../src/chord_sheet/chord_pro/ternary';
import Item from '../src/chord_sheet/item';
import ChordSheetSerializer, {
  SerializedChordLyricsPair, SerializedComposite,
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

type TestCaseProps = {
  [key: string]: any;
  outcome: any;
  index: number;
}

export function eachTestCase(table: string, callback: (_testCase: TestCaseProps) => void) {
  const lines = table.trim().split('\n');
  const names = lines[0].split('|').map((s) => s.trim()).slice(1, -1);
  const caseLines = lines.slice(2);

  const testCases = caseLines.map((line) => {
    const columns = line.split('|').map((s) => s.trim());
    const values = columns.slice(1, -1);
    const testCase = { index: parseInt(columns[0], 10) };

    return names.reduce((acc, name, index) => ({
      ...acc,
      [name]: JSON.parse(values[index] || 'null'),
    }), testCase);
  });

  testCases.forEach((testCaseProps) => {
    const testCase = testCaseProps as TestCaseProps;
    const description = names.filter((n) => n !== 'outcome').map((name) => `${name}=${testCase[name]}`).join(', ');

    it(`returns ${testCase.outcome} for ${description} (${testCaseProps.index})`, () => {
      callback(testCase);
    });
  });
}
