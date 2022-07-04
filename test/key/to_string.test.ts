import { Key } from '../../src';

describe('Key', () => {
  describe('toString', () => {
    it('converts a major numeral key to a string', () => {
      const key = new Key({ note: 'II', modifier: 'b' });

      expect(key.toString()).toEqual('bII');
    });

    it('converts a minor numeral key to a string', () => {
      const key = new Key({ note: 'II', modifier: 'b', minor: true });

      expect(key.toString()).toEqual('bii');
    });

    it('converts a major numeric key to a string', () => {
      const key = new Key({ note: 2, modifier: 'b' });

      expect(key.toString()).toEqual('b2');
    });

    it('converts a minor numeric key to a string', () => {
      const key = new Key({ note: 2, modifier: 'b', minor: true });

      expect(key.toString()).toEqual('b2m');
    });

    it('converts a major chord symbol key to a string', () => {
      const key = new Key({ note: 'A', modifier: 'b' });

      expect(key.toString()).toEqual('Ab');
    });

    it('converts a minor chord symbol key to a string', () => {
      const key = new Key({ note: 'A', modifier: 'b', minor: true });

      expect(key.toString()).toEqual('Abm');
    });
  });
});
