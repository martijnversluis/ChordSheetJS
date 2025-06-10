import { buildKey } from '../utilities';
import { NUMERIC, SOLFEGE, SYMBOL } from '../../src';

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

    describe('for a solfege key', () => {
      it('returns false', () => {
        const key = buildKey('La', SOLFEGE, '#');

        expect(key.isChordSymbol()).toBe(false);
      });
    });
  });
});
