import { Key, SYMBOL } from '../../src';
import { buildKey } from '../utilities';

describe('Key', () => {
  describe('wrap', () => {
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
});
