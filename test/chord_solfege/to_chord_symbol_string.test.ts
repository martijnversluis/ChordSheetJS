import Chord from '../../src/chord';

describe('Chord', () => {
  describe('chord solfege', () => {
    describe('toChordSolfegeString', () => {
      describe('for a chord solfege', () => {
        it('converts correctly to a string', () => {
          expect(Chord.parse('Mibsus/Sol#')?.toChordSolfegeString()).toEqual('Mibsus/Sol#');
        });

        it('converts correctly minor chord to a string', () => {
          expect(Chord.parse('Solm7/Do')?.toChordSolfegeString()).toEqual('Solm7/Do');
        });
      });
    });
  });
});
