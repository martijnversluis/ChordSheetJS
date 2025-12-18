import '../util/matchers';

import { Chord, Key } from '../../src';

describe('Chord', () => {
  describe('chord solfege', () => {
    describe('toNumeric', () => {
      it('returns a the numeric version', () => {
        const key = Key.parse('Lab');
        expect(Chord.parse('Resus/Fa#')?.toNumeric(key).toString()).toEqual('b5sus/b7');
      });

      it('accepts a string key', () => {
        expect(Chord.parse('Resus/Fa#')?.toNumeric('Lab').toString()).toEqual('b5sus/b7');
      });

      it.skip('supports a minor chord', () => {
        expect(Chord.parse('Solm')?.toNumeric('Sib')?.toString()).toEqual('6');
      });
    });
  });
});
