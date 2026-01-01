import { buildKey } from '../util/utilities';
import { NUMERAL, SOLFEGE } from '../../src/constants';
import { NUMERIC, SYMBOL } from '../../src';

describe('Key', () => {
  describe('isNumeric', () => {
    describe('for a symbol key', () => {
      it('returns false', () => {
        const key = buildKey('A', SYMBOL, '#');

        expect(key.isNumeric()).toBe(false);
      });
    });

    describe('for a solfege key', () => {
      it('returns false', () => {
        const key = buildKey('La', SOLFEGE, '#');

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
