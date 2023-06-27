import Chord from '../../src/chord';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('toChordSymbolString', () => {
      describe('for a chord symbol', () => {
        it('converts correctly to a string', () => {
          expect(Chord.parse('Ebsus/G#')?.toChordSymbolString()).toEqual('Ebsus/G#');
        });

        it('converts correctly minor chord to a string', () => {
          expect(Chord.parse('Gm7/C')?.toChordSymbolString()).toEqual('Gm7/C');
        });
      });
    });
  });
});
