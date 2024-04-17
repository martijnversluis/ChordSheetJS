import Chord from '../../src/chord';

describe('Chord', () => {
  describe('chord solfege', () => {
    describe('transposeUp', () => {
      describe('for Do, Re, Fa, Sol and La', () => {
        it('returns the # version', () => {
          expect(Chord.parse('La/Sol')?.transposeUp().toString()).toEqual('La#/Sol#');
        });
      });

      describe('for Do#, Re#, Fa#, Sol# and La#', () => {
        it('returns the next note without #', () => {
          expect(Chord.parse('La#/Sol#')?.transposeUp().toString()).toEqual('Si/La');
        });
      });

      describe('for Mi and Si', () => {
        it('returns the next note', () => {
          expect(Chord.parse('Mi/Si')?.transposeUp().toString()).toEqual('Fa/Do');
        });
      });

      describe('for Reb, Mib, Solb, Lab and Sib', () => {
        it('returns the note without b', () => {
          expect(Chord.parse('Reb/Mib')?.transposeUp().toString()).toEqual('Re/Mi');
        });
      });

      describe('for Dob and Fab', () => {
        it('returns the note without b', () => {
          expect(Chord.parse('Dob/Fab')?.transposeUp().toString()).toEqual('Do/Fa');
        });
      });

      describe('for Mi# and Si#', () => {
        it('returns the next note with #', () => {
          expect(Chord.parse('Mi#/Si#')?.transposeUp().toString()).toEqual('Fa#/Do#');
        });
      });
    });
  });
});
