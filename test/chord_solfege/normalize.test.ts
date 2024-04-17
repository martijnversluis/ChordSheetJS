import Chord from '../../src/chord';

describe('Chord', () => {
  describe('chord solfege', () => {
    describe('normalize', () => {
      it('normalizes Mi#', () => {
        expect(Chord.parse('Mi#/Mi#')?.normalize().toString()).toEqual('Fa/Fa');
      });

      it('normalizes Si#', () => {
        expect(Chord.parse('Si#/Si#')?.normalize().toString()).toEqual('Do/Do');
      });

      it('normalizes Dob', () => {
        expect(Chord.parse('Dob/Dob')?.normalize().toString()).toEqual('Si/Si');
      });

      it('normalizes Fab', () => {
        expect(Chord.parse('Fab/Fab')?.normalize().toString()).toEqual('Mi/Mi');
      });

      it('normalizes Mim/La#', () => {
        expect(Chord.parse('Mim/La#')?.normalize().toString()).toEqual('Mim/Sib');
      });

      it('normalizes Re/Fa#', () => {
        expect(Chord.parse('Re/Fa#')?.normalize().toString()).toEqual('Re/Fa#');
      });
    });
  });
});
