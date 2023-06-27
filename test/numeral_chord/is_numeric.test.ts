import { Chord } from '../../src';

describe('Chord', () => {
  describe('numeral', () => {
    describe('isNumeric', () => {
      it('returns true', () => {
        expect(Chord.parse('I/III')?.isNumeric()).toBe(false);
      });
    });
  });
});
