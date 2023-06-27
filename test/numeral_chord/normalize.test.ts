import Chord from '../../src/chord';

describe('Chord', () => {
  describe('numeral', () => {
    describe('normalize', () => {
      it('normalizes #3', () => {
        expect(Chord.parse('#iii/#III')?.normalize().toString()).toEqual('#iii/IV');
      });

      it('normalizes #7', () => {
        expect(Chord.parse('#vii/#VII')?.normalize().toString()).toEqual('#vii/I');
      });

      it('normalizes b1', () => {
        expect(Chord.parse('bI')?.normalize().toString()).toEqual('VII');
      });

      it('normalizes biv', () => {
        const parsed = Chord.parse('biv/bIV');
        const normalized = parsed?.normalize();

        expect(normalized?.toString()).toEqual('biv/III');
      });
    });
  });
});
