import Chord from '../../src/chord';
import { SOLFEGE } from '../../src';

describe('Chord', () => {
  describe('chord solfege', () => {
    describe('toString', () => {
      it('returns the right string representation', () => {
        const chord = new Chord({
          base: 'Mi',
          accidental: 'b',
          suffix: 'sus',
          bassBase: 'Sol',
          bassAccidental: '#',
          chordType: SOLFEGE,
        });

        expect(chord.toString()).toEqual('Mibsus/Sol#');
      });

      describe('without bass modifier', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'Mi',
            accidental: 'b',
            suffix: 'sus',
            bassBase: 'Sol',
            chordType: SOLFEGE,
          });

          expect(chord.toString()).toEqual('Mibsus/Sol');
        });
      });

      describe('without bass note', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'Mi',
            accidental: 'b',
            suffix: 'sus',
            chordType: SOLFEGE,
          });

          expect(chord.toString()).toEqual('Mibsus');
        });
      });

      describe('without modifier', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'Mi',
            suffix: 'sus',
            chordType: SOLFEGE,
          });

          expect(chord.toString()).toEqual('Misus');
        });
      });

      describe('without suffix', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'Mi',
            accidental: 'b',
            chordType: SOLFEGE,
          });

          expect(chord.toString()).toEqual('Mib');
        });
      });

      describe('with option unicodeModifer:true', () => {
        it('returns the right string representation with flat solfege', () => {
          const chord = new Chord({
            base: 'Mi',
            accidental: 'b',
            chordType: SOLFEGE,
          });

          expect(chord.toString({ useUnicodeModifier: true })).toEqual('Mi♭');
        });

        it('returns the right string representation with sharp symbol', () => {
          const chord = new Chord({
            base: 'Fa',
            accidental: '#',
            chordType: SOLFEGE,
          });

          expect(chord.toString({ useUnicodeModifier: true })).toEqual('Fa♯');
        });
      });
    });
  });
});
