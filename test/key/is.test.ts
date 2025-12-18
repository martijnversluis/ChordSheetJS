import { buildKey } from '../util/utilities';
import { NUMERIC, SYMBOL } from '../../src';

describe('Key', () => {
  describe('#is', () => {
    it('returns true when the provided type matches the note type', () => {
      const key = buildKey(5, NUMERIC);

      expect(key.is(NUMERIC)).toBe(true);
    });

    it('returns false when the provided type does not match the note type', () => {
      const key = buildKey(5, NUMERIC);

      expect(key.is(SYMBOL)).toBe(false);
    });
  });
});
