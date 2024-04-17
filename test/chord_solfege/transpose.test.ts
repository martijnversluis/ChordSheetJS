import Chord from '../../src/chord';

describe('Chord', () => {
  describe('chord solfege', () => {
    describe('transpose', () => {
      describe('when delta > 0', () => {
        it('transposes up', () => {
          expect(Chord.parse('Reb/La#')?.transpose(5).toString()).toEqual('Solb/Re#');
        });
      });

      describe('when delta < 0', () => {
        it('transposes down', () => {
          expect(Chord.parse('La#/Sib')?.transpose(-4).toString()).toEqual('Fa#/Solb');
        });
      });

      describe('when delta = 0', () => {
        it('does not change the chord', () => {
          const chord = Chord.parse('Si#/Dob');
          expect(chord?.transpose(0)).toEqual(chord);
        });
      });
    });
  });
});
