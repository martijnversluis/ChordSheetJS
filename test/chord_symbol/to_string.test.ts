import Chord from '../../src/chord';
import { SYMBOL } from '../../src';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('toString', () => {
      it('returns the right string representation', () => {
        const chord = new Chord({
          base: 'E',
          modifier: 'b',
          suffix: 'sus',
          bassBase: 'G',
          bassModifier: '#',
          chordType: SYMBOL,
        });

        expect(chord.toString()).toEqual('Ebsus/G#');
      });

      describe('without bass modifier', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'E',
            modifier: 'b',
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
            modifier: 'b',
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
            modifier: 'b',
            chordType: SYMBOL,
          });

          expect(chord.toString()).toEqual('Eb');
        });
      });
    });
  });
});
