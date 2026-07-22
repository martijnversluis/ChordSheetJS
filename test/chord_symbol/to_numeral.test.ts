import '../util/matchers';

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

      it('supports a minor chord', () => {
        expect(Chord.parse('Gm')?.toNumeral('Bb').toString()).toEqual('vi');
      });

      it('lowercases the numeral and drops the m suffix for any minor chord', () => {
        expect(Chord.parse('Am')?.toNumeral('C').toString()).toEqual('vi');
        expect(Chord.parse('Dm')?.toNumeral('C').toString()).toEqual('ii');
        expect(Chord.parse('Em')?.toNumeral('C').toString()).toEqual('iii');
      });

      it('preserves extensions beyond the minor indicator', () => {
        expect(Chord.parse('Am7')?.toNumeral('C').toString()).toEqual('vi7');
        expect(Chord.parse('Dm9')?.toNumeral('C').toString()).toEqual('ii9');
      });

      it('does not lowercase major chords with maj suffix', () => {
        expect(Chord.parse('Cmaj7')?.toNumeral('C').toString()).toEqual('Ima7');
      });

      it('lowercases the root but keeps the bass uppercase', () => {
        expect(Chord.parse('Am/E')?.toNumeral('C').toString()).toEqual('vi/III');
      });
    });
  });
});
