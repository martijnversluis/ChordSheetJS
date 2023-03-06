import Chord from '../../src/chord';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('transpose', () => {
      describe('when delta > 0', () => {
        it('transposes up', () => {
          expect(Chord.parse('Db/A#')?.transpose(5).toString()).toEqual('Gb/D#');
        });
      });

      describe('when delta < 0', () => {
        it('transposes down', () => {
          expect(Chord.parse('A#/Bb')?.transpose(-4).toString()).toEqual('F#/Gb');
        });
      });

      describe('when delta = 0', () => {
        it('does not change the chord', () => {
          const chord = Chord.parse('B#/Cb');
          expect(chord?.transpose(0)).toEqual(chord);
        });
      });
    });
  });
});
