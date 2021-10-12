import {
  normalize,
  processChord,
  switchModifier,
  transpose,
  transposeDown,
  transposeUp,
  useModifier,
} from './chord_helpers';

import Chord from './chord';

/**
 * Represents a chord symbol, such as Esus4
 */
class ChordSymbol extends Chord {
  /**
   * Normalizes the chord:
   * - Fb becomes E
   * - Cb becomes B
   * - B# becomes C
   * - E# becomes F
   * If the chord is already normalized, this will return a copy.
   * @returns {ChordSymbol} the normalized chord
   */
  normalize() {
    return processChord(this, normalize);
  }

  /**
   * Switches between '#' and 'b' as modifiers. If
   * @returns {ChordSymbol} the changed chord
   */
  switchModifier() {
    return processChord(this, switchModifier);
  }

  /**
   * Switches to the specified modifier
   * @param newModifier the modifier to use: `'#'` or `'b'`
   * @returns {ChordSymbol} the changed chord
   */
  useModifier(newModifier) {
    return processChord(this, useModifier, newModifier);
  }

  /**
   * Transposes the chord up by 1 semitone. Eg. A becomes A#, Eb becomes E
   * @returns {ChordSymbol} the transposed chord
   */
  transposeUp() {
    return processChord(this, transposeUp);
  }

  /**
   * Transposes the chord down by 1 semitone. Eg. A# becomes A, E becomes Eb
   * @returns {ChordSymbol} the transposed chord
   */
  transposeDown() {
    return processChord(this, transposeDown);
  }

  /**
   * Transposes the chord by the specified number of semitones
   * @param delta de number of semitones
   * @returns {ChordSymbol} the transposed chord
   */
  transpose(delta) {
    return processChord(this, transpose, delta);
  }

  /**
   * Convert the chord to a string, eg. `'Esus4/G#'`
   * @returns {string|*}
   */
  toString() {
    const chordString = this.base + (this.modifier || '') + (this.suffix || '');

    if (this.bassBase) {
      return `${chordString}/${this.bassBase}${this.bassModifier || ''}`;
    }

    return chordString;
  }
}

export default ChordSymbol;
