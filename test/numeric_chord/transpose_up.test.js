import Chord from '../../src/chord';
import '../matchers';

describe('Chord', () => {
  describe('transposeUp', () => {
    describe('for 1, 2, 4, 5 and 6', () => {
      it('returns the # version', () => {
        const chord = new Chord({
          base: 6,
          modifier: null,
          suffix: null,
          bassBase: 5,
          bassModifier: null,
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord({
          base: 6, modifier: '#', suffix: null, bassBase: 5, bassModifier: '#',
        });
      });
    });

    describe('for #1, #2, #4, #5 and #6', () => {
      it('returns the next note without #', () => {
        const chord = new Chord({
          base: 6,
          modifier: '#',
          suffix: null,
          bassBase: 5,
          bassModifier: '#',
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord({
          base: 7, modifier: null, suffix: null, bassBase: 6, bassModifier: null,
        });
      });
    });

    describe('for 3 and 7', () => {
      it('returns the next note', () => {
        const chord = new Chord({
          base: 3,
          modifier: null,
          suffix: null,
          bassBase: 7,
          bassModifier: null,
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord({
          base: 4, modifier: null, suffix: null, bassBase: 1, bassModifier: null,
        });
      });
    });

    describe('for b2, b3, b5, b6 and b7', () => {
      it('returns the note without b', () => {
        const chord = new Chord({
          base: 2,
          modifier: 'b',
          suffix: null,
          bassBase: 3,
          bassModifier: 'b',
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord({
          base: 2, modifier: null, suffix: null, bassBase: 3, bassModifier: null,
        });
      });
    });

    describe('for b1 and b4', () => {
      it('returns the note without b', () => {
        const chord = new Chord({
          base: 1,
          modifier: 'b',
          suffix: null,
          bassBase: 4,
          bassModifier: 'b',
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord({
          base: 1, modifier: null, suffix: null, bassBase: 4, bassModifier: null,
        });
      });
    });

    describe('for #E and #B', () => {
      it('returns the next note with #', () => {
        const chord = new Chord({
          base: 3,
          modifier: '#',
          suffix: null,
          bassBase: 7,
          bassModifier: '#',
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord({
          base: 4, modifier: '#', suffix: null, bassBase: 1, bassModifier: '#',
        });
      });
    });
  });
});
