import Note from './note';
import {
  ChordType, Modifier, NUMERAL, NUMERIC, SYMBOL,
} from './constants';
import ENHARMONIC_MAPPING from './normalize_mappings/enharmonic-normalize';
import { isEmptyString } from './utilities';

const FLAT = 'b';
const SHARP = '#';

const symbolKeyRegex = /^(?<note>[A-G])(?<modifier>#|b)?(?<minor>m)?$/i;
const numericKeyRegex = /^(?<modifier>#|b)?(?<note>[1-7])(?<minor>m)?$/;
const numeralKeyRegex = /^(?<modifier>#|b)?(?<note>I{1,3}|IV|VI{0,2}|i{1,3}|iv|vi{0,2})$/;

const regexes = [symbolKeyRegex, numericKeyRegex, numeralKeyRegex];

function modifierTransposition(modifier: Modifier | null): number {
  switch (modifier) {
    case SHARP: return 1;
    case FLAT: return -1;
    default: return 0;
  }
}

interface KeyProperties {
  note?: Note;
  modifier?: Modifier | null;
  minor?: boolean;
}

/**
 * Represents a key, such as Eb (symbol), #3 (numeric) or VII (numeral).
 *
 * The only function considered public API is `Key.distance`
 */
class Key implements KeyProperties {
  note: Note;

  modifier: Modifier | null = null;

  get unicodeModifier(): string | null {
    switch (this.modifier) {
      case FLAT:
        return '\u266d';
      case SHARP:
        return '\u266f';
      default:
        return null;
    }
  }

  minor = false;

  static parse(keyString: string | null): null | Key {
    if (!keyString || isEmptyString(keyString)) return null;

    for (let i = 0, count = regexes.length; i < count; i += 1) {
      const match = keyString.match(regexes[i]);

      if (match) {
        const { note, modifier, minor } = match.groups as { note: string, modifier?: Modifier, minor?: string };
        return new Key({ note, modifier, minor: !!minor });
      }
    }

    return null;
  }

  static parseOrFail(keyString: string | null): Key {
    const parsed = this.parse(keyString);

    if (!parsed) throw new Error(`Failed to parse ${keyString}`);

    return parsed;
  }

  static wrap(keyStringOrObject: Key | string): Key | null {
    if (keyStringOrObject instanceof Key) return keyStringOrObject;

    return this.parse(keyStringOrObject);
  }

  static wrapOrFail(keyStringOrObject: Key | string | null = null): Key {
    if (keyStringOrObject === null) throw new Error('Unexpected null key');

    const wrapped = this.wrap(keyStringOrObject);

    if (wrapped === null) throw new Error(`Failed: invalid key ${keyStringOrObject}`);

    return wrapped;
  }

  static toString(keyStringOrObject: Key | string) {
    return `${Key.wrapOrFail(keyStringOrObject)}`;
  }

  /**
   * Calculates the distance in semitones between one key and another.
   * @param {Key | string} oneKey the key
   * @param {Key | string} otherKey the other key
   * @return {number} the distance in semitones
   */
  static distance(oneKey: Key | string, otherKey: Key | string): number {
    return this.wrapOrFail(oneKey).distanceTo(otherKey);
  }

  distanceTo(otherKey: Key | string): number {
    const otherKeyObj = Key.wrapOrFail(otherKey);
    let key = this.useModifier(otherKeyObj.modifier);
    let delta = 0;

    while (!key.equals(otherKeyObj) && delta < 20) {
      key = key.transposeUp().useModifier(otherKeyObj.modifier);
      delta += 1;
    }

    return delta;
  }

  constructor(
    { note, modifier = null, minor = false }:
      { note: Note | string | number, modifier?: Modifier | null, minor?: boolean },
  ) {
    this.note = (note instanceof Note) ? note : Note.parse(note);
    this.modifier = modifier || null;
    this.minor = minor || false;

    if (this.minor) this.note.minor = true;
  }

  isMinor(): boolean {
    return this.minor || this.note.isMinor();
  }

  clone(): Key {
    return this.set({});
  }

  toChordSymbol(key: Key): Key {
    if (this.is(SYMBOL)) return this.clone();

    const transposeDistance = this.note.getTransposeDistance(key.minor) + modifierTransposition(this.modifier);

    return key.transpose(transposeDistance).normalize().useModifier(key.modifier);
  }

  toChordSymbolString(key: Key): string {
    return this.toChordSymbol(key).toString();
  }

  is(type: ChordType): boolean {
    return this.note.is(type);
  }

  isNumeric(): boolean {
    return this.is(NUMERIC);
  }

  isChordSymbol(): boolean {
    return this.is(SYMBOL);
  }

  isNumeral(): boolean {
    return this.is(NUMERAL);
  }

  equals(otherKey: Key): boolean {
    return this.note.equals(otherKey.note) && this.modifier === otherKey.modifier;
  }

  toNumeric(key: Key | null = null): Key {
    if (this.isNumeric()) return this.clone();

    if (this.isNumeral()) return this.set({ note: this.note.toNumeric() });

    if (!key) throw new Error('key is required');

    return this.transposeNoteUpToKey(1, key);
  }

  toNumericString(key: Key | null = null): string {
    return this.toNumeric(key).toString();
  }

  toNumeral(key: Key | null = null): Key {
    if (this.isNumeral()) return this.clone();

    if (this.isNumeric()) return this.set({ note: this.note.toNumeral() });

    if (key) return this.transposeNoteUpToKey('I', key);

    return this.clone();
  }

  toNumeralString(key: Key | null = null): string {
    return this.toNumeral(key).toString();
  }

  toString({ showMinor = true, useUnicodeModifier = false } = {}): string {
    switch (this.note.type) {
      case SYMBOL:
        return this.formatChordSymbolString(showMinor, useUnicodeModifier);
      case NUMERIC:
        return this.formatNumericString(showMinor);
      case NUMERAL:
        return this.formatNumeralString();
      default:
        throw new Error(`Unexpected note type ${this.note.type}`);
    }
  }

  private formatChordSymbolString(showMinor: boolean, unicodeModifier: boolean): string {
    const modifier = unicodeModifier ? this.unicodeModifier : this.modifier;
    return `${this.note}${modifier || ''}${this.minor && showMinor ? 'm' : ''}`;
  }

  private formatNumericString(showMinor: boolean): string {
    return `${this.modifier || ''}${this.note}${this.minor && showMinor ? 'm' : ''}`;
  }

  private formatNumeralString(): string {
    return `${this.modifier || ''}${this.note}`;
  }

  transpose(delta: number): Key {
    if (delta === 0) return this;

    const originalModifier = this.modifier;
    let transposedKey = this.clone();
    const func = (delta < 0) ? 'transposeDown' : 'transposeUp';

    for (let i = 0, count = Math.abs(delta); i < count; i += 1) {
      transposedKey = transposedKey[func]();
    }

    return transposedKey.useModifier(originalModifier);
  }

  transposeUp(): Key {
    if (this.modifier === FLAT) return this.set({ modifier: null });

    if (this.note.isOneOf(3, 7, 'E', 'B')) return this.set({ note: this.note.up() });

    if (this.modifier === SHARP) return this.set({ note: this.note.up(), modifier: null });

    return this.set({ modifier: SHARP });
  }

  transposeDown(): Key {
    if (this.modifier === SHARP) return this.set({ modifier: null });

    if (this.note.isOneOf(1, 4, 'C', 'F')) {
      return this.set({ note: this.note.down() });
    }

    if (this.modifier === FLAT) return this.set({ note: this.note.down(), modifier: null });

    return this.set({ modifier: FLAT });
  }

  useModifier(newModifier: Modifier | null): Key {
    if (this.modifier === FLAT && newModifier === SHARP) {
      return this.set({ note: this.note.down(), modifier: SHARP });
    }

    if (this.modifier === SHARP && newModifier === FLAT) {
      return this.set({ note: this.note.up(), modifier: FLAT });
    }

    return this.clone();
  }

  normalize(): Key {
    if (this.modifier === SHARP && this.note.isOneOf(3, 7, 'E', 'B')) {
      return this.set({ note: this.note.up(), modifier: null });
    }

    if (this.modifier === FLAT && this.note.isOneOf(1, 4, 'C', 'F')) {
      return this.set({ note: this.note.down(), modifier: null });
    }

    return this.clone();
  }

  removeMinor(): Key {
    return this.set({ minor: false });
  }

  normalizeEnharmonics(key: Key | string | null): Key {
    if (key) {
      const rootKeyString = Key.wrapOrFail(key).toString({ showMinor: true });
      const enharmonics = ENHARMONIC_MAPPING[rootKeyString];
      const thisKeyString = this.toString({ showMinor: false });

      if (enharmonics && enharmonics[thisKeyString]) {
        return Key.parseOrFail(enharmonics[thisKeyString]);
      }
    }

    return this.clone();
  }

  private set(attributes: KeyProperties): Key {
    return new Key({
      note: this.note.clone(),
      modifier: this.modifier,
      minor: this.minor,
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
