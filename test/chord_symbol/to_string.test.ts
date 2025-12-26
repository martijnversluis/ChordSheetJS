import Chord from '../../src/chord';
import { SYMBOL } from '../../src';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('toString', () => {
      it('returns the right string representation', () => {
        const chord = new Chord({
          base: 'E',
          accidental: 'b',
          suffix: 'sus',
          bassBase: 'G',
          bassAccidental: '#',
          chordType: SYMBOL,
        });

        expect(chord.toString()).toEqual('Ebsus/G#');
      });

      describe('without bass modifier', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'E',
            accidental: 'b',
            suffix: 'sus',
            bassBase: 'G',
            chordType: SYMBOL,
          });

          expect(chord.toString()).toEqual('Ebsus/G');
        });
      });

      describe('without bass note', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'E',
            accidental: 'b',
            suffix: 'sus',
            chordType: SYMBOL,
          });

          expect(chord.toString()).toEqual('Ebsus');
        });
      });

      describe('without modifier', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'E',
            suffix: 'sus',
            chordType: SYMBOL,
          });

          expect(chord.toString()).toEqual('Esus');
        });
      });

      describe('without suffix', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'E',
            accidental: 'b',
            chordType: SYMBOL,
          });

          expect(chord.toString()).toEqual('Eb');
        });
      });

      describe('with option unicodeModifer:true', () => {
        it('returns the right string representation with flat symbol', () => {
          const chord = new Chord({
            base: 'E',
            accidental: 'b',
            chordType: SYMBOL,
          });

          expect(chord.toString({ useUnicodeModifier: true })).toEqual('E♭');
        });

        it('returns the right string representation with sharp symbol', () => {
          const chord = new Chord({
            base: 'F',
            accidental: '#',
            chordType: SYMBOL,
          });

          expect(chord.toString({ useUnicodeModifier: true })).toEqual('F♯');
        });
      });
    });
  });
});
