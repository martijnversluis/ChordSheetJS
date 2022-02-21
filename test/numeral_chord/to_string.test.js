import Chord from '../../src/chord';

describe('Chord', () => {
  describe('numeral', () => {
    describe('toString', () => {
      describe('with bass note', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'i',
            modifier: 'b',
            suffix: 'sus',
            bassBase: 'III',
            bassModifier: '#',
          });

          expect(chord.toNumeralString()).toEqual('bisus/#III');
        });

        describe('without bass modifier', () => {
          it('returns the right string representation', () => {
            const chord = new Chord({
              base: 'I',
              modifier: 'b',
              suffix: 'sus',
              bassBase: 'iii',
            });

            expect(chord.toNumeralString()).toEqual('bIsus/iii');
          });
        });
      });

      describe('without bass note', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'I',
            modifier: 'b',
            suffix: 'sus',
          });

          expect(chord.toNumeralString()).toEqual('bIsus');
        });
      });

      describe('without modifier', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'I',
            suffix: 'sus',
          });

          expect(chord.toNumeralString()).toEqual('Isus');
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
