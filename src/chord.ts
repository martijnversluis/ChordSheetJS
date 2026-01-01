import ChordParsingError from './chord_parsing_error';
import Key from './key';
import { parse } from './parser/chord/peg_parser';
import { deprecate, isMinor, normalizeChordSuffix } from './utilities';

import {
  Accidental,
  ChordType,
  NUMERAL,
  NUMERIC,
  SOLFEGE,
  SYMBOL,
} from './constants';

interface ChordProperties {
  root?: Key | null;
  suffix?: string | null;
  quality?: string | null;
  extensions?: string | null;
  bass?: Key | null;
  optional?: boolean;
}

export interface ChordConstructorOptions {
  base?: string | number | null;
  accidental?: Accidental | null;
  suffix?: string | null;
  quality?: string | null;
  extensions?: string | null;
  bassBase?: string | number | null;
  bassAccidental?: Accidental | null;
  root?: Key | null;
  bass?: Key | null;
  chordType?: ChordType | null;
  optional?: boolean;
}

/**
 * Represents a Chord, consisting of a root, suffix (quality) and bass
 */
class Chord implements ChordProperties {
  bass: Key | null;

  root: Key | null;

  private _suffix: string | null;

  private _quality: string | null;

  private _extensions: string | null;

  get suffix(): string | null {
    if (this._quality !== null || this._extensions !== null) {
      return (this._quality || '') + (this._extensions || '');
    }
    return this._suffix;
  }

  get quality(): string | null {
    return this._quality;
  }

  get extensions(): string | null {
    return this._extensions;
  }

  optional: boolean;

  /**
   * Tries to parse a chord string into a chord
   * Any leading or trailing whitespace is removed first, so a chord like `  \n  E/G# \r ` is valid.
   * @param chordString the chord string, eg `Esus4/G#` or `1sus4/#3`.
   * @returns {Chord|null}
   */
  static parse(chordString: string): Chord | null {
    try {
      return this.parseOrFail(chordString);
    } catch (_error) {
      return null;
    }
  }

  static parseOrFail(chordString: string): Chord {
    const trimmedChord = chordString.trim();

    try {
      const ast = parse(trimmedChord);
      return new Chord(ast);
    } catch (error) {
      const errorObj = error as Error;
      throw new ChordParsingError(`Failed parsing '${trimmedChord}': ${errorObj.message}`);
    }
  }

  /**
   * Returns a deep copy of the chord
   * @returns {Chord}
   */
  clone(): Chord {
    return this.set({});
  }

  /**
   * Converts the chord to a chord symbol, using the supplied key as a reference.
   * For example, a numeric chord `#4` with reference key `E` will return the chord symbol `A#`.
   * When the chord is already a chord symbol, it will return a clone of the object.
   * @param {Key|string|null} [referenceKey=null] the reference key. The key is required when converting a
   * numeric or numeral.
   * @returns {Chord} the chord symbol
   */
  toChordSymbol(referenceKey: Key | string | null = null): Chord {
    if (this.isChordSymbol()) return this.clone();

    const { keyObj, referenceIsMinor } = this.prepareKeyForConversion(referenceKey);

    const chordSymbolChord = new Chord({
      suffix: this.normalizedSuffix,
      root: this.root?.toChordSymbol(keyObj, referenceIsMinor) || null,
      bass: this.bass?.toChordSymbol(keyObj, referenceIsMinor) || null,
      optional: this.optional,
    });

    return this.finalizeConvertedChord(chordSymbolChord, keyObj);
  }

  /**
   * Converts the chord to a chord symbol string, using the supplied key as a reference.
   * For example, a numeric chord `#4` with reference key `E` will return the chord symbol `A#`.
   * When the chord is already a chord symbol, it will return a string version of the chord.
   * @param {Key|string|null} [referenceKey=null] the reference key. The key is required when converting a
   * numeric or numeral.
   * @returns {string} the chord symbol string
   * @see {toChordSymbol}
   */
  toChordSymbolString(referenceKey: Key | string | null = null): string {
    return this.toChordSymbol(referenceKey).toString();
  }

  /**
   * Determines whether the chord is a chord symbol
   * @returns {boolean}
   */
  isChordSymbol(): boolean {
    return this.is(SYMBOL);
  }

  /**
   * Converts the chord to a chord solfege, using the supplied key as a reference.
   * For example, a numeric chord `#4` with reference key `Mi` will return the chord symbol `La#`.
   * When the chord is already a chord solfege, it will return a clone of the object.
   * @param {Key|string|null} [referenceKey=null] the reference key. The key is required when converting a
   * numeric or numeral.
   * @returns {Chord} the chord solfege
   */
  toChordSolfege(referenceKey: Key | string | null = null): Chord {
    if (this.isChordSolfege()) return this.clone();

    const { keyObj } = this.prepareKeyForConversion(referenceKey);

    const chordSolfegeChord = new Chord({
      suffix: this.normalizedSuffix,
      root: this.root?.toChordSolfege(keyObj) || null,
      bass: this.bass?.toChordSolfege(keyObj) || null,
      optional: this.optional,
    });

    return this.finalizeConvertedChord(chordSolfegeChord, referenceKey);
  }

  /**
   * Converts the chord to a chord solfege string, using the supplied key as a reference.
   * For example, a numeric chord `#4` with reference key `E` will return the chord solfege `A#`.
   * When the chord is already a chord solfege, it will return a string version of the chord.
   * @param {Key|string|null} [referenceKey=null] the reference key. The key is required when converting a
   * numeric or numeral.
   * @returns {string} the chord solfege string
   * @see {toChordSolfege}
   */
  toChordSolfegeString(referenceKey: Key | string | null = null): string {
    return this.toChordSolfege(referenceKey).toString();
  }

  /**
   * Determines whether the chord is a chord solfege
   * @returns {boolean}
   */
  isChordSolfege(): boolean {
    return this.is(SOLFEGE);
  }

  /**
   * Converts the chord to a numeric chord, using the supplied key as a reference.
   * For example, a chord symbol A# with reference key E will return the numeric chord #4.
   * @param {Key|string|null} [referenceKey=null] the reference key. The key is required when converting a chord symbol
   * @returns {Chord} the numeric chord
   */
  toNumeric(referenceKey: Key | string | null = null): Chord {
    if (this.isNumeric()) {
      return this.clone();
    }

    if (this.isNumeral()) {
      return this.transform((key) => key.toNumeric());
    }

    let keyObj: Key | null = Key.wrap(referenceKey);

    if (keyObj && keyObj.isMinor()) {
      keyObj = keyObj.relativeMajor;
    }

    return new Chord({
      suffix: normalizeChordSuffix(this.suffix),
      root: this.root?.toNumeric(keyObj) || null,
      bass: this.bass?.toNumeric(keyObj) || null,
      ...(this.optional ? { optional: true } : {}),
    });
  }

  /**
   * Converts the chord to a numeral chord, using the supplied key as a reference.
   * For example, a chord symbol A# with reference key E will return the numeral chord #IV.
   * @param {Key|string|null} [referenceKey=null] the reference key. The key is required when converting a chord symbol
   * @returns {Chord} the numeral chord
   */
  toNumeral(referenceKey: Key | string | null = null): Chord {
    if (this.isNumeral()) {
      return this.clone();
    }

    if (this.isNumeric()) {
      return this.transform((key) => key.toNumeral());
    }

    let keyObj: Key | null = Key.wrap(referenceKey);

    if (keyObj && keyObj.isMinor()) {
      keyObj = keyObj.relativeMajor;
    }

    return new Chord({
      suffix: normalizeChordSuffix(this.suffix),
      root: (keyObj && this.root) ? this.root.toNumeral(keyObj) : null,
      bass: this.bass?.toNumeral(keyObj) || null,
      ...(this.optional ? { optional: true } : {}),
    });
  }

  /**
   * Converts the chord to a numeral chord string, using the supplied kye as a reference.
   * For example, a chord symbol A# with reference key E will return the numeral chord #4.
   * @param {Key|string|null} [referenceKey=null] the reference key. The key is required when converting a chord symbol
   * @returns {string} the numeral chord string
   * @see {toNumeral}
   */
  toNumeralString(referenceKey: Key | string | null = null): string {
    return this.toNumeral(referenceKey).toString();
  }

  /**
   * Determines whether the chord is numeric
   * @returns {boolean}
   */
  isNumeric(): boolean {
    return this.is(NUMERIC);
  }

  /**
   * Converts the chord to a numeric chord string, using the supplied kye as a reference.
   * For example, a chord symbol A# with reference key E will return the numeric chord #4.
   * @param {Key|string|null} [referenceKey=null] the reference key. The key is required when converting a chord symbol
   * @returns {string} the numeric chord string
   * @see {toNumeric}
   */
  toNumericString(referenceKey: Key | string | null = null): string {
    return this.toNumeric(referenceKey).toString();
  }

  /**
   * Determines whether the chord is a numeral
   * @returns {boolean}
   */
  isNumeral(): boolean {
    return this.is(NUMERAL);
  }

  /**
   * Converts the chord to a string, eg `Esus4/G#` or `1sus4/#3`
   * @param {Object} [configuration={}] options
   * @param {boolean} [configuration.useUnicodeModifier=false] Whether or not to use unicode modifiers.
   * This will make `#` (sharp) look like `♯` and `b` (flat) look like `♭`
   * @returns {string} the chord string
   */
  toString({ useUnicodeModifier = false } = {}): string {
    let chordString = '';
    const suffix = this.suffix || '';
    const showMinor = suffix[0] !== 'm';

    if (this.root) chordString = this.root.toString({ showMinor, useUnicodeModifier }) + suffix;
    if (this.bass) chordString = `${chordString}/${this.bass.toString({ useUnicodeModifier })}`;

    // Wrap in parentheses if optional
    if (this.optional) {
      chordString = `(${chordString})`;
    }

    return chordString;
  }

  /**
   * Normalizes the chord root and bass notes:
   * - Fab becomes Mi
   * - Dob becomes Si
   * - Si# becomes Do
   * - Mi# becomes Fa
   * - Fb becomes E
   * - Cb becomes B
   * - B# becomes C
   * - E# becomes F
   * - 4b becomes 3
   * - 1b becomes 7
   * - 7# becomes 1
   * - 3# becomes 4
   *
   * Besides that it normalizes the suffix if `normalizeSuffix` is `true`.
   * For example, `sus2` becomes `2`, `sus4` becomes `sus`.
   * All suffix normalizations can be found in `src/normalize_mappings/suffix-mapping.txt`.
   *
   * When the chord is minor, bass notes are normalized off of the relative major
   * of the root note. For example, `Em/A#` becomes `Em/Bb`.
   * @param {Key|string} [key=null] the key to normalize to
   * @param {Object} [options={}] options
   * @param {boolean} [options.normalizeSuffix=true] whether to normalize the chord suffix after transposing
   * @returns {Chord} the normalized chord
   */
  normalize(key: Key | string | null = null, { normalizeSuffix = true }: { normalizeSuffix?: boolean; } = {}): Chord {
    const suffix = normalizeSuffix ? normalizeChordSuffix(this.suffix) : this.suffix;
    let normalizedRoot = this.root;

    if (this.root) {
      normalizedRoot = this.root.normalize();
      if (key) normalizedRoot = normalizedRoot.normalizeEnharmonics(key);
    }

    return this.set({
      suffix,
      root: normalizedRoot,
      bass: this.bass ? this.bass.normalize().normalizeEnharmonics(normalizedRoot) : null,
    });
  }

  /**
   * Switches to the specified accidental
   * @param newAccidental the accidental to use: `'#'` or `'b'`
   * @returns {Chord} the new, changed chord
   */
  useAccidental(newAccidental: Accidental): Chord {
    return this.transform((key) => key.useAccidental(newAccidental));
  }

  /**
   * @deprecated Use useAccidental instead
   */
  useModifier(newAccidental: Accidental): Chord {
    deprecate('useModifier is deprecated, use useAccidental instead');
    return this.useAccidental(newAccidental);
  }

  /**
   * Transposes the chord up by 1 semitone. Eg. A becomes A#, Eb becomes E
   * @returns {Chord} the new, transposed chord
   */
  transposeUp(): Chord {
    return this.transform((key) => key.transposeUp());
  }

  /**
   * Transposes the chord down by 1 semitone. Eg. A# becomes A, E becomes Eb
   * @returns {Chord} the new, transposed chord
   */
  transposeDown(): Chord {
    return this.transform((key) => key.transposeDown());
  }

  /**
   * Transposes the chord by the specified number of semitones
   * @param delta de number of semitones
   * @returns {Chord} the new, transposed chord
   */
  transpose(delta: number): Chord {
    return this.transform((key) => key.transpose(delta));
  }

  constructor(options: ChordConstructorOptions) {
    this._quality = options.quality ?? null;
    this._extensions = options.extensions ?? null;
    this._suffix = options.suffix ?? null;
    this.optional = options.optional ?? false;

    this.root = Chord.determineRoot({ ...options, suffix: this.suffix });
    this.bass = Chord.determineBass(options);
  }

  equals(otherChord: Chord): boolean {
    return this.suffix === otherChord.suffix &&
      this.optional === otherChord.optional &&
      Key.equals(this.root, otherChord.root) &&
      Key.equals(this.bass, otherChord.bass);
  }

  static determineRoot(options: ChordConstructorOptions & { suffix?: string | null }): Key | null {
    const {
      root, base, accidental, suffix, chordType,
    } = options;
    if (root) return root;
    if (!base) return null;
    if (!chordType) throw new Error('Can\'t resolve at this point without a chord type');

    return Key.resolve({
      key: base,
      keyType: chordType,
      minor: isMinor(base, chordType, suffix ?? null),
      accidental: accidental ?? null,
    });
  }

  static determineBass(options: ChordConstructorOptions): Key | null {
    const {
      bass, bassBase, bassAccidental, chordType,
    } = options;
    if (bass) return bass;
    if (!bassBase) return null;
    if (!chordType) throw new Error('Can\'t resolve at this point without a chord type');

    return Key.resolve({
      key: bassBase,
      accidental: bassAccidental ?? null,
      minor: false,
      keyType: chordType,
    });
  }

  isMinor(): boolean {
    return this.root?.isMinor() || false;
  }

  makeMinor(): Chord {
    return this.set({
      root: this.root?.makeMinor() || null,
    });
  }

  set(properties: ChordProperties): Chord {
    const suffixProps = this.determineSuffixProps(properties);

    return new Chord(
      {
        root: this.root?.clone() || null,
        ...suffixProps,
        bass: this.bass?.clone() || null,
        ...(this.optional ? { optional: true } : {}),
        ...properties,
      },
    );
  }

  private determineSuffixProps(
    properties: ChordProperties,
  ): { suffix?: string | null; quality?: string | null; extensions?: string | null } {
    if ('suffix' in properties) {
      return { suffix: properties.suffix, quality: null, extensions: null };
    }

    if ('quality' in properties || 'extensions' in properties) {
      return {
        quality: properties.quality ?? this._quality,
        extensions: properties.extensions ?? this._extensions,
      };
    }

    if (this._quality !== null || this._extensions !== null) {
      return { quality: this._quality, extensions: this._extensions };
    }

    return { suffix: this._suffix };
  }

  private is(type: ChordType): boolean {
    return (!this.root || this.root.is(type)) && (!this.bass || this.bass.is(type));
  }

  private transform(transformFunc: (_key: Key) => Key): Chord {
    return this.set({
      root: this.root ? transformFunc(this.root) : null,
      bass: this.bass ? transformFunc(this.bass) : null,
    });
  }

  private get normalizedSuffix(): string | null {
    return this.suffix ? normalizeChordSuffix(this.suffix) : null;
  }

  private prepareKeyForConversion(
    referenceKey: Key | string | null,
  ): { keyObj: Key | null; referenceIsMinor: boolean } {
    const wrappedKey = Key.wrap(referenceKey);
    const referenceIsMinor = wrappedKey?.isMinor() || false;
    const keyObj = referenceIsMinor ? wrappedKey?.relativeMajor || null : wrappedKey;
    return { keyObj, referenceIsMinor };
  }

  private finalizeConvertedChord(chord: Chord, normalizeKey: Key | string | null): Chord {
    let result = chord;
    if (this.root?.isMinor()) result = result.makeMinor();
    return result.normalize(normalizeKey);
  }
}

export default Chord;
