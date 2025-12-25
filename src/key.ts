import ENHARMONIC_MAPPING from './normalize_mappings/enharmonic-normalize';

import {
  Accidental,
  AccidentalMaybe,
  ChordType,
  FLAT,
  MAJOR,
  MINOR,
  NO_ACCIDENTAL,
  NUMERAL,
  NUMERIC,
  ROMAN_NUMERALS,
  SHARP,
  SOLFEGE,
  SYMBOL,
} from './constants';

import { KEY_TO_GRADE } from './scales';
import { gradeToKey } from './utilities';

const regexes: Record<ChordType, RegExp> = {
  symbol: /^(?<key>((?<note>[A-Ga-g])(?<accidental>#|b)?))(?<minor>m)?$/,
  solfege: /^(?<key>((?<note>Do|Re|Mi|Fa|Sol|La|Si|do|re|mi|fa|sol|la|si)(?<accidental>#|b)?))(?<minor>m)?$/,
  numeric: /^(?<key>(?<accidental>#|b)?(?<note>[1-7]))(?<minor>m)?$/,
  numeral: /^(?<key>(?<accidental>#|b)?(?<note>I{1,3}|IV|VI{0,2}|i{1,3}|iv|vi{0,2}))$/,
};

interface KeyProperties {
  grade?: number | null;
  number?: number | null;
  type?: ChordType;
  minor?: boolean;
  accidental?: Accidental | null;
  referenceKeyGrade?: number | null;
  preferredAccidental?: Accidental | null,
}

const KEY_TYPES: ChordType[] = [SYMBOL, SOLFEGE, NUMERIC, NUMERAL];
const NATURAL_MINORS = [1, 2, 3, 4, 5, 8, 9, 10];
const NO_FLAT_GRADES = [4, 11];
const NO_FLAT_NUMBERS = [1, 4];
const NO_SHARP_GRADES = [5, 0];
const NO_SHARP_NUMBERS = [3, 7];

interface ConstructorOptions {
  grade?: number | null;
  number?: number | null;
  minor: boolean;
  type: ChordType;
  accidental: Accidental | null;
  referenceKeyGrade?: number | null;
  originalKeyString?: string | null;
  preferredAccidental: Accidental | null;
}

/**
 * Represents a key, such as Eb (symbol), #3 (numeric) or VII (numeral).
 *
 * The only function considered public API is `Key.distance`
 */
class Key implements KeyProperties {
  grade: number | null;

  number: number | null = null;

  accidental: Accidental | null;

  type: ChordType;

  get unicodeAccidental(): string | null {
    switch (this.accidental) {
      case FLAT:
        return '\u266d';
      case SHARP:
        return '\u266f';
      default:
        return null;
    }
  }

  /** @deprecated Use unicodeAccidental instead */
  get unicodeModifier(): string | null { return this.unicodeAccidental; }

  /** @deprecated Use accidental instead */
  get modifier(): Accidental | null { return this.accidental; }

  /** @deprecated Use preferredAccidental instead */
  get preferredModifier(): Accidental | null { return this.preferredAccidental; }

  minor = false;

  referenceKeyGrade: number | null = null;

  originalKeyString: string | null = null;

  preferredAccidental: Accidental | null;

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

    const { minor, note, accidental } = match.groups as { minor?: string, note: string, accidental?: Accidental };

    return this.resolve({
      key: note,
      keyType,
      minor: minor || false,
      accidental: accidental || null,
    });
  }

  /* eslint-disable-next-line max-lines-per-function */
  static resolve(
    {
      key,
      keyType,
      minor,
      accidental,
    }: {
      key: string | number,
      keyType: ChordType,
      minor: string | boolean,
      accidental: Accidental | null,
    },
  ): Key | null {
    const keyString = `${key}`;
    const isMinor = this.isMinor(keyString, keyType, minor);

    if (keyType === SYMBOL || keyType === SOLFEGE) {
      const grade = this.toGrade(keyString, accidental || NO_ACCIDENTAL, keyType, isMinor);

      if (grade !== null) {
        return new Key({
          grade: 0,
          minor: isMinor,
          type: keyType,
          accidental: accidental || null,
          preferredAccidental: accidental || null,
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
      accidental: accidental || null,
      preferredAccidental: accidental || null,
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

  static keyWithAccidental(key: string, accidental: Accidental | null, type: ChordType): string {
    const normalizedKey = key.toUpperCase();
    const accidentalString = accidental || '';

    if (type === SOLFEGE) {
      return `${key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}${accidentalString}`;
    }

    if (type === SYMBOL) {
      return `${normalizedKey}${accidentalString}`;
    }

    return `${accidentalString}${normalizedKey}`;
  }

  /** @deprecated Use keyWithAccidental instead */
  static keyWithModifier(key: string, accidental: Accidental | null, type: ChordType): string {
    return this.keyWithAccidental(key, accidental, type);
  }

  static toGrade(key: string, accidental: AccidentalMaybe, type: ChordType, isMinor: boolean): number | null {
    const mode = (isMinor ? MINOR : MAJOR);
    const grades = KEY_TO_GRADE[type][mode][accidental];

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
      accidental,
      referenceKeyGrade = null,
      originalKeyString = null,
      preferredAccidental = null,
    }: ConstructorOptions,
  ) {
    this.grade = grade;
    this.number = number;
    this.minor = minor;
    this.type = type;
    this.accidental = accidental;
    this.preferredAccidental = preferredAccidental;
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
      this.accidental || NO_ACCIDENTAL,
      NUMERIC,
      this.isMinor(),
    );

    this.number = null;
  }

  toChordSymbol(key: Key | string): Key {
    if (this.isChordSymbol()) return this.clone();

    const { accidental } = this;

    this.ensureGrade();

    const keyObj = Key.wrapOrFail(key);
    const chordSymbol = this.set({
      referenceKeyGrade: Key.shiftGrade(this.effectiveGrade + keyObj.effectiveGrade),
      grade: 0,
      type: SYMBOL,
      accidental: null,
      preferredAccidental: accidental || keyObj.accidental,
    });

    const normalized = chordSymbol.normalizeEnharmonics(keyObj);
    return accidental ? normalized.set({ preferredAccidental: accidental, accidental: null }) : normalized;
  }

  toChordSolfege(key: Key | string): Key {
    if (this.isChordSolfege()) return this.clone();

    const { accidental } = this;

    this.ensureGrade();

    const keyObj = Key.wrapOrFail(key);
    const chordSolfege = this.set({
      referenceKeyGrade: Key.shiftGrade(this.effectiveGrade + keyObj.effectiveGrade),
      grade: 0,
      type: SOLFEGE,
      accidental: null,
      preferredAccidental: accidental || keyObj.accidental,
    });

    const normalized = chordSolfege.normalizeEnharmonics(keyObj);
    return accidental ? normalized.set({ preferredAccidental: accidental, accidental: null }) : normalized;
  }

  toChordSymbolString(key: Key): string {
    return this.toChordSymbol(key).toString();
  }

  toChordSolfegeString(key: Key): string {
    return this.toChordSolfege(key).toString();
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

  isChordSolfege(): boolean {
    return this.is(SOLFEGE);
  }

  isNumeral(): boolean {
    return this.is(NUMERAL);
  }

  equals(otherKey: Key): boolean {
    return this.grade === otherKey.grade &&
      this.number === otherKey.number &&
      this.accidental === otherKey.accidental &&
      this.preferredAccidental === otherKey.preferredAccidental &&
      this.type === otherKey.type &&
      this.minor === otherKey.minor;
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
      accidental: null,
      preferredAccidental: referenceKey.accidental,
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
      accidental: null,
      preferredAccidental: referenceKey.accidental || this.accidental,
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

    if ((this.isChordSymbol() || this.isChordSolfege()) && this.referenceKeyGrade === null) {
      throw new Error('Not possible, reference key grade is null');
    }

    return gradeToKey({
      type: this.type,
      accidental: this.accidental,
      preferredAccidental: this.preferredAccidental,
      grade: this.effectiveGrade,
      minor: this.minor,
    });
  }

  private getNoteForNumber() {
    if (this.number === null) throw new Error('Not possible, grade and number are null');

    if (this.isNumeric()) {
      return `${this.accidental || ''}${this.number}`;
    }

    const numeral = ROMAN_NUMERALS[this.number - 1];
    return `${this.accidental || ''}${this.isMinor() ? numeral.toLowerCase() : numeral}`;
  }

  get minorSign() {
    if (!this.minor) return '';

    switch (this.type) {
      case SYMBOL:
        return 'm';
      case SOLFEGE:
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

    const originalAccidental = this.accidental;
    let transposedKey = this.clone();
    const func = (delta < 0) ? 'transposeDown' : 'transposeUp';

    for (let i = 0, count = Math.abs(delta); i < count; i += 1) {
      transposedKey = transposedKey[func]();
    }

    return transposedKey.useAccidental(originalAccidental);
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

    if (this.accidental || !key.canBeSharp()) {
      key = key.useAccidental(null);
    } else if (key.canBeSharp()) {
      key = key.useAccidental(SHARP);
    }

    key = key.set({ preferredAccidental: SHARP }).normalize();
    return key;
  }

  transposeDown(): Key {
    const normalizedKey = this.normalize();
    let key: Key = normalizedKey.changeGrade(-1);

    if (this.accidental || !key.canBeFlat()) {
      key = key.useAccidental(null);
    } else if (key.canBeFlat()) {
      key = key.useAccidental(FLAT);
    }

    return key.set({ preferredAccidental: FLAT });
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

  useAccidental(newAccidental: Accidental | null): Key {
    this.ensureGrade();
    return this.set({ accidental: newAccidental });
  }

  /** @deprecated Use useAccidental instead */
  useModifier(newAccidental: Accidental | null): Key { return this.useAccidental(newAccidental); }

  normalize(): Key {
    this.ensureGrade();

    if (this.accidental === SHARP && !this.canBeSharp()) {
      return this.set({ accidental: null });
    }

    if (this.accidental === FLAT && !this.canBeFlat()) {
      return this.set({ accidental: null });
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

  private set(attributes: KeyProperties, overwrite = true): Key {
    return new Key({
      ...(overwrite ? {} : attributes),
      grade: this.grade,
      number: this.number,
      type: this.type,
      accidental: this.accidental,
      minor: this.minor,
      referenceKeyGrade: this.referenceKeyGrade,
      originalKeyString: this.originalKeyString,
      preferredAccidental: this.preferredAccidental,
      ...(overwrite ? attributes : {}),
    });
  }
}

export default Key;
