import Chord from '../../src/chord';
import '../matchers';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('transposeUp', () => {
      describe('for D, E, G, A, B', () => {
        it('returns the b version', () => {
          const chord = new Chord({
            base: 'A',
            modifier: null,
            suffix: null,
            bassBase: 'G',
            bassModifier: null,
          });

          const transposedChord = chord.transposeDown();

          expect(transposedChord).toBeChord({
            base: 'A', modifier: 'b', suffix: null, bassBase: 'G', bassModifier: 'b',
          });
        });
      });

      describe('for C#, D#, F#, G# and A#', () => {
        it('returns the note without #', () => {
          const chord = new Chord({
            base: 'A',
            modifier: '#',
            suffix: null,
            bassBase: 'G',
            bassModifier: '#',
          });

          const transposedChord = chord.transposeDown();
          expect(transposedChord).toBeChord({
            base: 'A', modifier: null, suffix: null, bassBase: 'G', bassModifier: null,
          });
        });
      });

      describe('for F and C', () => {
        it('returns the previous note', () => {
          const chord = new Chord({
            base: 'F',
            modifier: null,
            suffix: null,
            bassBase: 'C',
            bassModifier: null,
          });

          const transposedChord = chord.transposeDown();
          expect(transposedChord).toBeChord({
            base: 'E', modifier: null, suffix: null, bassBase: 'B', bassModifier: null,
          });
        });
      });

      describe('for Db, Eb, Gb, Ab and Bb', () => {
        it('returns the previous note without b', () => {
          const chord = new Chord({
            base: 'D',
            modifier: 'b',
            suffix: null,
            bassBase: 'E',
            bassModifier: 'b',
          });

          const transposedChord = chord.transposeDown();
          expect(transposedChord).toBeChord({
            base: 'C', modifier: null, suffix: null, bassBase: 'D', bassModifier: null,
          });
        });
      });

      describe('for B# and E#', () => {
        it('returns the note without #', () => {
          const chord = new Chord({
            base: 'B',
            modifier: '#',
            suffix: null,
            bassBase: 'E',
            bassModifier: '#',
          });

          const transposedChord = chord.transposeDown();
          expect(transposedChord).toBeChord({
            base: 'B', modifier: null, suffix: null, bassBase: 'E', bassModifier: null,
          });
        });
      });

      describe('for Fb and Cb', () => {
        it('returns the previous note with b', () => {
          const chord = new Chord({
            base: 'F',
            modifier: 'b',
            suffix: null,
            bassBase: 'C',
            bassModifier: 'b',
          });

          const transposedChord = chord.transposeDown();
          expect(transposedChord).toBeChord({
            base: 'E', modifier: 'b', suffix: null, bassBase: 'B', bassModifier: 'b',
          });
        });
      });
    });
  });
});
