import Chord from '../../src/chord';

describe('Chord', () => {
  describe('numeric', () => {
    describe('transposeUp', () => {
      describe('for 1, 2, 4, 5 and 6', () => {
        it('returns the # version', () => {
          expect(Chord.parse('6/5')?.transposeUp().toString()).toEqual('#6/#5');
        });
      });

      describe('for #1, #2, #4, #5 and #6', () => {
        it('returns the next note without #', () => {
          expect(Chord.parse('#6/#5')?.transposeUp().toString()).toEqual('7/6');
        });
      });

      describe('for 3 and 7', () => {
        it('returns the next note', () => {
          expect(Chord.parse('3/7')?.transposeUp().toString()).toEqual('4/1');
        });
      });

      describe('for b2, b3, b5, b6 and b7', () => {
        it('returns the note without b', () => {
          expect(Chord.parse('b2/b3')?.transposeUp().toString()).toEqual('2/3');
        });
      });

      describe('for b1 and b4', () => {
        it('returns the note without b', () => {
          expect(Chord.parse('b1/b4')?.transposeUp().toString()).toEqual('1/4');
        });
      });

      describe('for #E and #B', () => {
        it('returns the next note with #', () => {
          expect(Chord.parse('#3/#7')?.transposeUp().toString()).toEqual('#4/#1');
        });
      });
    });
  });
});
