import { ChordType, Fret, Modifier } from './constants';

export interface SerializedTraceInfo {
  location?: {
    offset: number | null,
    line: number | null,
    column: number | null,
  },
}

export interface SerializedChord {
  type: 'chord',
  base: string,
  modifier: Modifier | null,
  suffix: string | null,
  bassBase: string | null,
  bassModifier: Modifier | null,
  chordType: ChordType,
}

export interface SerializedChordLyricsPair {
  type: 'chordLyricsPair',
  chord?: SerializedChord | null,
  chords: string,
  lyrics: string | null,
  annotation?: string | null,
}

export interface SerializedChordDefinition {
  name: string,
  baseFret: number,
  frets: Fret[],
  fingers?: number[],
}

export type SerializedTag = SerializedTraceInfo & {
  type: 'tag',
  name: string,
  value: string,
  chordDefinition?: SerializedChordDefinition,
  attributes?: Record<string, string>,
  selector?: string | null,
  isNegated?: boolean,
};

export interface SerializedComment {
  type: 'comment',
  comment: string,
}

export type ContentType = 'tab' | 'abc' | 'ly' | 'grid';

export type PartTypes = 'part' | 'intro' | 'instrumental' | 'tag' | 'end';

export interface SerializedSection {
  type: 'section',
  sectionType: ContentType,
  content: string[],
  startTag: SerializedTag,
  endTag: SerializedTag,
}

export type SerializedLiteral = string;

export interface SerializedTernary extends SerializedTraceInfo {
  type: 'ternary',
  variable: string | null,
  valueTest: string | null,
  trueExpression: (SerializedLiteral | SerializedTernary)[],
  falseExpression: (SerializedLiteral | SerializedTernary)[],
}

export type SerializedComposite = (SerializedLiteral | SerializedTernary)[];

export interface SerializedSoftLineBreak {
  type: 'softLineBreak',
}

export type SerializedItem =
  SerializedChordLyricsPair |
  SerializedComment |
  SerializedLiteral |
  SerializedSoftLineBreak |
  SerializedTag |
  SerializedTernary;

export interface SerializedLine {
  type: 'line',
  items: SerializedItem[],
}

export interface SerializedSong {
  type: 'chordSheet',
  lines: SerializedLine[],
}

export type SerializedComponent =
  SerializedLine |
  SerializedSong |
  SerializedChordLyricsPair |
  SerializedTag |
  SerializedComment |
  SerializedTernary |
  SerializedLiteral |
  SerializedSection |
  SerializedSoftLineBreak;
