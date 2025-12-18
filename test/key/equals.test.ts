import { NUMERIC } from '../../src';
import { buildKey } from '../util/utilities';

describe('Key', () => {
  describe('#equals', () => {
    it('returns true when both the note and modifier are equal', () => {
      const keyA = buildKey(3, NUMERIC, '#', true);
      const keyB = buildKey(3, NUMERIC, '#', true);

      expect(keyA.equals(keyB)).toBe(true);
    });

    it('returns false when the note differs', () => {
      const keyA = buildKey(3, NUMERIC, '#', true);
      const keyB = buildKey(5, NUMERIC, '#', true);

      expect(keyA).not.toEqual(keyB);
    });

    it('returns false when minor differs', () => {
      const keyA = buildKey(3, NUMERIC, '#', true);
      const keyB = buildKey(3, NUMERIC, '#', false);

      expect(keyA.equals(keyB)).toBe(false);
    });

    it('returns false when the modifier differs', () => {
      const keyA = buildKey(3, NUMERIC, '#', true);
      const keyB = buildKey(3, NUMERIC, 'b', true);

      expect(keyA.equals(keyB)).toBe(false);
    });
  });
});
