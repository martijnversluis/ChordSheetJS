import Chord from '../../src/chord';
import { Key } from '../../src';

describe('Chord', () => {
  describe('numeric', () => {
    describe('toChordSymbol', () => {
      it('returns a chord symbol version', () => {
        const key = Key.parse('Ab');
        expect(Chord.parse('b5sus/#7')?.toChordSymbol(key).toString()).toEqual('Dsus/G#');
      });

      it('accepts a string key', () => {
        expect(Chord.parse('b5sus/#7')?.toChordSymbol('Ab').toString()).toEqual('Dsus/G#');
      });
    });
    describe('toChordSolfege', () => {
      it('returns a chord solfege version', () => {
        const key = Key.parse('Lab');
        expect(Chord.parse('b5sus/#7')?.toChordSolfege(key).toString()).toEqual('Resus/Sol#');
      });

      it('accepts a string key', () => {
        expect(Chord.parse('b5sus/#7')?.toChordSolfege('Lab').toString()).toEqual('Resus/Sol#');
      });
    });
  });
});
