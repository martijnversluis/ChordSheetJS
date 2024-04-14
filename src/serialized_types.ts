import { ChordType, Modifier } from './constants';

export type SerializedTraceInfo = {
  location?: {
    offset: number | null,
    line: number | null,
    column: number | null,
  },
};

export type SerializedChord = {
  type: 'chord',
  base: string,
  modifier: Modifier | null,
  suffix: string | null,
  bassBase: string | null,
  bassModifier: Modifier | null,
  chordType: ChordType,
};

export type SerializedChordLyricsPair = {
  type: 'chordLyricsPair',
  chord?: SerializedChord | null,
  chords: string,
  lyrics: string | null,
  annotation?: string | null,
};

export type SerializedTag = SerializedTraceInfo & {
  type: 'tag',
  name: string,
  value: string,
};

export type SerializedComment = {
  type: 'comment',
  comment: string,
};

export type ContentType = 'tab' | 'abc' | 'ly' | 'grid';

export type SerializedSection = {
  type: 'section',
  sectionType: ContentType,
  content: string[],
  startTag: SerializedTag,
  endTag: SerializedTag,
};

export type SerializedLiteral = string;

export interface SerializedTernary extends SerializedTraceInfo {
  type: 'ternary',
  variable: string | null,
  valueTest: string | null,
  trueExpression: Array<SerializedLiteral | SerializedTernary>,
  falseExpression: Array<SerializedLiteral | SerializedTernary>,
}

export type SerializedComposite = Array<SerializedLiteral | SerializedTernary>;

export type SerializedItem =
  SerializedChordLyricsPair |
  SerializedTag |
  SerializedComment |
  SerializedTernary |
  SerializedLiteral;

export type SerializedLine = {
  type: 'line',
  items: SerializedItem[],
};

export type SerializedSong = {
  type: 'chordSheet',
  lines: SerializedLine[],
};

export type SerializedComponent =
  SerializedLine |
  SerializedSong |
  SerializedChordLyricsPair |
  SerializedTag |
  SerializedComment |
  SerializedTernary |
  SerializedLiteral |
  SerializedSection;
