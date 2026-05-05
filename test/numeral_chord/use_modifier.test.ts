import Chord from '../../src/chord';

describe('Chord', () => {
  describe('useModifier', () => {
    describe('for a chord without modifier', () => {
      it('does not change the chord', () => {
        expect(Chord.parse('IV/IV')?.useAccidental('b').toString()).toEqual('IV/IV');
      });
    });

    describe('for #', () => {
      it('changes to b', () => {
        expect(Chord.parse('#V/#V')?.useAccidental('b').toString()).toEqual('bVI/bVI');
      });
    });

    describe('for b', () => {
      it('changes to #', () => {
        expect(Chord.parse('bV/bV')?.useAccidental('#').toString()).toEqual('#IV/#IV');
      });
    });
  });
});
