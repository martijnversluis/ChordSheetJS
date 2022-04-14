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
      });
    });
  });
});
