import Chord from '../../src/chord';
import '../matchers';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('transpose', () => {
      describe('when delta > 0', () => {
        it('transposes up', () => {
          const chord = new Chord({
            base: 'D',
            modifier: 'b',
            suffix: null,
            bassBase: 'A',
            bassModifier: '#',
          });

          const transposedChord = chord.transpose(5);
          expect(transposedChord).toBeChord({
            base: 'G', modifier: 'b', suffix: null, bassBase: 'D', bassModifier: '#',
          });
        });
      });

      describe('when delta < 0', () => {
        it('transposes down', () => {
          const chord = new Chord({
            base: 'A',
            modifier: '#',
            suffix: null,
            bassBase: 'B',
            bassModifier: 'b',
          });

          const transposedChord = chord.transpose(-4);
          expect(transposedChord).toBeChord({
            base: 'F', modifier: '#', suffix: null, bassBase: 'G', bassModifier: 'b',
          });
        });
      });

      describe('when delta = 0', () => {
        it('does not change the chord', () => {
          const chord = new Chord({
            base: 'B',
            modifier: '#',
            suffix: null,
            bassBase: 'C',
            bassModifier: 'b',
          });

          const transposedChord = chord.transpose(0);
          expect(transposedChord).toBeChord({
            base: 'B', modifier: '#', suffix: null, bassBase: 'C', bassModifier: 'b',
          });
        });
      });
    });
  });
});
