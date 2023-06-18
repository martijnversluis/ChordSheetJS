import Chord from '../../src/chord';

describe('Chord', () => {
  describe('numeric', () => {
    describe('toString', () => {
      describe('with bass note', () => {
        it('returns the right string representation', () => {
          expect(Chord.parse('b1sus/#3')?.toNumericString()).toEqual('b1sus/#3');
        });

        describe('without bass modifier', () => {
          it('returns the right string representation', () => {
            expect(Chord.parse('b1sus/3')?.toNumericString()).toEqual('b1sus/3');
          });
        });
      });

      describe('without bass note', () => {
        it('returns the right string representation', () => {
          expect(Chord.parse('b1sus')?.toNumericString()).toEqual('b1sus');
        });
      });

      describe('without modifier', () => {
        it('returns the right string representation', () => {
          expect(Chord.parse('1sus')?.toNumericString()).toEqual('1sus');
        });
      });

      describe('without suffix', () => {
        it('returns the right string representation', () => {
          expect(Chord.parse('b1')?.toNumericString()).toEqual('b1');
        });
      });
    });
  });
});
