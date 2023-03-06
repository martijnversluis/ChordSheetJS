import { Chord } from '../../src';

describe('Chord', () => {
  describe('numeric', () => {
    describe('isChordSymbol', () => {
      describe('for a numeric chord', () => {
        it('returns false', () => {
          expect(Chord.parse('1/3')?.isChordSymbol()).toBe(false);
        });
      });
    });
  });
});
