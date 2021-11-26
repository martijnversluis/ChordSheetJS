import { Key } from '../../src';

describe('Key', () => {
  describe('toChordSymbolString', () => {
    it('returns a string version of the chord symbol', () => {
      const songKey = new Key({ note: 'E' });
      const key = new Key({ note: 4, modifier: '#' });

      expect(key.toChordSymbolString(songKey)).toEqual('A#');
    });
  });
});
