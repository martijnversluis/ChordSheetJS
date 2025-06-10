import { buildKey } from '../utilities';
import { Key, SOLFEGE, SYMBOL } from '../../src';

describe('Key', () => {
  describe('wrap symbol', () => {
    describe('when an key object is passed', () => {
      it('returns the key object', () => {
        const key = buildKey('A', SYMBOL, 'b');
        const wrappedKey = Key.wrap(key);

        expect(key).toBe(wrappedKey);
      });
    });

    describe('when an key string is passed', () => {
      it('returns the parsed key', () => {
        const wrappedKey = Key.wrap('Ab');

        expect(wrappedKey).toMatchObject({
          referenceKeyGrade: 8,
          grade: 0,
          modifier: 'b',
          type: SYMBOL,
          minor: false,
        });
      });
    });
  });

  describe('wrap solfege', () => {
    describe('when an key object is passed', () => {
      it('returns the key object', () => {
        const key = buildKey('La', SOLFEGE, 'b');
        const wrappedKey = Key.wrap(key);

        expect(key).toBe(wrappedKey);
      });
    });

    describe('when an key string is passed', () => {
      it('returns the parsed key', () => {
        const wrappedKey = Key.wrap('Lab');

        expect(wrappedKey).toMatchObject({
          referenceKeyGrade: 8,
          grade: 0,
          modifier: 'b',
          type: SOLFEGE,
          minor: false,
        });
      });
    });
  });
});
