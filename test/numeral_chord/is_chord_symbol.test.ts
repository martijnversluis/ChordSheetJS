import { Chord } from '../../src';

describe('Chord', () => {
  describe('isChordSymbol', () => {
    describe('for a numeral chord', () => {
      it('returns false', () => {
        expect(Chord.parse('V/VII')?.isChordSymbol()).toBe(false);
      });
    });
  });
});
