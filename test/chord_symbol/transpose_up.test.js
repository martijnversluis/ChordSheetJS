import ChordSymbol from '../../src/chord_symbol';
import '../matchers';

describe('ChordSymbol', () => {
  describe('transposeUp', () => {
    describe('for C, D, F, G and A', () => {
      it('returns the # version', () => {
        const chord = new ChordSymbol({
          base: 'A',
          modifier: null,
          suffix: null,
          bassBase: 'G',
          bassModifier: null,
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord('A', '#', null, 'G', '#');
      });
    });

    describe('for C#, D#, F#, G# and A#', () => {
      it('returns the next note without #', () => {
        const chord = new ChordSymbol({
          base: 'A',
          modifier: '#',
          suffix: null,
          bassBase: 'G',
          bassModifier: '#',
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord('B', null, null, 'A', null);
      });
    });

    describe('for E and B', () => {
      it('returns the next note', () => {
        const chord = new ChordSymbol({
          base: 'E',
          modifier: null,
          suffix: null,
          bassBase: 'B',
          bassModifier: null,
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord('F', null, null, 'C', null);
      });
    });

    describe('for Db, Eb, Gb, Ab and Bb', () => {
      it('returns the note without b', () => {
        const chord = new ChordSymbol({
          base: 'D',
          modifier: 'b',
          suffix: null,
          bassBase: 'E',
          bassModifier: 'b',
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord('D', null, null, 'E', null);
      });
    });

    describe('for Cb and Fb', () => {
      it('returns the note without b', () => {
        const chord = new ChordSymbol({
          base: 'C',
          modifier: 'b',
          suffix: null,
          bassBase: 'F',
          bassModifier: 'b',
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord('C', null, null, 'F', null);
      });
    });

    describe('for E# and B#', () => {
      it('returns the next note with #', () => {
        const chord = new ChordSymbol({
          base: 'E',
          modifier: '#',
          suffix: null,
          bassBase: 'B',
          bassModifier: '#',
        });

        const transposedChord = chord.transposeUp();
        expect(transposedChord).toBeChord('F', '#', null, 'C', '#');
      });
    });
  });
});
