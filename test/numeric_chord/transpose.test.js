import Chord from '../../src/chord';
import '../matchers';

describe('Chord', () => {
  describe('numeric', () => {
    describe('transpose', () => {
      describe('when delta > 0', () => {
        it('transposes up', () => {
          const chord = new Chord({
            base: 2,
            modifier: 'b',
            suffix: null,
            bassBase: 6,
            bassModifier: '#',
          });

          const transposedChord = chord.transpose(5);
          expect(transposedChord).toBeChord({
            base: 5, modifier: 'b', suffix: null, bassBase: 2, bassModifier: '#',
          });
        });
      });

      describe('when delta < 0', () => {
        it('transposes down', () => {
          const chord = new Chord({
            base: 6,
            modifier: '#',
            suffix: null,
            bassBase: 7,
            bassModifier: 'b',
          });

          const transposedChord = chord.transpose(-4);
          expect(transposedChord).toBeChord({
            base: 4, modifier: '#', suffix: null, bassBase: 5, bassModifier: 'b',
          });
        });
      });

      describe('when delta = 0', () => {
        it('does not change the chord', () => {
          const chord = new Chord({
            base: 7,
            modifier: '#',
            suffix: null,
            bassBase: 1,
            bassModifier: 'b',
          });

          const transposedChord = chord.transpose(0);
          expect(transposedChord).toBeChord({
            base: 7, modifier: '#', suffix: null, bassBase: 1, bassModifier: 'b',
          });
        });
      });
    });
  });
});
