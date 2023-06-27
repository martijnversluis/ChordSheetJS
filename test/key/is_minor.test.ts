import { NUMERIC } from '../../src/constants';
import { buildKey } from '../utilities';

describe('Key', () => {
  describe('#isMinor', () => {
    it('returns true when the note is minor', () => {
      const key = buildKey(3, NUMERIC, null, true);

      expect(key.isMinor()).toBe(true);
    });

    it('returns false when the note is major', () => {
      const key = buildKey(3, NUMERIC, null, false);

      expect(key.isMinor()).toBe(false);
    });
  });
});
