import Chord from '../../src/chord';

describe('Chord', () => {
  describe('transposeUp', () => {
    describe('for 2, 3, 5, 6, 7', () => {
      it('returns the b version', () => {
        expect(Chord.parse('VI/V')?.transposeDown().toString()).toEqual('bVI/bV');
      });
    });

    describe('for #1, #2, #4, #5 and #6', () => {
      it('returns the note without #', () => {
        expect(Chord.parse('#vi/#v')?.transposeDown().toString()).toEqual('vi/v');
      });
    });

    describe('for 4 and 1', () => {
      it('returns the previous note', () => {
        expect(Chord.parse('iv/I')?.transposeDown().toString()).toEqual('biv/VII');
      });
    });

    describe('for b2, b3, b5, b6 and b7', () => {
      it('returns the previous note without b', () => {
        expect(Chord.parse('bII/bIII')?.transposeDown().toString()).toEqual('I/II');
      });
    });

    describe('for #7 and #3', () => {
      it('returns the note without #', () => {
        expect(Chord.parse('#VII/#III')?.transposeDown().toString()).toEqual('VII/III');
      });
    });

    describe('for b4 and b1', () => {
      it('returns the previous note with b', () => {
        expect(Chord.parse('bIV/bI')?.transposeDown().toString()).toEqual('bIII/bVII');
      });
    });
  });
});
