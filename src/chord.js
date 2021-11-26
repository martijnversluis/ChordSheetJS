import { deprecate, isEmptyString, presence } from './utilities';
import Key from './key';
import { NUMERIC, SYMBOL } from './constants';

const MAJOR_SCALE = [null, 'M', 'm', 'm', 'M', 'M', 'm', 'dim'];

function normalizeSuffix(suffix) {
  if (suffix === 'M') {
    return '';
  }

  return suffix;
}

function chordSuffix(noteNumber, suffix) {
  if (isEmptyString(suffix)) {
    const defaultSuffix = MAJOR_SCALE[noteNumber];
    return normalizeSuffix(defaultSuffix);
  }

  return normalizeSuffix(suffix);
}

const chordRegex = (
  /^(?<base>[A-G])(?<modifier>#|b)?(?<suffix>[^/\s]*)(\/(?<bassBase>[A-G])(?<bassModifier>#|b)?)?$/i
);

const numericChordRegex = (
  /^(?<modifier>#|b)?(?<base>[1-7])(?<suffix>[^/\s]*)(\/(?<bassModifier>#|b)?(?<bassBase>[0-7]))?$/
);

const regexes = [numericChordRegex, chordRegex];

/**
 * Represents a Chord, consisting of a root, suffix (quality) and bass
 */
class Chord {
  /**
   * Tries to parse a chord string into a chord
   * @param chordString the chord string, eg `Esus4/G#` or `1sus4/#3`
   * @returns {null|Chord}
   */
  static parse(chordString) {
    for (let i = 0, count = regexes.length; i < count; i += 1) {
      const match = chordString.match(regexes[i]);

      if (match) {
        return new Chord(match.groups);
      }
    }

    return null;
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
   * @param {Key|string} key the reference key
   * @returns {Chord} the chord symbol
   */
  toChordSymbol(key) {
    if (this.isChordSymbol()) {
      return this.clone();
    }

    const keyObj = Key.wrap(key);

    return new Chord({
      suffix: chordSuffix(this.#rootNote, this.suffix),
      root: this.root.toChordSymbol(keyObj),
      bass: this.bass?.toChordSymbol(keyObj),
    });
  }

  /**
   * Converts the chord to a chord symbol string, using the supplied key as a reference.
   * For example, a numeric chord `#4` with reference key `E` will return the chord symbol `A#`.
   * When the chord is already a chord symbol, it will return a string version of the chord.
   * @param {Key|string} key the reference key
   * @returns {string} the chord symbol string
   * @see {toChordSymbol}
   */
  toChordSymbolString(key) {
    return this.toChordSymbol(key).toString();
  }

  /**
   * Determines whether the chord is a chord symbol
   * @returns {boolean}
   */
  isChordSymbol() {
    return this.#is(SYMBOL);
  }

  /**
   * Converts the chord to a numeric chord, using the supplied kye as a reference.
   * For example, a chord symbol A# with reference key E will return the numeric chord #4.
   * @param {Key|string} key the reference key
   * @returns {Chord} the numeric chord
   */
  toNumeric(key) {
    if (this.isNumeric()) {
      return this.clone();
    }

    const keyObj = Key.wrap(key);

    return new Chord({
      suffix: chordSuffix(this.#rootNote, this.suffix),
      root: this.root.toNumeric(keyObj),
      bass: this.bass?.toNumeric(keyObj),
    });
  }

  /**
   * Determines whether the chord is numeric
   * @returns {boolean}
   */
  isNumeric() {
    return this.#is(NUMERIC);
  }

  /**
   * Converts the chord to a numeric chord string, using the supplied kye as a reference.
   * For example, a chord symbol A# with reference key E will return the numeric chord #4.
   * @param {Key|string} key the reference key
   * @returns {string} the numeric chord string
   * @see {toNumeric}
   */
  toNumericString(key) {
    return this.toNumeric(key).toString();
  }

  /**
   * Converts the chord to a string, eg `Esus4/G#` or `1sus4/#3`
   * @returns {string} the chord string
   */
  toString() {
    const chordString = this.root.toString() + (this.suffix || '');

    if (this.bass) {
      return `${chordString}/${this.bass.toString()}`;
    }

    return chordString;
  }

  /**
   * Normalizes the chord:
   * - Fb becomes E
   * - Cb becomes B
   * - B# becomes C
   * - E# becomes F
   * - 4b becomes 3
   * - 1b becomes 7
   * - 7# becomes 1
   * - 3# becomes 4
   *
   * If the chord is already normalized, this will return a copy.
   * @returns {Chord} the normalized chord
   */
  normalize() {
    return this.#process('normalize');
  }

  /**
   * Switches to the specified modifier
   * @param newModifier the modifier to use: `'#'` or `'b'`
   * @returns {Chord} the new, changed chord
   */
  useModifier(newModifier) {
    return this.#process('useModifier', newModifier);
  }

  /**
   * Transposes the chord up by 1 semitone. Eg. A becomes A#, Eb becomes E
   * @returns {Chord} the new, transposed chord
   */
  transposeUp() {
    return this.#process('transposeUp');
  }

  /**
   * Transposes the chord down by 1 semitone. Eg. A# becomes A, E becomes Eb
   * @returns {Chord} the new, transposed chord
   */
  transposeDown() {
    return this.#process('transposeDown');
  }

  /**
   * Transposes the chord by the specified number of semitones
   * @param delta de number of semitones
   * @returns {Chord} the new, transposed chord
   */
  transpose(delta) {
    return this.#process('transpose', delta);
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
    this.root = root || new Key({ note: base, modifier });
    this.suffix = presence(suffix);
    this.bass = bass || (bassBase ? new Key({ note: bassBase, modifier: bassModifier }) : null);
  }

  set(properties) {
    return new this.constructor(
      {
        root: this.root.clone(),
        suffix: this.suffix,
        bass: this.bass?.clone(),
        ...properties,
      },
    );
  }

  get #rootNote() {
    return this.root.note.note;
  }

  #process(func, arg = null) {
    return this.set({
      root: this.root[func](arg),
      bass: this.bass ? this.bass[func](arg) : null,
    });
  }

  #is(type) {
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
