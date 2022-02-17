import Chord from '../../src/chord';
import '../matchers';

describe('Chord', () => {
  describe('transposeUp', () => {
    describe('for 1, 2, 4, 5 and 6', () => {
      it('returns the # version', () => {
        const chord = new Chord({
          base: 'VI',
          modifier: null,
          suffix: null,
          bassBase: 'V',
          bassModifier: null,
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord({
          base: 'VI', modifier: '#', suffix: null, bassBase: 'V', bassModifier: '#',
        });
      });
    });

    describe('for #1, #2, #4, #5 and #6', () => {
      it('returns the next note without #', () => {
        const chord = new Chord({
          base: 'vi',
          modifier: '#',
          suffix: null,
          bassBase: 'v',
          bassModifier: '#',
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord({
          base: 'vii', modifier: null, suffix: null, bassBase: 'vi', bassModifier: null,
        });
      });
    });

    describe('for 3 and 7', () => {
      it('returns the next note', () => {
        const chord = new Chord({
          base: 'iii',
          modifier: null,
          suffix: null,
          bassBase: 'VII',
          bassModifier: null,
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord({
          base: 'iv', modifier: null, suffix: null, bassBase: 'I', bassModifier: null,
        });
      });
    });

    describe('for b2, b3, b5, b6 and b7', () => {
      it('returns the note without b', () => {
        const chord = new Chord({
          base: 'II',
          modifier: 'b',
          suffix: null,
          bassBase: 'III',
          bassModifier: 'b',
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord({
          base: 'II', modifier: null, suffix: null, bassBase: 'III', bassModifier: null,
        });
      });
    });

    describe('for b1 and b4', () => {
      it('returns the note without b', () => {
        const chord = new Chord({
          base: 'i',
          modifier: 'b',
          suffix: null,
          bassBase: 'iv',
          bassModifier: 'b',
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord({
          base: 'i', modifier: null, suffix: null, bassBase: 'iv', bassModifier: null,
        });
      });
    });

    describe('for #E and #B', () => {
      it('returns the next note with #', () => {
        const chord = new Chord({
          base: 'III',
          modifier: '#',
          suffix: null,
          bassBase: 'VII',
          bassModifier: '#',
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord({
          base: 'IV', modifier: '#', suffix: null, bassBase: 'I', bassModifier: '#',
        });
      });
    });
  });
});
