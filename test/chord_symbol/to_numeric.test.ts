import { Chord, Key } from '../../src';
import '../matchers';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('toNumeric', () => {
      it('returns a the numeric version', () => {
        const key = Key.parse('Ab');
        expect(Chord.parse('Dsus/F#')?.toNumeric(key).toString()).toEqual('b5sus/b7');
      });

      it('accepts a string key', () => {
        expect(Chord.parse('Dsus/F#')?.toNumeric('Ab').toString()).toEqual('b5sus/b7');
      });

      it.skip('supports a minor chord', () => {
        expect(Chord.parse('Gm')?.toNumeric('Bb')?.toString()).toEqual('6');
      });
    });
  });
});
