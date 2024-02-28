import { Chord, Key } from '../../src';
import '../matchers';

describe('Chord', () => {
  describe('toNumeral', () => {
    describe('for a chord symbol', () => {
      it('returns a the numeral version', () => {
        const key = Key.parseOrFail('Lab');

        expect(Chord.parse('Resus/Fa#')?.toNumeral(key).toString()).toEqual('bVsus/bVII');
      });

      it('accepts a string key', () => {
        expect(Chord.parse('Resus/Fa#')?.toNumeral('Lab').toString()).toEqual('bVsus/bVII');
      });

      xit('supports a minor chord', () => {
        expect(Chord.parse('Solm')?.toNumeral('Sib').toString()).toEqual('vi');
      });
    });
  });
});
