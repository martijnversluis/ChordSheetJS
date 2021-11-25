import { Key } from '../../src';

describe('Key', () => {
  describe('toNumericString', () => {
    it('converts a numeric key to a string', () => {
      const key = new Key({ note: 2, modifier: 'b' });

      expect(key.toNumericString()).toEqual('b2');
    });
  });
});
