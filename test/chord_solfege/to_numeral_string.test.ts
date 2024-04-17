import { Chord, Key } from '../../src';
import '../matchers';

describe('Chord', () => {
  describe('toNumeral', () => {
    describe('for a chord solfege', () => {
      it('returns a the numeral version', () => {
        const key = Key.parseOrFail('Lab');
        const parsedChord = Chord.parse('Resus/Fa#');
        const numeral = parsedChord?.toNumeral(key);

        expect(numeral?.toString()).toEqual('bVsus/bVII');
      });

      it('accepts a string key', () => {
        expect(Chord.parse('Resus/Fa#')?.toNumeral('Ab').toString()).toEqual('bVsus/bVII');
      });
    });
  });
});
