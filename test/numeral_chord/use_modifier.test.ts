import Chord from '../../src/chord';

describe('Chord', () => {
  describe('useModifier', () => {
    describe('for a chord without modifier', () => {
      it('does not change the chord', () => {
        expect(Chord.parse('IV/IV')?.useModifier('b').toString()).toEqual('IV/IV');
      });
    });

    describe('for #', () => {
      it('changes to b', () => {
        expect(Chord.parse('#V/#V')?.useModifier('b').toString()).toEqual('bVI/bVI');
      });
    });

    describe('for b', () => {
      it('changes to #', () => {
        expect(Chord.parse('bV/bV')?.useModifier('#').toString()).toEqual('#IV/#IV');
      });
    });
  });
});
