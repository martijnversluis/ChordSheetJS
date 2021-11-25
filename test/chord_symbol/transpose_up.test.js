import Chord from '../../src/chord';
import '../matchers';

describe('Chord', () => {
  describe('transposeUp', () => {
    describe('for C, D, F, G and A', () => {
      it('returns the # version', () => {
        const chord = new Chord({
          base: 'A',
          modifier: null,
          suffix: null,
          bassBase: 'G',
          bassModifier: null,
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord({
          base: 'A', modifier: '#', suffix: null, bassBase: 'G', bassModifier: '#',
        });
      });
    });

    describe('for C#, D#, F#, G# and A#', () => {
      it('returns the next note without #', () => {
        const chord = new Chord({
          base: 'A',
          modifier: '#',
          suffix: null,
          bassBase: 'G',
          bassModifier: '#',
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord({
          base: 'B', modifier: null, suffix: null, bassBase: 'A', bassModifier: null,
        });
      });
    });

    describe('for E and B', () => {
      it('returns the next note', () => {
        const chord = new Chord({
          base: 'E',
          modifier: null,
          suffix: null,
          bassBase: 'B',
          bassModifier: null,
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord({
          base: 'F', modifier: null, suffix: null, bassBase: 'C', bassModifier: null,
        });
      });
    });

    describe('for Db, Eb, Gb, Ab and Bb', () => {
      it('returns the note without b', () => {
        const chord = new Chord({
          base: 'D',
          modifier: 'b',
          suffix: null,
          bassBase: 'E',
          bassModifier: 'b',
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord({
          base: 'D', modifier: null, suffix: null, bassBase: 'E', bassModifier: null,
        });
      });
    });

    describe('for Cb and Fb', () => {
      it('returns the note without b', () => {
        const chord = new Chord({
          base: 'C',
          modifier: 'b',
          suffix: null,
          bassBase: 'F',
          bassModifier: 'b',
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord({
          base: 'C', modifier: null, suffix: null, bassBase: 'F', bassModifier: null,
        });
      });
    });

    describe('for E# and B#', () => {
      it('returns the next note with #', () => {
        const chord = new Chord({
          base: 'E',
          modifier: '#',
          suffix: null,
          bassBase: 'B',
          bassModifier: '#',
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord({
          base: 'F', modifier: '#', suffix: null, bassBase: 'C', bassModifier: '#',
        });
      });
    });
  });
});
