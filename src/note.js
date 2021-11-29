import {
  NUMERAL, NUMERIC, ROMAN_NUMERALS, SYMBOL,
} from './constants';

const A = 'A'.charCodeAt(0);
const G = 'G'.charCodeAt(0);

const TRANSPOSE_DISTANCE_MAJOR = [null, 0, 2, 4, 5, 7, 9, 11];
const TRANSPOSE_DISTANCE_MINOR = [null, 0, 2, 3, 5, 7, 8, 10];

function keyToCharCode(key) {
  return key.toUpperCase().charCodeAt(0);
}

function clamp(note, min, max) {
  let newNote = note;

  if (newNote < min) {
    newNote += 7;
  } else if (newNote > max) {
    newNote -= 7;
  }

  return newNote;
}

function numeralToNumber(numeral) {
  for (let i = 0, count = ROMAN_NUMERALS.length; i < count; i += 1) {
    const romanNumeral = ROMAN_NUMERALS[i];

    if (romanNumeral === numeral || romanNumeral.toLowerCase() === numeral) {
      return i + 1;
    }
  }

  return null;
}

function numberToNumeral(number) {
  return ROMAN_NUMERALS[number - 1];
}

class Note {
  constructor({ note, type, minor = false }) {
    this._note = note;
    this.type = type;
    this.minor = minor;
  }

  static parse(note) {
    if (/^[A-Ga-g]$/.test(note)) {
      return new Note({ note: note.toUpperCase(), type: SYMBOL });
    }

    if (/^[1-7]$/.test(note)) {
      return new Note({ note: parseInt(note, 10), type: NUMERIC });
    }

    const romanNumeralValue = numeralToNumber(note);

    if (romanNumeralValue) {
      return new Note({
        note: romanNumeralValue,
        type: NUMERAL,
        minor: (note.toLowerCase() === note),
      });
    }

    throw new Error(`Invalid note ${note}`);
  }

  toNumeral() {
    if (this.isNumeral()) {
      return this.clone();
    }

    if (this.isNumeric()) {
      return this.#set({ type: NUMERAL });
    }

    throw new Error(`Converting a ${this.type} note to numeral is not supported`);
  }

  toNumeric() {
    if (this.isNumeric()) {
      return this.clone();
    }

    if (this.isNumeral()) {
      return this.#set({ type: NUMERIC });
    }

    throw new Error(`Converting a ${this.type} note to numeric is not supported`);
  }

  isMinor() {
    return this.minor;
  }

  equals(otherNote) {
    return this._note === otherNote._note && this.type === otherNote.type && this.minor === otherNote.minor;
  }

  clone() {
    return this.#set({});
  }

  up() {
    return this.change(1);
  }

  down() {
    return this.change(-1);
  }

  isOneOf(...options) {
    return options.includes(this._note);
  }

  isNumeric() {
    return this.is(NUMERIC);
  }

  isChordSymbol() {
    return this.is(SYMBOL);
  }

  isNumeral() {
    return this.is(NUMERAL);
  }

  is(noteType) {
    return this.type === noteType;
  }

  getTransposeDistance(minorKey) {
    // minor keys use a different scale
    if(minorKey) {
      return TRANSPOSE_DISTANCE_MINOR[this._note];
    }
    return TRANSPOSE_DISTANCE_MAJOR[this._note];
  }

  change(delta) {
    if (this.isChordSymbol()) {
      let charCode;
      charCode = keyToCharCode(this._note);
      charCode += delta;
      charCode = clamp(charCode, A, G);

      return this.#set({ note: String.fromCharCode(charCode) });
    }

    let newNote = clamp(this._note + delta, 1, 7);

    if (newNote < 1) {
      newNote += 7;
    } else if (newNote > 7) {
      newNote -= 7;
    }

    return this.#set({ note: newNote });
  }

  get note() {
    if (this.isNumeral()) {
      const numeral = numberToNumeral(this._note);

      if (this.isMinor()) {
        return numeral.toLowerCase();
      }

      return numeral;
    }

    return this._note;
  }

  toString() {
    return `${this.note}`;
  }

  #set(attributes) {
    return new this.constructor({
      note: this._note,
      type: this.type,
      minor: this.minor,
      ...attributes,
    });
  }
}

export default Note;
