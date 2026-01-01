import { NUMERAL } from '../../src/constants';
import { buildKey } from '../util/utilities';

describe('Key', () => {
  describe('toNumeralString', () => {
    it('converts a numeral key to a string', () => {
      const key = buildKey('IV', NUMERAL, 'b');

      expect(key.toNumeralString()).toEqual('bIV');
    });
  });
});
