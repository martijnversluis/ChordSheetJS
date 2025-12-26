import ChordLyricsPair from './chord_sheet/chord_lyrics_pair';
import Item from './chord_sheet/item';
import Line from './chord_sheet/line';
import SUFFIX_MAPPING from './normalize_mappings/suffix-normalize-mapping';

import { GRADE_TO_KEY } from './scales';

import {
  Accidental, AccidentalMaybe, ChordType, MAJOR, MINOR, NO_ACCIDENTAL, NUMERAL, SHARP,
} from './constants';

export function callChain<T>(value: T, functions: ((_value: T) => T)[]): T {
  return functions.reduce((acc, fn) => fn(acc), value);
}

export function hasChordContents(line: Line): boolean {
  return line.items.some((item) => (item instanceof ChordLyricsPair) && !!item.chords);
}

export function hasRemarkContents(line: Line): boolean {
  return line.items.some((item) => (item instanceof ChordLyricsPair) && (item.chords || item.annotation));
}

export function isEvaluatable(item: Item): boolean {
  return ('evaluate' in item) && (typeof item.evaluate === 'function');
}

export function padLeft(string: string, length: number): string {
  let paddedString = string;
  for (let l = string.length; l < length; l += 1, paddedString += ' ');
  return paddedString;
}

type ObjectWithLength = any[] | string | null;

export function isPresent(object: ObjectWithLength): boolean {
  return !!object && object.length > 0;
}

function dasherize(string: string): string {
  return string.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function scopeSelector(selector: string, scope: string): string {
  return selector
    .split(',')
    .map((s) => `${scope} ${s.trim()}`.trim())
    .join(',\n');
}

type CssObject = Record<string, Record<string, string>>;

export function scopeCss(css: CssObject, scope = ''): string {
  return Object
    .entries(css)
    .map(([selector, styles]) => {
      const rules = Object
        .entries(styles)
        .map(([property, value]) => `${dasherize(property)}: ${value};`)
        .join('\n  ');

      const scopedSelector = scopeSelector(selector, scope);

      return `
${scopedSelector} {
  ${rules}
}`.substring(1);
    })
    .join('\n\n');
}

export function warn(message: string): void {
  const proc = globalThis.process;
  if (typeof proc === 'object' && typeof proc.emitWarning === 'function') {
    proc.emitWarning(message);
  } else {
    // eslint-disable-next-line no-console
    console.warn(message);
  }
}

export function deprecate(message: string): void {
  try {
    throw new Error(`DEPRECATION: ${message}`);
  } catch (e) {
    const error = (e as Error);
    warn(`${message}\n${error.stack}`);
  }
}

export function isEmptyString(string: string | null | undefined): boolean {
  return (string === null || string === undefined || string === '');
}

export function isMinor(key: string | number, keyType: ChordType, suffix: any): boolean {
  switch (keyType) {
    case NUMERAL:
      return typeof key === 'string' && key.toLowerCase() === key;
    default:
      return typeof suffix === 'string' &&
        suffix[0] === 'm' &&
        suffix.substring(0, 2).toLowerCase() !== 'ma' &&
        suffix.substring(0, 3).toLowerCase() !== 'maj';
  }
}

export function normalizeLineEndings(string: string): string {
  return string.replace(/\r\n?/g, '\n');
}

class GradeSet {
  grades: Record<AccidentalMaybe, Record<number, string>>;

  constructor(grades: Record<AccidentalMaybe, Record<number, string>>) {
    this.grades = grades;
  }

  determineGrade(accidental: AccidentalMaybe | null, preferredAccidental: Accidental | null, grade: number) {
    return this.getGradeForAccidental(accidental, grade) ||
      this.getGradeForAccidental(NO_ACCIDENTAL, grade) ||
      this.getGradeForAccidental(preferredAccidental, grade) ||
      this.getGradeForAccidental(SHARP, grade);
  }

  getGradeForAccidental(accidental: AccidentalMaybe | null, grade: number) {
    if (accidental) {
      return this.grades[accidental][grade];
    }

    return null;
  }
}

function determineKey({
  type,
  accidental,
  preferredAccidental,
  grade,
  minor,
}: {
  type: ChordType,
  accidental: AccidentalMaybe | null,
  preferredAccidental: Accidental | null,
  grade: number,
  minor: boolean,
}) {
  const mode = (minor ? MINOR : MAJOR);
  const grades = GRADE_TO_KEY[type][mode];
  return new GradeSet(grades).determineGrade(accidental, preferredAccidental, grade);
}

export function gradeToKey(options: {
  type: ChordType,
  accidental: AccidentalMaybe | null,
  preferredAccidental: Accidental | null,
  grade: number,
  minor: boolean,
}): string {
  const {
    type,
    accidental,
    preferredAccidental,
    grade,
    minor,
  } = options;

  let key = determineKey({
    type, accidental, preferredAccidental, grade, minor,
  });

  if (!key) {
    throw new Error(`Could not resolve ${options} to a key`);
  }

  if (minor && type === NUMERAL) {
    key = key.toLowerCase();
  }

  return key;
}

export function normalizeChordSuffix(suffix: string | null): string | null {
  if (suffix === null) {
    return null;
  }

  if (SUFFIX_MAPPING[suffix] === '[blank]') {
    return null;
  }

  return SUFFIX_MAPPING[suffix] || suffix;
}

export function filterObject<T>(
  object: Record<string, T>,
  predicate: (key: string, value: T) => boolean,
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(object).filter(([key, value]) => predicate(key, value)),
  );
}
