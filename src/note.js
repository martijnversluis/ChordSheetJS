import { NUMERIC, SYMBOL } from './constants';

const A = 'A'.charCodeAt(0);
const G = 'G'.charCodeAt(0);

const TRANSPOSE_DISTANCE = [null, 0, 2, 4, 5, 7, 9, 11];

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

class Note {
  constructor(note) {
    if (/^[A-Ga-g]$/.test(note)) {
      this.note = note.toUpperCase();
      this.type = SYMBOL;
    } else if (/^[1-7]$/.test(note)) {
      this.note = parseInt(note, 10);
      this.type = NUMERIC;
    } else {
      throw new Error(`Invalid note ${note}`);
    }
  }

  equals(otherNote) {
    return this.note === otherNote.note && this.type === otherNote.type;
  }

  clone() {
    return new this.constructor(this.note);
  }

  up() {
    return this.change(1);
  }

  down() {
    return this.change(-1);
  }

  isOneOf(...options) {
    return options.includes(this.note);
  }

  isNumeric() {
    return this.is(NUMERIC);
  }

  isChordSymbol() {
    return this.is(SYMBOL);
  }

  is(noteType) {
    return this.type === noteType;
  }

  getTransposeDistance() {
    return TRANSPOSE_DISTANCE[this.note];
  }

  change(delta) {
    if (this.isNumeric()) {
      let newNote = clamp(this.note + delta, 1, 7);

      if (newNote < 1) {
        newNote += 7;
      } else if (newNote > 7) {
        newNote -= 7;
      }

      return new Note(newNote);
    }

    let charCode;
    charCode = keyToCharCode(this.note);
    charCode += delta;
    charCode = clamp(charCode, A, G);

    return new Note(String.fromCharCode(charCode));
  }

  toString() {
    return `${this.note}`;
  }
}

export default Note;
