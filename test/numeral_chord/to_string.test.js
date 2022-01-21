import Chord from '../../src/chord';

describe('Chord', () => {
  describe('numeral', () => {
    describe('toString', () => {
      describe('with bass note', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'i',
            modifier: 'b',
            suffix: 'sus4',
            bassBase: 'III',
            bassModifier: '#',
          });

          expect(chord.toNumeralString()).toEqual('bisus4/#III');
        });

        describe('without bass modifier', () => {
          it('returns the right string representation', () => {
            const chord = new Chord({
              base: 'I',
              modifier: 'b',
              suffix: 'sus4',
              bassBase: 'iii',
            });

            expect(chord.toNumeralString()).toEqual('bIsus4/iii');
          });
        });
      });

      describe('without bass note', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'I',
            modifier: 'b',
            suffix: 'sus4',
          });

          expect(chord.toNumeralString()).toEqual('bIsus4');
        });
      });

      describe('without modifier', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'I',
            suffix: 'sus4',
          });

          expect(chord.toNumeralString()).toEqual('Isus4');
        });
      });

      describe('without suffix', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'I',
            modifier: 'b',
          });

          expect(chord.toNumeralString()).toEqual('bI');
        });
      });
    });
  });
});
