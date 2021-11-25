import Note from './note';
import { NUMERIC, SYMBOL } from './constants';

const FLAT = 'b';
const SHARP = '#';

const MODIFIER_TRANSPOSITION = {
  [SHARP]: 1,
  [FLAT]: -1,
};

const symbolKeyRegex = (
  /^(?<note>[A-G])(?<modifier>#|b)?$/i
);

const numericKeyRegex = (
  /^(?<modifier>#|b)?(?<note>[1-7])$/
);

const regexes = [symbolKeyRegex, numericKeyRegex];

class Key {
  static parse(keyString) {
    for (let i = 0, count = regexes.length; i < count; i += 1) {
      const match = keyString.match(regexes[i]);

      if (match) {
        return new Key(match.groups);
      }
    }

    return null;
  }

  static wrap(keyStringOrObject) {
    if (keyStringOrObject instanceof Key) {
      return keyStringOrObject;
    }

    return this.parse(keyStringOrObject);
  }

  constructor({ note, modifier = null }) {
    this.note = (note instanceof Note) ? note : new Note(note);
    this.modifier = modifier || null;
  }

  #set(attributes) {
    return new this.constructor({
      note: this.note.clone(),
      modifier: this.modifier,
      ...attributes,
    });
  }

  clone() {
    return this.#set({});
  }

  toChordSymbol(key) {
    if (this.is(SYMBOL)) {
      return this.clone();
    }

    const transposeDistance = this.note.getTransposeDistance() + (MODIFIER_TRANSPOSITION[this.modifier] || 0);

    return key.transpose(transposeDistance).normalize().useModifier(key.modifier);
  }

  toChordSymbolString(key) {
    return this.toChordSymbol(key).toString();
  }

  is(type) {
    return this.note.is(type);
  }

  isNumeric() {
    return this.is(NUMERIC);
  }

  isChordSymbol() {
    return this.is(SYMBOL);
  }

  toNumeric(key) {
    if (this.isNumeric()) {
      return this.clone();
    }

    let numericKey = new Key({ note: 1 });
    let symbolKey = key.clone();
    const reference = this.clone().normalize().useModifier(key.modifier);

    while (!symbolKey.equals(reference)) {
      numericKey = numericKey.transposeUp().useModifier(key.modifier);
      symbolKey = symbolKey.transposeUp().normalize().useModifier(key.modifier);
    }

    return numericKey;
  }

  equals({ note, modifier }) {
    return this.note.equals(note) && this.modifier === modifier;
  }

  toNumericString(key) {
    return this.toNumeric(key).toString();
  }

  toString() {
    if (this.is(NUMERIC)) {
      return `${this.modifier || ''}${this.note}`;
    }

    return `${this.note}${this.modifier || ''}`;
  }

  transpose(delta) {
    if (delta === 0) {
      return this;
    }

    const originalModifier = this.modifier;
    let transposedKey = this.clone();
    const func = (delta < 0) ? 'transposeDown' : 'transposeUp';

    for (let i = 0, count = Math.abs(delta); i < count; i += 1) {
      transposedKey = transposedKey[func]();
    }

    return transposedKey.useModifier(originalModifier);
  }

  transposeUp() {
    if (this.modifier === FLAT) {
      return this.#set({ modifier: null });
    }

    if (this.note.isOneOf(3, 7, 'E', 'B')) {
      return this.#set({
        note: this.note.up(),
      });
    }

    if (this.modifier === SHARP) {
      return this.#set({
        note: this.note.up(),
        modifier: null,
      });
    }

    return this.#set({ modifier: SHARP });
  }

  transposeDown() {
    if (this.modifier === SHARP) {
      return this.#set({ modifier: null });
    }

    if (this.note.isOneOf(1, 4, 'C', 'F')) {
      return this.#set({
        note: this.note.down(),
      });
    }

    if (this.modifier === FLAT) {
      return this.#set({
        note: this.note.down(),
        modifier: null,
      });
    }

    return this.#set({ modifier: FLAT });
  }

  useModifier(newModifier) {
    if (this.modifier === FLAT && newModifier === SHARP) {
      return this.#set({
        note: this.note.down(),
        modifier: SHARP,
      });
    }

    if (this.modifier === SHARP && newModifier === FLAT) {
      return this.#set({
        note: this.note.up(),
        modifier: FLAT,
      });
    }

    return this.clone();
  }

  normalize() {
    if (this.modifier === SHARP && this.note.isOneOf(3, 7, 'E', 'B')) {
      return this.#set({
        note: this.note.up(),
        modifier: null,
      });
    }

    if (this.modifier === FLAT && this.note.isOneOf(1, 4, 'C', 'F')) {
      return this.#set({
        note: this.note.down(),
        modifier: null,
      });
    }

    return this.clone();
  }
}

export default Key;
