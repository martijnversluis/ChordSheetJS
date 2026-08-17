export type ChordLineTokenKind =
  | 'chord'
  | 'rhythm-symbol'
  | 'barline'
  | 'instruction'
  | 'no-chord'
  | 'annotation';

type RhythmSymbolVariant =
  | 'continuation'
  | 'break'
  | 'mute'
  | null;

type BarlineVariant =
  | 'single'
  | 'double'
  | 'end'
  | 'repeat-start'
  | 'repeat-end'
  | 'repeat-end-start'
  | null;

export type ChordLineTokenVariant =
  | RhythmSymbolVariant
  | BarlineVariant
  | 'repeat-count'
  | 'marker'
  | 'annotation';

export type ChordLineStyleRole =
  | 'chord'
  | 'rhythmSymbol'
  | 'barline'
  | 'instruction'
  | 'noChord'
  | 'annotation';

export type ChordLineTokenClassification =
  | { readonly kind: 'chord'; readonly variant: null }
  | { readonly kind: 'rhythm-symbol'; readonly variant: RhythmSymbolVariant }
  | { readonly kind: 'barline'; readonly variant: BarlineVariant }
  | { readonly kind: 'instruction'; readonly variant: 'repeat-count' | null }
  | { readonly kind: 'no-chord'; readonly variant: 'marker' | null }
  | { readonly kind: 'annotation'; readonly variant: 'annotation' | null };

const BARLINE_VARIANTS: Record<string, Exclude<BarlineVariant, null>> = {
  '|': 'single',
  '||': 'double',
  '|.': 'end',
  '|:': 'repeat-start',
  ':|': 'repeat-end',
  ':||': 'repeat-end',
  ':|:': 'repeat-end-start',
};

const RHYTHM_VARIANTS: Record<string, Exclude<RhythmSymbolVariant, null>> = {
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

export function isTokenVariantValid(kind: unknown, variant: unknown): boolean {
  const validVariants = VALID_VARIANTS[kind as ChordLineTokenKind];
  return !!validVariants && validVariants.includes(variant as ChordLineTokenVariant);
}

export function isChordLineTokenClassification(value: unknown): value is ChordLineTokenClassification {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as { kind?: unknown, variant?: unknown };
  return isTokenVariantValid(candidate.kind, candidate.variant);
}

export function resolveChordLineTokenClassification(
  value: string,
  annotation = '',
  legacyRhythmSymbol = false,
  classification?: unknown,
): ChordLineTokenClassification {
  const inferred = classifyChordLineToken(value, annotation, legacyRhythmSymbol);
  if (!classification || typeof classification !== 'object') return inferred;

  const candidate = classification as { kind?: unknown, variant?: unknown };
  let variant: unknown = null;
  if (Object.prototype.hasOwnProperty.call(candidate, 'variant')) {
    variant = candidate.variant;
  } else if (candidate.kind === inferred.kind) {
    variant = inferred.variant;
  }
  const resolved = { kind: candidate.kind, variant };

  return isChordLineTokenClassification(resolved) ? resolved : inferred;
}

export function isFlowSymbolKind(kind: ChordLineTokenKind): boolean {
  return kind === 'rhythm-symbol' || kind === 'barline' || kind === 'instruction';
}

export function isRhythmSymbolValue(value: string): boolean {
  return classifyChordLineToken(value).kind === 'rhythm-symbol';
}
