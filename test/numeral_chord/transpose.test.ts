import Chord from '../../src/chord';

describe('Chord', () => {
  describe('transpose', () => {
    describe('when delta > 0', () => {
      it('transposes up', () => {
        expect(Chord.parse('bII/#VI')?.transpose(5).toString()).toEqual('bV/#II');
      });
    });

    describe('when delta < 0', () => {
      it('transposes down', () => {
        expect(Chord.parse('#VI/bvii')?.transpose(-4).toString()).toEqual('#IV/iv');
      });
    });

    describe('when delta = 0', () => {
      it('does not change the chord', () => {
        const chord = Chord.parse('#vii/bI');
        expect(chord?.transpose(0)).toEqual(chord);
      });
    });
  });
});
