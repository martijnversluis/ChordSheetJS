import Note from './note';
import { NUMERAL, NUMERIC, SYMBOL } from './constants';
import ENHARMONIC_MAPPING from './normalize_mappings/enharmonic-normalize';
import { parseWithRegexes } from './utilities';

const FLAT = 'b';
const SHARP = '#';

const MODIFIER_TRANSPOSITION = {
  [SHARP]: 1,
  [FLAT]: -1,
};

const symbolKeyRegex = (
  /^(?<note>[A-G])(?<modifier>#|b)?(?<minor>m)?$/i
);

const numericKeyRegex = (
  /^(?<modifier>#|b)?(?<note>[1-7])(?<minor>m)?$/
);

const numeralKeyRegex = (
  /^(?<modifier>#|b)?(?<note>I{1,3}|IV|VI{0,2}|i{1,3}|iv|vi{0,2})$/
);

const regexes = [symbolKeyRegex, numericKeyRegex, numeralKeyRegex];

class Key {
  note: Note;

  modifier?: string = null;

  minor: boolean = false;

  static parse(keyString) {
    return parseWithRegexes(keyString, Key, regexes);
  }

  static wrap(keyStringOrObject) {
    if (keyStringOrObject instanceof Key) {
      return keyStringOrObject;
    }

    return this.parse(keyStringOrObject);
  }

  static toString(keyStringOrObject) {
    return `${Key.wrap(keyStringOrObject)}`;
  }

  static distance(oneKey, otherKey) {
    return this.wrap(oneKey).distanceTo(otherKey);
  }

  distanceTo(otherKey) {
    const otherKeyObj = Key.wrap(otherKey);
    let key = this.useModifier(otherKeyObj.modifier);
    let delta = 0;

    while (!key.equals(otherKeyObj) && delta < 20) {
      key = key.transposeUp().useModifier(otherKeyObj.modifier);
      delta += 1;
    }

    return delta;
  }

  constructor({ note, modifier = null, minor = false }) {
    this.note = (note instanceof Note) ? note : Note.parse(note);
    this.modifier = modifier || null;
    this.minor = !!minor || false;

    if (this.minor) {
      this.note.minor = true;
    }
  }

  isMinor() {
    return this.minor || this.note.isMinor();
  }

  clone() {
    return this.set({});
  }

  toChordSymbol(key) {
    if (this.is(SYMBOL)) {
      return this.clone();
    }

    const transposeDistance = this.note.getTransposeDistance(key.minor) + (MODIFIER_TRANSPOSITION[this.modifier] || 0);

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

  isNumeral() {
    return this.is(NUMERAL);
  }

  equals({ note, modifier = null }) {
    return this.note.equals(note) && this.modifier === modifier;
  }

  toNumeric(key: Key = null) {
    if (this.isNumeric()) {
      return this.clone();
    }

    if (this.isNumeral()) {
      return this.set({
        note: this.note.toNumeric(),
      });
    }

    return this.transposeNoteUpToKey(1, key);
  }

  toNumericString(key = null) {
    return this.toNumeric(key).toString();
  }

  toNumeral(key = null) {
    if (this.isNumeral()) {
      return this.clone();
    }

    if (this.isNumeric()) {
      return this.set({
        note: this.note.toNumeral(),
      });
    }

    return this.transposeNoteUpToKey('I', key);
  }

  toNumeralString(key = null) {
    return this.toNumeral(key).toString();
  }

  toString({ showMinor = true } = {}) {
    switch (this.note.type) {
      case SYMBOL:
        return this.formatChordSymbolString(showMinor);
      case NUMERIC:
        return this.formatNumericString(showMinor);
      case NUMERAL:
        return this.formatNumeralString();
      default:
        throw new Error(`Unexpected note type ${this.note.type}`);
    }
  }

  private formatChordSymbolString(showMinor: boolean) {
    return `${this.note}${this.modifier || ''}${this.minor && showMinor ? 'm' : ''}`;
  }

  private formatNumericString(showMinor: boolean) {
    return `${this.modifier || ''}${this.note}${this.minor && showMinor ? 'm' : ''}`;
  }

  private formatNumeralString() {
    return `${this.modifier || ''}${this.note}`;
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
      return this.set({ modifier: null });
    }

    if (this.note.isOneOf(3, 7, 'E', 'B')) {
      return this.set({
        note: this.note.up(),
      });
    }

    if (this.modifier === SHARP) {
      return this.set({
        note: this.note.up(),
        modifier: null,
      });
    }

    return this.set({ modifier: SHARP });
  }

  transposeDown() {
    if (this.modifier === SHARP) {
      return this.set({ modifier: null });
    }

    if (this.note.isOneOf(1, 4, 'C', 'F')) {
      return this.set({
        note: this.note.down(),
      });
    }

    if (this.modifier === FLAT) {
      return this.set({
        note: this.note.down(),
        modifier: null,
      });
    }

    return this.set({ modifier: FLAT });
  }

  useModifier(newModifier) {
    if (this.modifier === FLAT && newModifier === SHARP) {
      return this.set({
        note: this.note.down(),
        modifier: SHARP,
      });
    }

    if (this.modifier === SHARP && newModifier === FLAT) {
      return this.set({
        note: this.note.up(),
        modifier: FLAT,
      });
    }

    return this.clone();
  }

  normalize() {
    if (this.modifier === SHARP && this.note.isOneOf(3, 7, 'E', 'B')) {
      return this.set({
        note: this.note.up(),
        modifier: null,
      });
    }

    if (this.modifier === FLAT && this.note.isOneOf(1, 4, 'C', 'F')) {
      return this.set({
        note: this.note.down(),
        modifier: null,
      });
    }

    return this.clone();
  }

  normalizeEnharmonics(key: Key | string) {
    if (key) {
      const rootKeyString = Key.wrap(key).toString({ showMinor: true });
      const enharmonics = ENHARMONIC_MAPPING[rootKeyString];
      const thisKeyString = this.toString({ showMinor: false });

      if (enharmonics && enharmonics[thisKeyString]) {
        return Key.parse(enharmonics[thisKeyString]);
      }
    }
    return this.clone();
  }

  private set(attributes) {
    return new Key({
      note: this.note.clone(),
      modifier: this.modifier,
      minor: !!this.minor,
      ...attributes,
    });
  }

  private transposeNoteUpToKey(note: number | string, key: Key) {
    let numericKey = new Key({ note });
    let symbolKey = key.clone();
    const reference = this.clone().normalize().useModifier(key.modifier).normalizeEnharmonics(key);

    while (!symbolKey.equals(reference)) {
      numericKey = numericKey.transposeUp().useModifier(key.modifier);
      symbolKey = symbolKey.transposeUp().normalize().useModifier(key.modifier).normalizeEnharmonics(key);
    }

    return numericKey;
  }
}

export default Key;
