import { Chord } from '../../src';

describe('Chord', () => {
  describe('numeral', () => {
    describe('isNumeral', () => {
      it('returns true', () => {
        expect(Chord.parse('I/III')?.isNumeral()).toBe(true);
      });
    });
  });
});
