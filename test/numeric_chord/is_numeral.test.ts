import { Chord } from '../../src';

describe('Chord', () => {
  describe('numeric', () => {
    describe('isNumeral', () => {
      describe('for a numeric chord', () => {
        it('returns false', () => {
          expect(Chord.parse('1/3')?.isNumeral()).toBe(false);
        });
      });
    });
  });
});
