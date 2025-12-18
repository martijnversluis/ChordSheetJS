import '../util/matchers';

import { Chord, Key } from '../../src';

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

      it('renders minor key in the numbers of relative major', () => {
        expect(Chord.parse('Em')?.toNumeric('Em').toString()).toEqual('6m');
      });

      it('properly handles 6m with minor key', () => {
        expect(Chord.parse('Em')?.toNumeric('Em').toString()).toEqual('6m');
        expect(Chord.parse('6m')?.toNumeric('Em').toString()).toEqual('6m');
        expect(Chord.parse('6m')?.toChordSymbol('Em').toString()).toEqual('Em');
      });

      it('properly handles #6m & b7m with minor key', () => {
        expect(Chord.parse('Fm')?.toNumeric('Em').toString()).toEqual('b7m');
        expect(Chord.parse('b7m')?.toNumeric('Em').toString()).toEqual('b7m');
        expect(Chord.parse('b7m')?.toChordSymbol('Em').toString()).toEqual('Fm');
        expect(Chord.parse('#6m')?.toChordSymbol('Em').toString()).toEqual('Fm');
      });

      it('properly handles 4 with minor key', () => {
        expect(Chord.parse('C')?.toNumeric('Em').toString()).toEqual('4');
        expect(Chord.parse('4')?.toNumeric('Em').toString()).toEqual('4');
        expect(Chord.parse('4')?.toChordSymbol('Em').toString()).toEqual('C');
      });

      it('properly handles b3 with minor key', () => {
        expect(Chord.parse('Bb')?.toNumeric('G').toString()).toEqual('b3');
      });
    });
  });
});
