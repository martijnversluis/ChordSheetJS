import { NUMERIC, SOLFEGE, SYMBOL } from '../../src';
import { buildKey } from '../utilities';

describe('Key', () => {
  describe('isChordSolfege', () => {
    describe('for a solfege key', () => {
      it('returns true', () => {
        const key = buildKey('La', SOLFEGE, '#');

        expect(key.isChordSolfege()).toBe(true);
      });
    });

    describe('for a numeric key', () => {
      it('returns false', () => {
        const key = buildKey(5, NUMERIC, '#');

        expect(key.isChordSolfege()).toBe(false);
      });
    });

    describe('for a symbol key', () => {
      it('returns false', () => {
        const key = buildKey('A', SYMBOL, '#');

        expect(key.isChordSolfege()).toBe(false);
      });
    });
  });
});
