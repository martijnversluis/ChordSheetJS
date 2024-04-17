import { NUMERIC, SYMBOL } from '../../src';
import { buildKey } from '../utilities';
import { NUMERAL, SOLFEGE } from '../../src/constants';

describe('Key', () => {
  describe('toString', () => {
    it('converts a major numeral key to a string', () => {
      const key = buildKey('II', NUMERAL, 'b');

      expect(key.toString()).toEqual('bII');
    });

    it('converts a minor numeral key to a string', () => {
      const key = buildKey('ii', NUMERAL, 'b', false);

      expect(key.toString()).toEqual('bii');
    });

    it('converts a major numeric key to a string', () => {
      const key = buildKey(2, NUMERIC, 'b');

      expect(key.toString()).toEqual('b2');
    });

    it('converts a minor numeric key to a string', () => {
      const key = buildKey(2, NUMERIC, 'b', true);

      expect(key.toString()).toEqual('b2');
    });

    it('converts a major chord symbol key to a string', () => {
      const key = buildKey('A', SYMBOL, 'b');

      expect(key.toString()).toEqual('Ab');
    });

    it('converts a minor chord symbol key to a string', () => {
      const key = buildKey('A', SYMBOL, 'b', true);

      expect(key.toString()).toEqual('Abm');
    });

    it('converts a major chord solfege key to a string', () => {
      const key = buildKey('La', SOLFEGE, 'b');

      expect(key.toString()).toEqual('Lab');
    });

    it('converts a minor chord solfege key to a string', () => {
      const key = buildKey('La', SOLFEGE, 'b', true);

      expect(key.toString()).toEqual('Labm');
    });
  });
});
