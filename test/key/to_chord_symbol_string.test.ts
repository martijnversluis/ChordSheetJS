import { NUMERIC, SYMBOL } from '../../src';
import { buildKey } from '../utilities';

describe('Key', () => {
  describe('toChordSymbolString', () => {
    it('returns a string version of the chord symbol', () => {
      const songKey = buildKey('E', SYMBOL);
      const key = buildKey(4, NUMERIC, '#');

      expect(key.toChordSymbolString(songKey)).toEqual('A#');
    });
  });
});
