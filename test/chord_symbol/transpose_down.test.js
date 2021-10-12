import ChordSymbol from '../../src/chord_symbol';
import '../matchers';

describe('ChordSymbol', () => {
  describe('transposeUp', () => {
    describe('for D, E, G, A, B', () => {
      it('returns the b version', () => {
        const chord = new ChordSymbol({
          base: 'A',
          modifier: null,
          suffix: null,
          bassBase: 'G',
          bassModifier: null,
        });

        const transposedChord = chord.transposeDown();
        expect(transposedChord).toBeChord('A', 'b', null, 'G', 'b');
      });
    });

    describe('for C#, D#, F#, G# and A#', () => {
      it('returns the note without #', () => {
        const chord = new ChordSymbol({
          base: 'A',
          modifier: '#',
          suffix: null,
          bassBase: 'G',
          bassModifier: '#',
        });

        const transposedChord = chord.transposeDown();
        expect(transposedChord).toBeChord('A', null, null, 'G', null);
      });
    });

    describe('for F and C', () => {
      it('returns the previous note', () => {
        const chord = new ChordSymbol({
          base: 'F',
          modifier: null,
          suffix: null,
          bassBase: 'C',
          bassModifier: null,
        });

        const transposedChord = chord.transposeDown();
        expect(transposedChord).toBeChord('E', null, null, 'B', null);
      });
    });

    describe('for Db, Eb, Gb, Ab and Bb', () => {
      it('returns the previous note without b', () => {
        const chord = new ChordSymbol({
          base: 'D',
          modifier: 'b',
          suffix: null,
          bassBase: 'E',
          bassModifier: 'b',
        });

        const transposedChord = chord.transposeDown();
        expect(transposedChord).toBeChord('C', null, null, 'D', null);
      });
    });

    describe('for B# and E#', () => {
      it('returns the note without #', () => {
        const chord = new ChordSymbol({
          base: 'B',
          modifier: '#',
          suffix: null,
          bassBase: 'E',
          bassModifier: '#',
        });

        const transposedChord = chord.transposeDown();
        expect(transposedChord).toBeChord('B', null, null, 'E', null);
      });
    });

    describe('for Fb and Cb', () => {
      it('returns the previous note with b', () => {
        const chord = new ChordSymbol({
          base: 'F',
          modifier: 'b',
          suffix: null,
          bassBase: 'C',
          bassModifier: 'b',
        });

        const transposedChord = chord.transposeDown();
        expect(transposedChord).toBeChord('E', 'b', null, 'B', 'b');
      });
    });
  });
});
