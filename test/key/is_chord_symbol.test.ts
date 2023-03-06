import { NUMERIC, SYMBOL } from '../../src';
import { buildKey } from '../utilities';

describe('Key', () => {
  describe('isChordSymbol', () => {
    describe('for a symbol key', () => {
      it('returns true', () => {
        const key = buildKey('A', SYMBOL, '#');

        expect(key.isChordSymbol()).toBe(true);
      });
    });

    describe('for a numeric key', () => {
      it('returns false', () => {
        const key = buildKey(5, NUMERIC, '#');

        expect(key.isChordSymbol()).toBe(false);
      });
    });
  });
});
