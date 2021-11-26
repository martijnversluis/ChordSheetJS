import Chord from '../../src/chord';

describe('Chord', () => {
  describe('toChordSymbolString', () => {
    describe('for a chord symbol', () => {
      it('converts correctly to a string', () => {
        const chord = new Chord({
          base: 'E',
          modifier: 'b',
          suffix: 'sus4',
          bassBase: 'G',
          bassModifier: '#',
        });

        expect(chord.toChordSymbolString()).toEqual('Ebsus4/G#');
      });
    });
  });
});
