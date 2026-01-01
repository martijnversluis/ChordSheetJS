import '../util/matchers';

import { Chord, Key } from '../../src';

describe('Chord', () => {
  describe('toNumeral', () => {
    describe('for a chord symbol', () => {
      it('returns a the numeral version', () => {
        const key = Key.parseOrFail('Ab');
        const parsedChord = Chord.parse('Dsus/F#');
        const numeral = parsedChord?.toNumeral(key);

        expect(numeral?.toString()).toEqual('bVsus/bVII');
      });

      it('accepts a string key', () => {
        expect(Chord.parse('Dsus/F#')?.toNumeral('Ab').toString()).toEqual('bVsus/bVII');
      });
    });
  });
});
