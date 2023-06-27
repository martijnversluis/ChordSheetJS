import { Chord } from '../../src';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('isChordSymbol', () => {
      it('returns true for a chord symbol', () => {
        expect(Chord.parse('A/C')?.isChordSymbol()).toBe(true);
      });
    });
  });
});
