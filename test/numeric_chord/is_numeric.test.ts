import { Chord } from '../../src';

describe('Chord', () => {
  describe('numeric', () => {
    describe('isNumeric', () => {
      describe('for a pure numeric chord', () => {
        it('returns true', () => {
          expect(Chord.parse('1/3')?.isNumeric()).toBe(true);
        });
      });
    });
  });
});
