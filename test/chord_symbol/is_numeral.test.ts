import { Chord } from '../../src';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('isNumeral', () => {
      describe('for a chord symbol', () => {
        it('returns false', () => {
          expect(Chord.parse('C/E')?.isNumeral()).toBe(false);
        });
      });
    });
  });
});
