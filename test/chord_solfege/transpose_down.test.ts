import Chord from '../../src/chord';

describe('Chord', () => {
  describe('chord solfege', () => {
    describe('transposeUp', () => {
      describe('for Re, Mi, Sol, La, Si', () => {
        it('returns the b version', () => {
          expect(Chord.parse('La/Sol')?.transposeDown().toString()).toEqual('Lab/Solb');
        });
      });

      describe('for Do#, Re#, Fa#, Sol# and La#', () => {
        it('returns the note without #', () => {
          expect(Chord.parse('La#/Sol#')?.transposeDown().toString()).toEqual('La/Sol');
        });
      });

      describe('for Fa and Do', () => {
        it('returns the previous note', () => {
          expect(Chord.parse('Fa/Do')?.transposeDown().toString()).toEqual('Mi/Si');
        });
      });

      describe('for Reb, Mib, Solb, Lab and Sib', () => {
        it('returns the previous note without b', () => {
          expect(Chord.parse('Reb/Mib')?.transposeDown().toString()).toEqual('Do/Re');
        });
      });

      describe('for Si# and Mi#', () => {
        it('returns the note without #', () => {
          expect(Chord.parse('Si#/Mi#')?.transposeDown().toString()).toEqual('Si/Mi');
        });
      });

      describe('for Fab and Dob', () => {
        it('returns the previous note with b', () => {
          expect(Chord.parse('Fab/Dob')?.transposeDown().toString()).toEqual('Mib/Sib');
        });
      });
    });
  });
});
