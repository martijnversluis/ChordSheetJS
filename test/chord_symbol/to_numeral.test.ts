import '../matchers';

import { Chord, Key } from '../../src';

describe('Chord', () => {
  describe('toNumeral', () => {
    describe('for a chord symbol', () => {
      it('returns a the numeral version', () => {
        const key = Key.parseOrFail('Ab');

        expect(Chord.parse('Dsus/F#')?.toNumeral(key).toString()).toEqual('bVsus/bVII');
      });

      it('accepts a string key', () => {
        expect(Chord.parse('Dsus/F#')?.toNumeral('Ab').toString()).toEqual('bVsus/bVII');
      });

      it.skip('supports a minor chord', () => {
        expect(Chord.parse('Gm')?.toNumeral('Bb').toString()).toEqual('vi');
      });
    });
  });
});
