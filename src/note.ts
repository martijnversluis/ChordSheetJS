import {
  ChordType, NUMERAL, NUMERIC, ROMAN_NUMERALS, SOLFEGE, SYMBOL,
} from './constants';

const A = 'A'.charCodeAt(0);
const G = 'G'.charCodeAt(0);
const solfegeNotes = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];

const TRANSPOSE_DISTANCE_MAJOR: Record<number, number> = {
  1: 0,
  2: 2,
  3: 4,
  4: 5,
  5: 7,
  6: 9,
  7: 11,
};

const TRANSPOSE_DISTANCE_MINOR: Record<number, number> = {
  1: 0,
  2: 2,
  3: 3,
  4: 5,
  5: 7,
  6: 8,
  7: 11,
};

function keyToCharCode(key: string): number {
  return key.toUpperCase().charCodeAt(0);
}

function clamp(note: number, min: number, max: number): number {
  let newNote = note;

  if (newNote < min) {
    newNote += 7;
  } else if (newNote > max) {
    newNote -= 7;
  }

  return newNote;
}

function numeralToNumber(numeral: string): null | number {
  for (let i = 0, count = ROMAN_NUMERALS.length; i < count; i += 1) {
    const romanNumeral = ROMAN_NUMERALS[i];

    if (romanNumeral === numeral || romanNumeral.toLowerCase() === numeral) {
      return i + 1;
    }
  }

  return null;
}

function numberToNumeral(number: number): string {
  return ROMAN_NUMERALS[number - 1];
}

type AtomicNote = string | number;

interface NoteProperties {
  note?: AtomicNote;
  type?: ChordType;
  minor?: boolean;
}

class Note implements NoteProperties {
  readonly _note: AtomicNote;

  type: ChordType;

  minor = false;

  constructor({ note, type, minor = false }: { note: AtomicNote, type: ChordType, minor?: boolean }) {
    this._note = note;
    this.type = type;
    this.minor = minor;
  }

  static parse(note: string | number): Note {
    const noteString = note.toString();

    const parsedNote =
      this.parseSolfege(noteString) ||
      this.parseSymbol(noteString) ||
      this.parseNumeric(noteString) ||
      this.parseNumeral(noteString);

    if (parsedNote) {
      return parsedNote;
    }

    throw new Error(`Invalid note ${note}`);
  }

  static parseSolfege(noteString: string): Note | null {
    if (/^Do|Re|Mi|Fa|Sol|La|Si$/i.test(noteString)) {
      return new Note({
        note: noteString.charAt(0).toUpperCase() + noteString.slice(1).toLowerCase(),
        type: SOLFEGE,
      });
    }

    return null;
  }

  static parseSymbol(noteString: string): Note | null {
    if (/^[A-Ga-g]$/.test(noteString)) {
      return new Note({
        note: noteString.toUpperCase(),
        type: SYMBOL,
      });
    }

    return null;
  }

  static parseNumeric(noteString: string): Note | null {
    if (/^[1-7]$/.test(noteString)) {
      return new Note({
        note: parseInt(noteString, 10),
        type: NUMERIC,
      });
    }

    return null;
  }

  static parseNumeral(noteString: string): Note | null {
    const romanNumeralValue = numeralToNumber(noteString);

    if (romanNumeralValue) {
      return new Note({
        note: romanNumeralValue,
        type: NUMERAL,
        minor: (noteString.toLowerCase() === noteString),
      });
    }

    return null;
  }

  toNumeral(): Note {
    if (this.is(NUMERAL)) {
      return this.clone();
    }

    if (this.is(NUMERIC)) {
      return this.set({ type: NUMERAL });
    }

    throw new Error(`Converting a ${this.type} note to numeral is not supported`);
  }

  toNumeric(): Note {
    if (this.is(NUMERIC)) {
      return this.clone();
    }

    if (this.is(NUMERAL)) {
      return this.set({ type: NUMERIC });
    }

    throw new Error(`Converting a ${this.type} note to numeric is not supported`);
  }

  isMinor(): boolean {
    return this.minor;
  }

  equals(otherNote: Note): boolean {
    return this._note === otherNote._note && this.type === otherNote.type && this.minor === otherNote.minor;
  }

  clone(): Note {
    return this.set({});
  }

  up(): Note {
    return this.transpose(1);
  }

  down(): Note {
    return this.transpose(-1);
  }

  isOneOf(...options: AtomicNote[]): boolean {
    return options.includes(this._note);
  }

  is(noteType: ChordType): boolean {
    return this.type === noteType;
  }

  getTransposeDistance(minor: boolean): number {
    if (typeof this._note === 'number') {
      if (minor && this._note in TRANSPOSE_DISTANCE_MINOR) {
        return TRANSPOSE_DISTANCE_MINOR[this._note];
      }

      if (this._note in TRANSPOSE_DISTANCE_MAJOR) {
        return TRANSPOSE_DISTANCE_MAJOR[this._note];
      }
    }

    return 0;
  }

  transpose(delta: number): Note {
    if (this.is(SOLFEGE)) {
      return this.transposeSolfege(delta);
    }

    if (this.is(SYMBOL)) {
      return this.transposeSymbol(delta);
    }

    let newNote = clamp((this._note as number) + delta, 1, 7);

    if (newNote < 1) {
      newNote += 7;
    } else if (newNote > 7) {
      newNote -= 7;
    }

    return this.set({ note: newNote });
  }

  private transposeSymbol(delta: number): Note {
    let charCode;
    charCode = keyToCharCode(this._note as string);
    charCode += delta;
    charCode = clamp(charCode, A, G);

    return this.set({ note: String.fromCharCode(charCode) });
  }

  private transposeSolfege(delta: number): Note {
    const solfegeNote = this._note as string;
    const currentIndex = solfegeNotes.indexOf(solfegeNote);

    return this.set({ note: solfegeNotes[(currentIndex + delta) % 7] });
  }

  get note(): string | number {
    if (this.is(NUMERAL)) {
      const numeral = numberToNumeral(this._note as number);

      if (this.isMinor()) {
        return numeral.toLowerCase();
      }

      return numeral;
    }

    return this._note;
  }

  toString(): string {
    const note = this.note as string;

    switch (this.type) {
      case NUMERAL:
        return `${this.minor ? note.toLowerCase() : note.toUpperCase()}`;
      default:
        return `${this.note}`;
    }
  }

  private set(properties: NoteProperties): Note {
    return new Note({
      note: this._note,
      type: this.type,
      minor: this.minor,
      ...properties,
    });
  }
}

export default Note;
