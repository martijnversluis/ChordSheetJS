import {
  Accidental,
  AccidentalMaybe,
  ChordType,
  FLAT,
  GERMAN,
  MAJOR,
  MINOR,
  NO_ACCIDENTAL,
  NUMERAL,
  Notation,
  SHARP,
  SYMBOL,
} from './constants';
import {
  KEY_TO_GRADE as KEY_TO_PITCH_CLASS,
  GRADE_TO_KEY as PITCH_CLASS_TO_KEY,
} from './scales';

export function isGermanNote(key: string): boolean {
  return key === 'H' || key === 'h';
}

function translateGermanNote(key: string): string {
  if (key === 'H') return 'B';
  if (key === 'h') return 'b';
  return key;
}

export function germanBLookupAccidental(
  key: string,
  accidental: Accidental | null,
  notation: Notation | null,
): Accidental | null {
  if (notation === GERMAN && accidental === null && (key === 'B' || key === 'b')) return FLAT;
  return null;
}

export function resolveNotation(keyString: string, explicit?: Notation | null): Notation | null {
  if (explicit) return explicit;
  return isGermanNote(keyString) ? GERMAN : null;
}

export function keyToPitchClass(
  key: string,
  accidental: AccidentalMaybe,
  type: ChordType,
  minor: boolean,
): number | null {
  const pitchClasses = KEY_TO_PITCH_CLASS[type][minor ? MINOR : MAJOR][accidental];
  const lookupKey = type === SYMBOL ? translateGermanNote(key) : key;

  if (lookupKey in pitchClasses) return pitchClasses[lookupKey];

  const upperCaseKey = lookupKey.toUpperCase();
  return upperCaseKey in pitchClasses ? pitchClasses[upperCaseKey] : null;
}

export function pitchClassToKey({
  type,
  accidental,
  preferredAccidental,
  pitchClass,
  minor,
}: {
  type: ChordType;
  accidental: AccidentalMaybe | null;
  preferredAccidental: Accidental | null;
  pitchClass: number;
  minor: boolean;
}): string {
  const spellings = PITCH_CLASS_TO_KEY[type][minor ? MINOR : MAJOR];
  const accidentalOrder = [accidental, NO_ACCIDENTAL, preferredAccidental, SHARP];
  const key = accidentalOrder.reduce<string | null>((result, candidate) => (
    result || (candidate ? spellings[candidate][pitchClass] : null)
  ), null);

  if (!key) throw new Error(`Could not resolve pitch class ${pitchClass} to a key`);
  return minor && type === NUMERAL ? key.toLowerCase() : key;
}

function baseNote(spelling: string): string {
  return spelling.replace('#', '').replace('b', '');
}

const NATURAL_NOTE_NAMES = new Map<ChordType, string[]>();

function naturalNoteNames(type: ChordType): string[] {
  const cached = NATURAL_NOTE_NAMES.get(type);
  if (cached) return cached;

  const notes = Object.entries(PITCH_CLASS_TO_KEY[type][MAJOR][NO_ACCIDENTAL])
    .sort(([left], [right]) => Number(left) - Number(right))
    .map(([, spelling]) => spelling);
  NATURAL_NOTE_NAMES.set(type, notes);
  return notes;
}

export function scaleDegreeBetween(context: string, spelling: string, type: ChordType): number | null {
  const notes = naturalNoteNames(type);
  const tonicIndex = notes.indexOf(baseNote(context));
  const noteIndex = notes.indexOf(baseNote(spelling));
  if (tonicIndex < 0 || noteIndex < 0) return null;
  return ((noteIndex - tonicIndex + notes.length) % notes.length) + 1;
}

export function spellPitchForScaleDegree({
  context,
  degree,
  pitchClass,
  type,
}: {
  context: string;
  degree: number;
  pitchClass: number;
  type: ChordType;
}): string | null {
  const notes = naturalNoteNames(type);
  const tonicIndex = notes.indexOf(baseNote(context));
  if (tonicIndex < 0) return null;

  const desiredNote = notes[(tonicIndex + degree - 1) % notes.length];
  const spellings = PITCH_CLASS_TO_KEY[type][MAJOR];
  const candidates = [NO_ACCIDENTAL, SHARP, FLAT]
    .map((candidate) => spellings[candidate][pitchClass])
    .filter((candidate): candidate is string => Boolean(candidate));

  return candidates.find((candidate) => baseNote(candidate) === desiredNote) || null;
}
