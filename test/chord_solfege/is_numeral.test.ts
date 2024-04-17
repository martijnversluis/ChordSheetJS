import { Chord } from '../../src';

describe('Chord', () => {
  describe('chord solfege', () => {
    describe('isNumeral', () => {
      describe('for a chord solfege', () => {
        it('returns false', () => {
          expect(Chord.parse('Do/Mi')?.isNumeral()).toBe(false);
        });
      });
    });
  });
});
