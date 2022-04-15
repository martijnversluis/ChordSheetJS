import { Key } from '../../src';
import '../matchers';

describe('Key', () => {
  describe('wrap', () => {
    describe('when an key object is passed', () => {
      it('returns the key object', () => {
        const key = new Key({ note: 'A', modifier: 'b' });
        const wrappedKey = Key.wrap(key);

        expect(key).toBe(wrappedKey);
      });
    });

    describe('when an key string is passed', () => {
      it('returns the parsed key', () => {
        const wrappedKey = Key.wrap('Ab');

        expect(wrappedKey).toBeKey({ note: 'A', modifier: 'b' });
      });
    });
  });
});
