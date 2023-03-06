import Chord from '../../src/chord';

describe('Chord', () => {
  describe('numeric', () => {
    describe('transposeUp', () => {
      describe('for 2, 3, 5, 6, 7', () => {
        it('returns the b version', () => {
          expect(Chord.parse('6/5')?.transposeDown().toString()).toEqual('b6/b5');
        });
      });

      describe('for #1, #2, #4, #5 and #6', () => {
        it('returns the note without #', () => {
          expect(Chord.parse('#6/#5')?.transposeDown().toString()).toEqual('6/5');
        });
      });

      describe('for 4 and 1', () => {
        it('returns the previous note', () => {
          expect(Chord.parse('4/1')?.transposeDown().toString()).toEqual('3/7');
        });
      });

      describe('for b2, b3, b5, b6 and b7', () => {
        it('returns the previous note without b', () => {
          expect(Chord.parse('b2/b3')?.transposeDown().toString()).toEqual('1/2');
        });
      });

      describe('for #7 and #3', () => {
        it('returns the note without #', () => {
          expect(Chord.parse('#7/#3')?.transposeDown().toString()).toEqual('7/3');
        });
      });

      describe('for b4 and b1', () => {
        it('returns the previous note with b', () => {
          expect(Chord.parse('b4/b1')?.transposeDown().toString()).toEqual('b3/b7');
        });
      });
    });
  });
});
