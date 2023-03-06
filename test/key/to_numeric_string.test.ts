import { NUMERIC } from '../../src';
import { buildKey } from '../utilities';

describe('Key', () => {
  describe('toNumericString', () => {
    it('converts a numeric key to a string', () => {
      const key = buildKey(2, NUMERIC, 'b');

      expect(key.toNumericString()).toEqual('b2');
    });
  });
});
