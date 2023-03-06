import Chord from '../../src/chord';

describe('Chord', () => {
  describe('transposeUp', () => {
    describe('for 1, 2, 4, 5 and 6', () => {
      it('returns the # version', () => {
        expect(Chord.parse('VI/V')?.transposeUp().toString()).toEqual('#VI/#V');
      });
    });

    describe('for #1, #2, #4, #5 and #6', () => {
      it('returns the next note without #', () => {
        expect(Chord.parse('#vi/#v')?.transposeUp().toString()).toEqual('vii/#vi');
      });
    });

    describe('for 3 and 7', () => {
      it('returns the next note', () => {
        expect(Chord.parse('iii/VII')?.transposeUp().toString()).toEqual('#iii/I');
      });
    });

    describe('for b2, b3, b5, b6 and b7', () => {
      it('returns the note without b', () => {
        expect(Chord.parse('bII/bIII')?.transposeUp().toString()).toEqual('II/III');
      });
    });

    describe('for b1 and b4', () => {
      it('returns the note without b', () => {
        expect(Chord.parse('bi/biv')?.transposeUp().toString()).toEqual('i/iv');
      });
    });

    describe('for #E and #B', () => {
      it('returns the next note with #', () => {
        expect(Chord.parse('#III/#VII')?.transposeUp().toString()).toEqual('#IV/#I');
      });
    });
  });
});
