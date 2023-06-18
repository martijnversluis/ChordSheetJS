import Chord from '../../src/chord';
import { Key } from '../../src';

describe('Chord', () => {
  describe('numeral', () => {
    describe('toChordSymbol', () => {
      it('returns a chord symbol version', () => {
        const key = Key.parse('Ab');
        expect(Chord.parse('bVsus/#VII')?.toChordSymbol(key).toString()).toEqual('Dsus/G#');
      });

      it('accepts a string key', () => {
        expect(Chord.parse('bVsus/#VII')?.toChordSymbol('Ab').toString()).toEqual('Dsus/G#');
      });
    });
  });
});
