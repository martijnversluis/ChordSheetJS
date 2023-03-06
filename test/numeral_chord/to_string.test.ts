import Chord from '../../src/chord';

describe('Chord', () => {
  describe('numeral', () => {
    describe('toString', () => {
      describe('with bass note', () => {
        it('returns the right string representation', () => {
          expect(Chord.parse('bisus/#III')?.toNumeralString()).toEqual('bisus/#III');
        });

        describe('without bass modifier', () => {
          it('returns the right string representation', () => {
            expect(Chord.parse('bIsus/iii')?.toNumeralString()).toEqual('bIsus/iii');
          });
        });
      });

      describe('without bass note', () => {
        it('returns the right string representation', () => {
          expect(Chord.parse('bIsus')?.toNumeralString()).toEqual('bIsus');
        });
      });

      describe('without modifier', () => {
        it('returns the right string representation', () => {
          expect(Chord.parse('Isus')?.toNumeralString()).toEqual('Isus');
        });
      });

      describe('without suffix', () => {
        it('returns the right string representation', () => {
          expect(Chord.parse('bI')?.toNumeralString()).toEqual('bI');
        });
      });
    });
  });
});
