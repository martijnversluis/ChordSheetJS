import Chord from '../../src/chord';

describe('Chord', () => {
  describe('numeric', () => {
    describe('useModifier', () => {
      describe('for a chord without modifier', () => {
        it('does not change the chord', () => {
          expect(Chord.parse('4/4')?.useModifier('b').toString()).toEqual('4/4');
        });
      });

      describe('for #', () => {
        it('changes to b', () => {
          expect(Chord.parse('#5/#5')?.useModifier('b').toString()).toEqual('b6/b6');
        });
      });

      describe('for b', () => {
        it('changes to #', () => {
          expect(Chord.parse('b5/b5')?.useModifier('#').toString()).toEqual('#4/#4');
        });
      });
    });
  });
});
