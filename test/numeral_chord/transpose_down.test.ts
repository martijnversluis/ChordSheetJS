import Chord from '../../src/chord';
import '../matchers';

describe('Chord', () => {
  describe('transposeUp', () => {
    describe('for 2, 3, 5, 6, 7', () => {
      it('returns the b version', () => {
        const chord = new Chord({
          base: 'VI',
          modifier: null,
          suffix: null,
          bassBase: 'V',
          bassModifier: null,
        });

        const transposedChord = chord.transposeDown();

        expect(transposedChord).toBeChord({
          base: 'VI', modifier: 'b', suffix: null, bassBase: 'V', bassModifier: 'b',
        });
      });
    });

    describe('for #1, #2, #4, #5 and #6', () => {
      it('returns the note without #', () => {
        const chord = new Chord({
          base: 'vi',
          modifier: '#',
          suffix: null,
          bassBase: 'v',
          bassModifier: '#',
        });

        const transposedChord = chord.transposeDown();
        expect(transposedChord).toBeChord({
          base: 'vi', modifier: null, suffix: null, bassBase: 'v', bassModifier: null,
        });
      });
    });

    describe('for 4 and 1', () => {
      it('returns the previous note', () => {
        const chord = new Chord({
          base: 'iv',
          modifier: null,
          suffix: null,
          bassBase: 'I',
          bassModifier: null,
        });

        const transposedChord = chord.transposeDown();
        expect(transposedChord).toBeChord({
          base: 'iii', modifier: null, suffix: null, bassBase: 'VII', bassModifier: null,
        });
      });
    });

    describe('for b2, b3, b5, b6 and b7', () => {
      it('returns the previous note without b', () => {
        const chord = new Chord({
          base: 'II',
          modifier: 'b',
          suffix: null,
          bassBase: 'III',
          bassModifier: 'b',
        });

        const transposedChord = chord.transposeDown();
        expect(transposedChord).toBeChord({
          base: 'I', modifier: null, suffix: null, bassBase: 'II', bassModifier: null,
        });
      });
    });

    describe('for #7 and #3', () => {
      it('returns the note without #', () => {
        const chord = new Chord({
          base: 'VII',
          modifier: '#',
          suffix: null,
          bassBase: 'III',
          bassModifier: '#',
        });

        const transposedChord = chord.transposeDown();
        expect(transposedChord).toBeChord({
          base: 'VII', modifier: null, suffix: null, bassBase: 'III', bassModifier: null,
        });
      });
    });

    describe('for b4 and b1', () => {
      it('returns the previous note with b', () => {
        const chord = new Chord({
          base: 'IV',
          modifier: 'b',
          suffix: null,
          bassBase: 'i',
          bassModifier: 'b',
        });

        const transposedChord = chord.transposeDown();
        expect(transposedChord).toBeChord({
          base: 'III', modifier: 'b', suffix: null, bassBase: 'vii', bassModifier: 'b',
        });
      });
    });
  });
});
