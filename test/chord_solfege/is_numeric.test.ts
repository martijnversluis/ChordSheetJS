import { Chord } from '../../src';

describe('Chord', () => {
  describe('chord solfege', () => {
    describe('for a pure numeric chord', () => {
      it('returns true for a numeric chord', () => {
        expect(Chord.parse('1/3')?.isNumeric()).toBe(true);
      });
    });
  });
});
