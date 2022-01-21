import Chord from '../../src/chord';
import '../matchers';

describe('Chord', () => {
  describe('transpose', () => {
    describe('when delta > 0', () => {
      it('transposes up', () => {
        const chord = new Chord({
          base: 'II',
          modifier: 'b',
          suffix: null,
          bassBase: 'VI',
          bassModifier: '#',
        });

        const transposedChord = chord.transpose(5);
        expect(transposedChord).toBeChord({
          base: 'V', modifier: 'b', suffix: null, bassBase: 'II', bassModifier: '#',
        });
      });
    });

    describe('when delta < 0', () => {
      it('transposes down', () => {
        const chord = new Chord({
          base: 'VI',
          modifier: '#',
          suffix: null,
          bassBase: 'vii',
          bassModifier: 'b',
        });

        const transposedChord = chord.transpose(-4);
        expect(transposedChord).toBeChord({
          base: 'IV', modifier: '#', suffix: null, bassBase: 'v', bassModifier: 'b',
        });
      });
    });

    describe('when delta = 0', () => {
      it('does not change the chord', () => {
        const chord = new Chord({
          base: 'vii',
          modifier: '#',
          suffix: null,
          bassBase: 'I',
          bassModifier: 'b',
        });

        const transposedChord = chord.transpose(0);
        expect(transposedChord).toBeChord({
          base: 'vii', modifier: '#', suffix: null, bassBase: 'I', bassModifier: 'b',
        });
      });
    });
  });
});
