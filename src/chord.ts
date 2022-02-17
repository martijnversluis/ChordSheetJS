import Key from './key';
import SUFFIX_MAPPPING from './normalize_mappings/suffix-normalize-mapping';

import {
  NUMERAL,
  NUMERIC,
  ROMAN_NUMERALS,
  SYMBOL,
} from './constants';

import {
  deprecate,
  isBlank,
  parseWithRegexes,
  presence,
} from './utilities';

function normalizeChordSuffix(suffix) {
  if (SUFFIX_MAPPPING[suffix] === '[blank]') {
    return null;
  }

  return SUFFIX_MAPPPING[suffix] || suffix;
}

const chordRegex = (
  /^(?<base>[A-G])(?<modifier>#|b)?(?<suffix>[^/\s]*)(\/(?<bassBase>[A-G])(?<bassModifier>#|b)?)?$/i
);

const numericChordRegex = (
  /^(?<modifier>#|b)?(?<base>[1-7])(?<suffix>[^/\s]*)(\/(?<bassModifier>#|b)?(?<bassBase>[0-7]))?$/
);

const sortedNumerals = [...ROMAN_NUMERALS].sort((numeralA, numeralB) => numeralB.length - numeralA.length);

const numerals = [
  ...sortedNumerals,
  ...sortedNumerals.map((numeral) => numeral.toLowerCase()),
].join('|');

const numeralChordRegex = (
  // eslint-disable-next-line max-len
  new RegExp(`^(?<modifier>#|b)?(?<base>${numerals})(?<suffix>[^/\\s]*)(\\/(?<bassModifier>#|b)?(?<bassBase>${numerals}))?$`)
);

const regexes = [numericChordRegex, numeralChordRegex, chordRegex];

/**
 * Represents a Chord, consisting of a root, suffix (quality) and bass
 */
class Chord {
  root: Key;

  suffix?: string;

  bass?: Key;

  /**
   * Tries to parse a chord string into a chord
   * @param chordString the chord string, eg `Esus4/G#` or `1sus4/#3`
   * @returns {null|Chord}
   */
  static parse(chordString) {
    return parseWithRegexes(chordString, Chord, regexes);
  }

  /**
   * Returns a deep copy of the chord
   * @returns {Chord}
   */
  clone() {
    return this.set({});
  }

  /**
   * Converts the chord to a chord symbol, using the supplied key as a reference.
   * For example, a numeric chord `#4` with reference key `E` will return the chord symbol `A#`.
   * When the chord is already a chord symbol, it will return a clone of the object.
   * @param {Key|string} [key=null] the reference key
   * @returns {Chord} the chord symbol
   */
  toChordSymbol(key = null) {
    if (this.isChordSymbol()) {
      return this.clone();
    }

    const keyObj = Key.wrap(key);
    const rootKey = this.root.toChordSymbol(keyObj).normalizeEnharmonics(keyObj);

    let chordSymbolChord = new Chord({
      suffix: normalizeChordSuffix(this.suffix),
      root: rootKey,
      bass: this.bass?.toChordSymbol(keyObj).normalizeEnharmonics(rootKey),
    });

    if (this.root.isMinor()) {
      chordSymbolChord = chordSymbolChord.makeMinor();
    }

    return chordSymbolChord;
  }

  /**
   * Converts the chord to a chord symbol string, using the supplied key as a reference.
   * For example, a numeric chord `#4` with reference key `E` will return the chord symbol `A#`.
   * When the chord is already a chord symbol, it will return a string version of the chord.
   * @param {Key|string} [key=null] the reference key
   * @returns {string} the chord symbol string
   * @see {toChordSymbol}
   */
  toChordSymbolString(key = null) {
    return this.toChordSymbol(key).toString();
  }

  /**
   * Determines whether the chord is a chord symbol
   * @returns {boolean}
   */
  isChordSymbol() {
    return this.is(SYMBOL);
  }

  /**
   * Converts the chord to a numeric chord, using the supplied key as a reference.
   * For example, a chord symbol A# with reference key E will return the numeric chord #4.
   * @param {Key|string} [key=null] the reference key
   * @returns {Chord} the numeric chord
   */
  toNumeric(key = null) {
    if (this.isNumeric()) {
      return this.clone();
    }

    if (this.isNumeral()) {
      return this.set({
        root: this.root.toNumeric(),
        bass: this.bass?.toNumeric(),
      });
    }

    const keyObj = Key.wrap(key);

    return new Chord({
      suffix: normalizeChordSuffix(this.suffix),
      root: this.root.toNumeric(keyObj),
      bass: this.bass?.toNumeric(keyObj),
    });
  }

  /**
   * Converts the chord to a numeral chord, using the supplied key as a reference.
   * For example, a chord symbol A# with reference key E will return the numeral chord #IV.
   * @param {Key|string|null} key the reference key. The key is required when converting a chord symbol
   * @returns {Chord} the numeral chord
   */
  toNumeral(key = null) {
    if (this.isNumeral()) {
      return this.clone();
    }

    if (this.isNumeric()) {
      return this.set({
        root: this.root.toNumeral(),
        bass: this.bass?.toNumeral(),
      });
    }

    const keyObj = Key.wrap(key);

    return new Chord({
      suffix: normalizeChordSuffix(this.suffix),
      root: this.root.toNumeral(keyObj),
      bass: this.bass?.toNumeral(keyObj),
    });
  }

  /**
   * Converts the chord to a numeral chord string, using the supplied kye as a reference.
   * For example, a chord symbol A# with reference key E will return the numeral chord #4.
   * @param {Key|string} [key=null] the reference key
   * @returns {string} the numeral chord string
   * @see {toNumeral}
   */
  toNumeralString(key = null) {
    return this.toNumeral(key).toString();
  }

  /**
   * Determines whether the chord is numeric
   * @returns {boolean}
   */
  isNumeric() {
    return this.is(NUMERIC);
  }

  /**
   * Converts the chord to a numeric chord string, using the supplied kye as a reference.
   * For example, a chord symbol A# with reference key E will return the numeric chord #4.
   * @param {Key|string} [key=null] the reference key
   * @returns {string} the numeric chord string
   * @see {toNumeric}
   */
  toNumericString(key = null) {
    return this.toNumeric(key).toString();
  }

  /**
   * Determines whether the chord is a numeral
   * @returns {boolean}
   */
  isNumeral() {
    return this.is(NUMERAL);
  }

  /**
   * Converts the chord to a string, eg `Esus4/G#` or `1sus4/#3`
   * @returns {string} the chord string
   */
  toString() {
    const chordString = this.root.toString({ showMinor: false }) + (this.suffix || '');

    if (this.bass) {
      return `${chordString}/${this.bass.toString()}`;
    }

    return chordString;
  }

  /**
   * Normalizes the chord root and bass notes:
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
   * @param {Key|string} [key=null] the key to normalize to
   * @param {Object} [options={}] options
   * @param {boolean} [options.normalizeSuffix=true] whether to normalize the chord suffix after transposing
   * @returns {Chord} the normalized chord
   */
  normalize(key = null, { normalizeSuffix = true } = {}) {
    const suffix = normalizeSuffix ? normalizeChordSuffix(this.suffix) : this.suffix;

    if (isBlank(key)) {
      return this.process('normalize').set({ suffix });
    }

    return this.set({
      suffix,
      root: this.root.normalizeEnharmonics(key),
      bass: this.bass ? this.bass.normalizeEnharmonics(this.root.toString()) : null,
    });
  }

  /**
   * Switches to the specified modifier
   * @param newModifier the modifier to use: `'#'` or `'b'`
   * @returns {Chord} the new, changed chord
   */
  useModifier(newModifier) {
    return this.process('useModifier', newModifier);
  }

  /**
   * Transposes the chord up by 1 semitone. Eg. A becomes A#, Eb becomes E
   * @returns {Chord} the new, transposed chord
   */
  transposeUp() {
    return this.process('transposeUp');
  }

  /**
   * Transposes the chord down by 1 semitone. Eg. A# becomes A, E becomes Eb
   * @returns {Chord} the new, transposed chord
   */
  transposeDown() {
    return this.process('transposeDown');
  }

  /**
   * Transposes the chord by the specified number of semitones
   * @param delta de number of semitones
   * @returns {Chord} the new, transposed chord
   */
  transpose(delta) {
    return this.process('transpose', delta);
  }

  constructor(
    {
      base = null,
      modifier = null,
      suffix = null,
      bassBase = null,
      bassModifier = null,
      root = null,
      bass = null,
    },
  ) {
    this.suffix = presence(suffix);
    this.root = root || new Key({ note: base, modifier, minor: suffix === 'm' });

    if (bass) {
      this.bass = bass;
    } else if (bassBase) {
      this.bass = new Key({ note: bassBase, modifier: bassModifier, minor: suffix === 'm' });
    } else {
      this.bass = null;
    }
  }

  makeMinor() {
    if (!this.suffix || this.suffix[0] !== 'm') {
      return this.set({
        suffix: `m${this.suffix || ''}`,
      });
    }

    return this.clone();
  }

  set(properties) {
    return new Chord(
      {
        root: this.root.clone(),
        suffix: this.suffix,
        bass: this.bass?.clone(),
        ...properties,
      },
    );
  }

  private get rootNote() {
    return this.root.note.note;
  }

  private process(func, arg = null) {
    return this.set({
      root: this.root[func](arg),
      bass: this.bass ? this.bass[func](arg) : null,
    });
  }

  private is(type) {
    return this.root.is(type) && (!this.bass || this.bass.is(type));
  }
}

/**
 * Tries to parse a chord string into a chord
 * @param chordString the chord string, eg Esus4/G# or 1sus4/#3
 * @deprecated Please use {@link Chord.parse} instead
 * @returns {null|Chord}
 */
export function parseChord(chordString) {
  deprecate('parseChord() is deprecated, please use Chord.parse() instead');
  return Chord.parse(chordString);
}

export default Chord;
