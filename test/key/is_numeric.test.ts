import { NUMERIC, SYMBOL } from '../../src';
import { buildKey } from '../utilities';
import { NUMERAL } from '../../src/constants';

describe('Key', () => {
  describe('isNumeric', () => {
    describe('for a symbol key', () => {
      it('returns false', () => {
        const key = buildKey('A', SYMBOL, '#');

        expect(key.isNumeric()).toBe(false);
      });
    });

    describe('for a numeric key', () => {
      it('returns true', () => {
        const key = buildKey(5, NUMERIC, '#');

        expect(key.isNumeric()).toBe(true);
      });
    });

    describe('for a numeral', () => {
      it('returns false', () => {
        const key = buildKey('V', NUMERAL, '#');

        expect(key.isNumeric()).toBe(false);
      });
    });
  });
});
