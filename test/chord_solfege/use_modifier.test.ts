import Chord from '../../src/chord';

describe('Chord', () => {
  describe('chord solfege', () => {
    describe('useModifier', () => {
      describe('for a chord without modifier', () => {
        it('does not change the chord', () => {
          expect(Chord.parse('Fa/Fa')?.useModifier('b').toString()).toEqual('Fa/Fa');
        });
      });

      describe('for #', () => {
        it('changes to b', () => {
          expect(Chord.parse('Sol#/Sol#')?.useModifier('b').toString()).toEqual('Lab/Lab');
        });
      });

      describe('for b', () => {
        it('changes to #', () => {
          expect(Chord.parse('Solb/Solb')?.useModifier('#').toString()).toEqual('Fa#/Fa#');
        });
      });
    });
  });
});
