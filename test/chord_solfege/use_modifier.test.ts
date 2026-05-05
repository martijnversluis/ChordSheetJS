import Chord from '../../src/chord';

describe('Chord', () => {
  describe('chord solfege', () => {
    describe('useModifier', () => {
      describe('for a chord without modifier', () => {
        it('does not change the chord', () => {
          expect(Chord.parse('Fa/Fa')?.useAccidental('b').toString()).toEqual('Fa/Fa');
        });
      });

      describe('for #', () => {
        it('changes to b', () => {
          expect(Chord.parse('Sol#/Sol#')?.useAccidental('b').toString()).toEqual('Lab/Lab');
        });
      });

      describe('for b', () => {
        it('changes to #', () => {
          expect(Chord.parse('Solb/Solb')?.useAccidental('#').toString()).toEqual('Fa#/Fa#');
        });
      });
    });
  });
});
