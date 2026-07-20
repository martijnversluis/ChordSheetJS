export type ChordLineTokenKind =
  | 'chord'
  | 'rhythm-symbol'
  | 'barline'
  | 'instruction'
  | 'no-chord'
  | 'annotation';

export type ChordLineTokenVariant =
  | 'continuation'
  | 'break'
  | 'mute'
  | 'single'
  | 'double'
  | 'end'
  | 'repeat-start'
  | 'repeat-end'
  | 'repeat-end-start'
  | 'repeat-count'
  | 'marker'
  | 'annotation'
  | null;

export type ChordLineStyleRole =
  | 'chord'
  | 'rhythmSymbol'
  | 'barline'
  | 'instruction'
  | 'noChord'
  | 'annotation';

export type ChordLineElementType =
  | 'chord'
  | 'rhythm-symbol'
  | 'barline'
  | 'instruction'
  | 'no-chord'
  | 'annotation';

export interface ChordLineTokenClassification {
  kind: ChordLineTokenKind;
  variant: ChordLineTokenVariant;
}

const BARLINE_VARIANTS: Record<string, ChordLineTokenVariant> = {
  '|': 'single',
  '||': 'double',
  '|.': 'end',
  '|:': 'repeat-start',
  ':|': 'repeat-end',
  ':||': 'repeat-end',
  ':|:': 'repeat-end-start',
};

const RHYTHM_VARIANTS: Record<string, ChordLineTokenVariant> = {
  '/': 'continuation',
  '-': 'break',
  'x': 'mute',
};

const NO_CHORD = /^(?:N\.C\.?|N\/C|NC)$/i;
const REPEAT_COUNT = /^\(\d+x\)$/i;

const VALID_VARIANTS: Record<ChordLineTokenKind, ChordLineTokenVariant[]> = {
  'chord': [null],
  'rhythm-symbol': ['continuation', 'break', 'mute', null],
  'barline': ['single', 'double', 'end', 'repeat-start', 'repeat-end', 'repeat-end-start', null],
  'instruction': ['repeat-count', null],
  'no-chord': ['marker', null],
  'annotation': ['annotation', null],
};

export function classifyChordLineToken(
  value: string,
  annotation = '',
  legacyRhythmSymbol = false,
): ChordLineTokenClassification {
  if (annotation) return { kind: 'annotation', variant: 'annotation' };
  if (NO_CHORD.test(value)) return { kind: 'no-chord', variant: 'marker' };
  if (REPEAT_COUNT.test(value)) return { kind: 'instruction', variant: 'repeat-count' };
  if (BARLINE_VARIANTS[value]) return { kind: 'barline', variant: BARLINE_VARIANTS[value] };
  if (RHYTHM_VARIANTS[value]) return { kind: 'rhythm-symbol', variant: RHYTHM_VARIANTS[value] };
  if (legacyRhythmSymbol) return { kind: 'rhythm-symbol', variant: null };
  return { kind: 'chord', variant: null };
}

export function chordLineStyleRole(kind: ChordLineTokenKind, value: string): ChordLineStyleRole {
  if (kind === 'barline' && value === '|') return 'rhythmSymbol';

  switch (kind) {
    case 'rhythm-symbol': return 'rhythmSymbol';
    case 'barline': return 'barline';
    case 'instruction': return 'instruction';
    case 'no-chord': return 'noChord';
    case 'annotation': return 'annotation';
    case 'chord':
    default: return 'chord';
  }
}

export function isChordTokenKind(kind: ChordLineTokenKind): boolean {
  return kind === 'chord';
}

export function isTokenVariantValid(kind: ChordLineTokenKind, variant: ChordLineTokenVariant): boolean {
  return VALID_VARIANTS[kind].includes(variant);
}

export function isFlowSymbolKind(kind: ChordLineTokenKind): boolean {
  return kind === 'rhythm-symbol' || kind === 'barline' || kind === 'instruction';
}

export function chordLineElementType(kind: ChordLineTokenKind): ChordLineElementType {
  switch (kind) {
    case 'rhythm-symbol': return 'rhythm-symbol';
    case 'barline': return 'barline';
    case 'instruction': return 'instruction';
    case 'no-chord': return 'no-chord';
    case 'annotation': return 'annotation';
    case 'chord':
    default: return 'chord';
  }
}

export function isRhythmSymbolValue(value: string): boolean {
  return classifyChordLineToken(value).kind === 'rhythm-symbol';
}
