import Chord from '../../src/chord';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('toChordSymbolString', () => {
      describe('for a chord symbol', () => {
        it('converts correctly to a string', () => {
          const chord = new Chord({
            base: 'E',
            modifier: 'b',
            suffix: 'sus',
            bassBase: 'G',
            bassModifier: '#',
          });

          expect(chord.toChordSymbolString()).toEqual('Ebsus/G#');
        });

        it('converts correctly minor chord to a string', () => {
          const chord = new Chord({
            base: 'G',
            modifier: null,
            suffix: 'm7',
            bassBase: 'C',
            bassModifier: null,
          });

          expect(chord.toChordSymbolString()).toEqual('Gm7/C');
        });
      });
    });
  });
});
