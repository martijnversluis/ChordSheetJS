import Chord from './chord';

/**
 * Represents a numeric chord, such as b3sus4
 */
class NumericChord extends Chord {
  constructor(
    {
      base, modifier, suffix, bassBase, bassModifier,
    },
  ) {
    super(
      {
        base: parseInt(base, 10),
        modifier,
        suffix,
        bassBase: parseInt(bassBase, 10),
        bassModifier,
      },
    );
  }

  toString() {
    const chordString = (this.modifier || '') + this.base + (this.suffix || '');

    if (this.bassBase) {
      return `${chordString}/${this.bassModifier || ''}${this.bassBase}`;
    }

    return chordString;
  }

  /**
   * Normalizes the chord - this is a noop for numeric chords.
   * @returns {NumericChord} a copy of the chord object
   */
  normalize() {
    return this.clone();
  }

  /**
   * Switches between '#' and 'b' as modifiers - this is a noop for numeric chords.
   * @returns {NumericChord} a copy of the chord object
   */
  switchModifier() {
    return this.clone();
  }

  /**
   * Switches to the specified modifier - this is a noop for numeric chords.
   * @returns {NumericChord} a copy of the chord object
   */
  useModifier() {
    return this.clone();
  }

  /**
   * Transposes the chord up by 1 semitone - this is a noop for numeric chords.
   * @returns {NumericChord} a copy of the chord object
   */
  transposeUp() {
    return this.clone();
  }

  /**
   * Transposes the chord down by 1 semitone - this is a noop for numeric chords.
   * @returns {NumericChord} a copy of the chord object
   */
  transposeDown() {
    return this.clone();
  }

  /**
   * Transposes the chord by the specified number of semitones - this is a noop for numeric chords.
   * @param delta de number of semitones
   * @returns {NumericChord} a copy of the chord object
   */
  transpose() {
    return this.clone();
  }
}

export default NumericChord;
