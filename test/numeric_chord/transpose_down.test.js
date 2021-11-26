import Chord from '../../src/chord';
import '../matchers';

describe('Chord', () => {
  describe('transposeUp', () => {
    describe('for 2, 3, 5, 6, 7', () => {
      it('returns the b version', () => {
        const chord = new Chord({
          base: 6,
          modifier: null,
          suffix: null,
          bassBase: 5,
          bassModifier: null,
        });

        const transposedChord = chord.transposeDown();

        expect(transposedChord).toBeChord({
          base: 6, modifier: 'b', suffix: null, bassBase: 5, bassModifier: 'b',
        });
      });
    });

    describe('for #1, #2, #4, #5 and #6', () => {
      it('returns the note without #', () => {
        const chord = new Chord({
          base: 6,
          modifier: '#',
          suffix: null,
          bassBase: 5,
          bassModifier: '#',
        });

        const transposedChord = chord.transposeDown();
        expect(transposedChord).toBeChord({
          base: 6, modifier: null, suffix: null, bassBase: 5, bassModifier: null,
        });
      });
    });

    describe('for 4 and 1', () => {
      it('returns the previous note', () => {
        const chord = new Chord({
          base: 4,
          modifier: null,
          suffix: null,
          bassBase: 1,
          bassModifier: null,
        });

        const transposedChord = chord.transposeDown();
        expect(transposedChord).toBeChord({
          base: 3, modifier: null, suffix: null, bassBase: 7, bassModifier: null,
        });
      });
    });

    describe('for b2, b3, b5, b6 and b7', () => {
      it('returns the previous note without b', () => {
        const chord = new Chord({
          base: 2,
          modifier: 'b',
          suffix: null,
          bassBase: 3,
          bassModifier: 'b',
        });

        const transposedChord = chord.transposeDown();
        expect(transposedChord).toBeChord({
          base: 1, modifier: null, suffix: null, bassBase: 2, bassModifier: null,
        });
      });
    });

    describe('for #7 and #3', () => {
      it('returns the note without #', () => {
        const chord = new Chord({
          base: 7,
          modifier: '#',
          suffix: null,
          bassBase: 3,
          bassModifier: '#',
        });

        const transposedChord = chord.transposeDown();
        expect(transposedChord).toBeChord({
          base: 7, modifier: null, suffix: null, bassBase: 3, bassModifier: null,
        });
      });
    });

    describe('for b4 and b1', () => {
      it('returns the previous note with b', () => {
        const chord = new Chord({
          base: 4,
          modifier: 'b',
          suffix: null,
          bassBase: 1,
          bassModifier: 'b',
        });

        const transposedChord = chord.transposeDown();
        expect(transposedChord).toBeChord({
          base: 3, modifier: 'b', suffix: null, bassBase: 7, bassModifier: 'b',
        });
      });
    });
  });
});
