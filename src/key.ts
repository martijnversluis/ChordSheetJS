import {
  ChordType,
  FLAT,
  MAJOR,
  MINOR,
  Modifier,
  ModifierMaybe,
  NO_MODIFIER,
  NUMERAL,
  NUMERIC,
  ROMAN_NUMERALS,
  SHARP,
  SYMBOL,
} from './constants';

import { KEY_TO_GRADE } from './scales';
import ENHARMONIC_MAPPING from './normalize_mappings/enharmonic-normalize';
import { gradeToKey } from './utilities';

const regexes: Record<ChordType, RegExp> = {
  symbol: /^(?<key>((?<note>[A-G])(?<modifier>#|b)?))(?<minor>m)?$/i,
  numeric: /^(?<key>(?<modifier>#|b)?(?<note>[1-7]))(?<minor>m)?$/,
  numeral: /^(?<key>(?<modifier>#|b)?(?<note>I{1,3}|IV|VI{0,2}|i{1,3}|iv|vi{0,2}))$/,
};

interface KeyProperties {
  grade?: number | null;
  number?: number | null;
  type?: ChordType;
  minor?: boolean;
  modifier?: Modifier | null;
  referenceKeyGrade?: number | null;
  preferredModifier?: Modifier | null,
}

const KEY_TYPES: ChordType[] = [SYMBOL, NUMERIC, NUMERAL];
const NATURAL_MINORS = [1, 2, 3, 4, 5, 8, 9, 10];
const NO_FLAT_GRADES = [4, 11];
const NO_FLAT_NUMBERS = [1, 4];
const NO_SHARP_GRADES = [5, 0];
const NO_SHARP_NUMBERS = [3, 7];

/**
 * Represents a key, such as Eb (symbol), #3 (numeric) or VII (numeral).
 *
 * The only function considered public API is `Key.distance`
 */
class Key implements KeyProperties {
  grade: number | null;

  number: number | null = null;

  modifier: Modifier | null;

  type: ChordType;

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

  referenceKeyGrade: number | null = null;

  originalKeyString: string | null = null;

  preferredModifier: Modifier | null;

  static parse(keyString: string | null): null | Key {
    if (!keyString) return null;

    const trimmed = keyString.trim();
    if (!trimmed) return null;

    for (let i = 0, count = KEY_TYPES.length; i < count; i += 1) {
      const resolvedKey = this.parseAsType(trimmed, KEY_TYPES[i]);

      if (resolvedKey) return resolvedKey;
    }

    return null;
  }

  static parseAsType(trimmed: string, keyType: ChordType) {
    const match = trimmed.match(regexes[keyType]);

    if (!match) return null;

    const { minor, note, modifier } = match.groups as { minor?: string, note: string, modifier?: Modifier };

    return this.resolve({
      key: note,
      keyType,
      minor: minor || false,
      modifier: modifier || null,
    });
  }

  static resolve(
    {
      key,
      keyType,
      minor,
      modifier,
    }: {
      key: string | number,
      keyType: ChordType,
      minor: string | boolean,
      modifier: Modifier | null,
    },
  ): Key | null {
    const keyString = `${key}`;
    const isMinor = this.isMinor(keyString, keyType, minor);

    if (keyType === SYMBOL) {
      const grade = this.toGrade(keyString, modifier || NO_MODIFIER, keyType, isMinor);

      if (grade !== null) {
        return new Key({
          grade: 0,
          minor: isMinor,
          type: keyType,
          modifier: modifier || null,
          preferredModifier: modifier || null,
          referenceKeyGrade: grade,
          originalKeyString: keyString,
        });
      }
    }

    const number = this.getNumberFromKey(keyString, keyType);

    return new Key({
      number,
      minor: isMinor,
      type: keyType,
      modifier: modifier || null,
      preferredModifier: modifier || null,
      originalKeyString: keyString,
    });
  }

  static getNumberFromKey(keyString: string, keyType: ChordType) {
    if (keyType === NUMERIC) {
      return parseInt(keyString, 10);
    }

    const uppercaseKey = keyString.toUpperCase();
    return ROMAN_NUMERALS.findIndex((numeral) => uppercaseKey === numeral) + 1;
  }

  static keyWithModifier(key: string, modifier: Modifier | null, type: ChordType): string {
    const normalizedKey = key.toUpperCase();
    const modifierString = modifier || '';

    if (type === SYMBOL) {
      return `${normalizedKey}${modifierString}`;
    }

    return `${modifierString}${normalizedKey}`;
  }

  static toGrade(key: string, modifier: ModifierMaybe, type: ChordType, isMinor: boolean): number | null {
    const mode = (isMinor ? MINOR : MAJOR);
    const grades = KEY_TO_GRADE[type][mode][modifier];

    if (key in grades) {
      return grades[key];
    }

    const upperCaseKey = key.toUpperCase();

    if (upperCaseKey in grades) {
      return grades[upperCaseKey];
    }

    return null;
  }

  static isMinor(key: string, keyType: ChordType, minor: string | undefined | boolean) {
    switch (keyType) {
      case 'numeral':
        return key.toLowerCase() === key;
      default:
        switch (typeof minor) {
          case 'string':
            return minor === 'm' || minor.toLowerCase() === 'min';
          case 'boolean':
            return minor;
          default:
            return false;
        }
    }
  }

  static parseOrFail(keyString: string | null): Key {
    const parsed = this.parse(keyString);

    if (!parsed) throw new Error(`Failed to parse ${keyString}`);

    return parsed;
  }

  static wrap(keyStringOrObject: Key | string | null): Key | null {
    if (keyStringOrObject instanceof Key) return keyStringOrObject;

    if (keyStringOrObject === null) return null;

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

  constructor(
    {
      grade = null,
      number = null,
      minor,
      type,
      modifier,
      referenceKeyGrade = null,
      originalKeyString = null,
      preferredModifier = null,
    }: {
      grade?: number | null,
      number?: number | null,
      minor: boolean,
      type: ChordType,
      modifier: Modifier | null,
      referenceKeyGrade?: number | null,
      originalKeyString?: string | null,
      preferredModifier: Modifier | null,
    },
  ) {
    this.grade = grade;
    this.number = number;
    this.minor = minor;
    this.type = type;
    this.modifier = modifier;
    this.preferredModifier = preferredModifier;
    this.referenceKeyGrade = referenceKeyGrade;
    this.originalKeyString = originalKeyString;
  }

  distanceTo(otherKey: Key | string): number {
    const otherKeyObj = Key.wrapOrFail(otherKey);
    return Key.shiftGrade(otherKeyObj.effectiveGrade - this.effectiveGrade);
  }

  get effectiveGrade(): number {
    if (this.grade === null) {
      throw new Error('Cannot calculate effectiveGrade without a grade');
    }

    return Key.shiftGrade(this.grade + (this.referenceKeyGrade || 0));
  }

  isMinor(): boolean {
    return this.minor;
  }

  makeMinor(): Key {
    return this.set({ minor: true });
  }

  get relativeMajor(): Key {
    return this.changeGrade(+3).set({ minor: false });
  }

  get relativeMinor(): Key {
    return this.changeGrade(-3).set({ minor: true });
  }

  toMajor(): Key {
    if (this.isMinor()) {
      return this.transpose(3).set({ minor: false });
    }

    return this.clone();
  }

  clone(): Key {
    return this.set({});
  }

  private ensureGrade() {
    if (this.grade === null) {
      this.calculateGradeFromNumber();
    }
  }

  private calculateGradeFromNumber() {
    if (this.number === null) {
      throw new Error('Cannot calculate grade, number is null');
    }

    this.grade = Key.toGrade(
      this.number.toString(),
      this.modifier || NO_MODIFIER,
      NUMERIC,
      this.isMinor(),
    );

    this.number = null;
  }

  toChordSymbol(key: Key | string): Key {
    if (this.isChordSymbol()) return this.clone();

    const { modifier } = this;

    this.ensureGrade();

    const keyObj = Key.wrapOrFail(key);
    const chordSymbol = this.set({
      referenceKeyGrade: Key.shiftGrade(this.effectiveGrade + keyObj.effectiveGrade),
      grade: 0,
      type: SYMBOL,
      modifier: null,
      preferredModifier: modifier || keyObj.modifier,
    });

    const normalized = chordSymbol.normalizeEnharmonics(keyObj);
    return modifier ? normalized.set({ preferredModifier: modifier, modifier: null }) : normalized;
  }

  toChordSymbolString(key: Key): string {
    return this.toChordSymbol(key).toString();
  }

  is(type: ChordType): boolean {
    return this.type === type;
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
    return this.grade === otherKey.grade
      && this.number === otherKey.number
      && this.modifier === otherKey.modifier
      && this.preferredModifier === otherKey.preferredModifier
      && this.type === otherKey.type
      && this.minor === otherKey.minor;
  }

  static equals(oneKey: Key | null, otherKey: Key | null) {
    if (oneKey === null) {
      return otherKey === null;
    }

    if (otherKey === null) {
      return false;
    }

    return oneKey.equals(otherKey);
  }

  toNumeric(key: Key | string | null = null): Key {
    if (this.isNumeric()) {
      return this.clone();
    }

    if (this.isNumeral()) {
      return this.set({ type: NUMERIC });
    }

    const referenceKey = Key.wrapOrFail(key);
    const referenceKeyGrade = referenceKey.effectiveGrade;

    return this.set({
      type: NUMERIC,
      grade: Key.shiftGrade(this.effectiveGrade - referenceKeyGrade),
      referenceKeyGrade: 0,
      modifier: null,
      preferredModifier: referenceKey.modifier,
    });
  }

  toNumericString(key: Key | null = null): string {
    return this.toNumeric(key).toString();
  }

  toNumeral(key: Key | string | null = null): Key {
    if (this.isNumeral()) {
      return this.clone();
    }

    if (this.isNumeric()) {
      return this.set({ type: NUMERAL });
    }

    const referenceKey = Key.wrapOrFail(key);
    const referenceKeyGrade = referenceKey.effectiveGrade;
    return this.set({
      type: NUMERAL,
      grade: Key.shiftGrade(this.effectiveGrade - referenceKeyGrade),
      referenceKeyGrade: 0,
      modifier: null,
      preferredModifier: referenceKey.modifier || this.modifier,
    });
  }

  toNumeralString(key: Key | null = null): string {
    return this.toNumeral(key).toString();
  }

  toString({ showMinor = true, useUnicodeModifier = false } = {}): string {
    let { note } = this;

    if (useUnicodeModifier) {
      note = note.replace('#', '\u266f').replace('b', '\u266d');
    }

    return `${note}${showMinor ? this.minorSign : ''}`;
  }

  get note(): string {
    if (this.grade === null) {
      return this.getNoteForNumber();
    }

    if (this.isChordSymbol() && this.referenceKeyGrade === null) {
      throw new Error('Not possible, reference key grade is null');
    }

    return gradeToKey({
      type: this.type,
      modifier: this.modifier,
      preferredModifier: this.preferredModifier,
      grade: this.effectiveGrade,
      minor: this.minor,
    });
  }

  private getNoteForNumber() {
    if (this.number === null) throw new Error('Not possible, grade and number are null');

    if (this.isNumeric()) {
      return `${this.modifier || ''}${this.number}`;
    }

    const numeral = ROMAN_NUMERALS[this.number - 1];
    return `${this.modifier || ''}${this.isMinor() ? numeral.toLowerCase() : numeral}`;
  }

  get minorSign() {
    if (!this.minor) return '';

    switch (this.type) {
      case SYMBOL:
        return 'm';
      case NUMERIC:
        return this.isNaturalMinor() ? '' : 'm';
      default:
        return '';
    }
  }

  private isNaturalMinor() {
    this.ensureGrade();

    if (!this.grade) {
      throw new Error('Expected grade to be set, but it is is still empty.');
    }

    return NATURAL_MINORS.includes(this.grade);
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

  changeGrade(delta) {
    if (this.referenceKeyGrade) {
      return this.set({ referenceKeyGrade: Key.shiftGrade(this.referenceKeyGrade + delta) });
    }

    this.ensureGrade();

    return this.set({ grade: Key.shiftGrade(this.grade + delta) });
  }

  transposeUp(): Key {
    const normalizedKey = this.normalize();
    let key: Key = normalizedKey.changeGrade(+1);

    if (this.modifier || !key.canBeSharp()) {
      key = key.useModifier(null);
    } else if (key.canBeSharp()) {
      key = key.useModifier(SHARP);
    }

    key = key.set({ preferredModifier: SHARP }).normalize();
    return key;
  }

  transposeDown(): Key {
    const normalizedKey = this.normalize();
    let key: Key = normalizedKey.changeGrade(-1);

    if (this.modifier || !key.canBeFlat()) {
      key = key.useModifier(null);
    } else if (key.canBeFlat()) {
      key = key.useModifier(FLAT);
    }

    return key.set({ preferredModifier: FLAT });
  }

  canBeFlat() {
    if (this.number !== null) {
      return !NO_FLAT_NUMBERS.includes(this.number);
    }

    return !NO_FLAT_GRADES.includes(this.effectiveGrade);
  }

  canBeSharp() {
    if (this.number !== null) {
      return !NO_SHARP_NUMBERS.includes(this.number);
    }

    return !NO_SHARP_GRADES.includes(this.effectiveGrade);
  }

  setGrade(newGrade: number): Key {
    return this.set({
      grade: Key.shiftGrade(newGrade),
    });
  }

  static shiftGrade(grade: number) {
    if (grade < 0) {
      return this.shiftGrade(grade + 12);
    }

    return grade % 12;
  }

  useModifier(newModifier: Modifier | null): Key {
    this.ensureGrade();
    return this.set({ modifier: newModifier });
  }

  normalize(): Key {
    this.ensureGrade();

    if (this.modifier === SHARP && !this.canBeSharp()) {
      return this.set({ modifier: null });
    }

    if (this.modifier === FLAT && !this.canBeFlat()) {
      return this.set({ modifier: null });
    }

    return this.clone();
  }

  normalizeEnharmonics(key: Key | string | null): Key {
    if (key) {
      const rootKeyString = Key.wrapOrFail(key).toString({ showMinor: true });
      const enharmonics = ENHARMONIC_MAPPING[rootKeyString];
      const thisKeyString = this.toString({ showMinor: false });

      if (enharmonics && enharmonics[thisKeyString]) {
        return Key
          .parseOrFail(enharmonics[thisKeyString])
          .set({ minor: this.minor });
      }
    }

    return this.clone();
  }

  private set(attributes: KeyProperties, overwrite: boolean = true): Key {
    return new Key({
      ...(overwrite ? {} : attributes),
      grade: this.grade,
      number: this.number,
      type: this.type,
      modifier: this.modifier,
      minor: this.minor,
      referenceKeyGrade: this.referenceKeyGrade,
      originalKeyString: this.originalKeyString,
      preferredModifier: this.preferredModifier,
      ...(overwrite ? attributes : {}),
    });
  }
}

export default Key;
