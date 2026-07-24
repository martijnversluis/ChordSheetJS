import { GRADE_TO_KEY } from './scales';
import {
  ChordType, FLAT, MAJOR, NO_ACCIDENTAL, SHARP, SOLFEGE,
} from './constants';

const SYMBOL_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const SOLFEGE_NOTES = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];

function noteName(spelling: string): string {
  return spelling.replace('#', '').replace('b', '');
}

export function scaleDegreeForSpelling(context: string, spelling: string, type: ChordType): number | null {
  const notes = type === SOLFEGE ? SOLFEGE_NOTES : SYMBOL_NOTES;
  const tonicIndex = notes.indexOf(noteName(context));
  const noteIndex = notes.indexOf(noteName(spelling));
  if (tonicIndex < 0 || noteIndex < 0) return null;
  return ((noteIndex - tonicIndex + notes.length) % notes.length) + 1;
}

export default function scaleDegreeSpelling({
  context, degree, pitch, type,
}: {
  context: string;
  degree: number;
  pitch: number;
  type: ChordType;
}): string | null {
  const notes = type === SOLFEGE ? SOLFEGE_NOTES : SYMBOL_NOTES;
  const tonicIndex = notes.indexOf(noteName(context));
  if (tonicIndex < 0) return null;

  const desiredNote = notes[(tonicIndex + degree - 1) % notes.length];
  const spellings = GRADE_TO_KEY[type][MAJOR];
  const candidates = [NO_ACCIDENTAL, SHARP, FLAT]
    .map((accidental) => spellings[accidental][pitch])
    .filter((candidate): candidate is string => Boolean(candidate));

  return candidates.find((candidate) => noteName(candidate) === desiredNote) || null;
}
