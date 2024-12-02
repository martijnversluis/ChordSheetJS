// eslint no-console: "off"

import Tracer from 'pegjs-backtrace';
import theredoc from 'theredoc';
import { stripHTML } from '../src/template_helpers';

import { LineType } from '../src/chord_sheet/line';
import Metadata from '../src/chord_sheet/metadata';
import { TernaryProperties } from '../src/chord_sheet/chord_pro/ternary';
import Item from '../src/chord_sheet/item';
import { ChordType, Fret, Modifier } from '../src/constants';
import Key from '../src/key';
import ChordSheetSerializer from '../src/chord_sheet_serializer';
import ChordDefinition from '../src/chord_sheet/chord_pro/chord_definition';

import {
  ContentType,
  SerializedChordLyricsPair,
  SerializedComment,
  SerializedComposite,
  SerializedItem, SerializedSoftLineBreak,
  SerializedSong,
  SerializedTag,
  SerializedTernary,
} from '../src/serialized_types';

import {
  ChordLyricsPair, Composite, Line, Literal, NONE, Paragraph, Song, Tag, Ternary,
} from '../src';

export function heredoc(strings: TemplateStringsArray, ...values: any[]): string {
  return theredoc(strings, ...values);
}

export function html(strings: TemplateStringsArray, ...values: any[]): string {
  return stripHTML(theredoc(strings, ...values));
}

export function createSong(rows, metadata: Record<string, string> = {}) {
  const song = new Song(metadata || new Metadata());

  rows.forEach((row) => {
    if (Array.isArray(row)) {
      const line = new Line();
      song.addLine(line);
      row.forEach((item) => line.addItem(item));
    } else {
      song.lines.push(row);
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

export function createTag(name: string, value = '', chordDefinition: ChordDefinition | null = null): Tag {
  const newTag = new Tag(name, value);
  if (chordDefinition) newTag.chordDefinition = chordDefinition;
  return newTag;
}

export function createChordDefinition(name: string, baseFret: number, frets: Fret[], fingers: number[] = []) {
  return new ChordDefinition(name, baseFret, frets, fingers);
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

export function tag(name: string, value = '', attributes: Record<string, string> = {}): SerializedTag {
  return {
    type: 'tag',
    name,
    value,
    attributes,
  };
}

function splitContent(content: string | string[]): string[] {
  return Array.isArray(content) ? content : content.split('\n');
}

export function section(
  sectionType: ContentType,
  tagValue: string,
  attributes: Record<string, string>,
  content: string[] | string,
  startTag: SerializedTag | null = null,
  endTag: SerializedTag | null = null,
): SerializedItem[][] {
  return [
    [startTag || tag(`start_of_${sectionType}`, tagValue, attributes)],
    ...splitContent(content).map((line) => [line]),
    [endTag || tag(`end_of_${sectionType}`)],
  ];
}

export function chordLyricsPair(chords: string, lyrics: string, annotation = ''): SerializedChordLyricsPair {
  return {
    type: 'chordLyricsPair', chords, lyrics, annotation,
  };
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

export function softLineBreak(): SerializedSoftLineBreak {
  return { type: 'softLineBreak' };
}

interface TestCaseProps {
  [key: string]: any;
  outcome: any;
  index: string;
}

export function eachTestCase(table: string, callback: (_testCase: TestCaseProps) => void): void {
  const lines = table.trim().split('\n');
  const names = lines[0].split('|').map((s) => s.trim()).slice(1, -1);
  const caseLines = lines.slice(2);

  const testCases = caseLines.map((line) => {
    const columns = line.split('|').map((s) => s.trim());
    const values = columns.slice(1, -1);
    const testCase = { index: columns[0] };

    return names.reduce((acc, name, index) => ({
      ...acc,
      [name]: JSON.parse(values[index] || 'null'),
    }), testCase);
  });

  const focusTests = testCases.some((testCase) => testCase.index === 'f');
  const skipTests = testCases.some((testCase) => testCase.index === 's');

  testCases
    .filter(({ index }) => {
      if (focusTests) {
        return index === 'f';
      }

      if (skipTests) {
        return index !== 's';
      }

      return true;
    })
    .forEach((testCaseProps) => {
      const testCase = testCaseProps as TestCaseProps;

      const description = names
        .filter((n) => n !== 'outcome')
        .map((name) => `${name}=${JSON.stringify(testCase[name])}`).join(', ');

      // eslint-disable-next-line no-undef
      it(`returns ${JSON.stringify(testCase.outcome)} for ${description} (${testCaseProps.index})`, () => {
        callback(testCase);
      });
    });
}

export function buildKey(
  keyString: string | number,
  keyType: ChordType,
  modifier?: Modifier | null,
  minor = false,
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

export function trace(input: string, callback: (tracer: Tracer) => any): any {
  const tracer = new Tracer(input);

  try {
    return callback(tracer);
  } finally {
    // eslint-disable-next-line no-console
    console.log(tracer.getParseTreeString());
  }
}

export * as Tracer from 'pegjs-backtrace';
