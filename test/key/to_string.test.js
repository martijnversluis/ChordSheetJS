import { Key } from '../../src';

describe('Key', () => {
  describe('toString', () => {
    it('converts a numeric key to a string', () => {
      const key = new Key({ note: 2, modifier: 'b' });

      expect(key.toString()).toEqual('b2');
    });

    it('converts a chord symbol key to a string', () => {
      const key = new Key({ note: 'A', modifier: 'b' });

      expect(key.toString()).toEqual('Ab');
    });
  });
});
