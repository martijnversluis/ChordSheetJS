import { Key } from '../../src';

describe('Key', () => {
  describe('toNumeralString', () => {
    it('converts a numeral key to a string', () => {
      const key = new Key({ note: 'IV', modifier: 'b' });

      expect(key.toNumeralString()).toEqual('bIV');
    });
  });
});
