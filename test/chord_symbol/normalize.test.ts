import Chord from '../../src/chord';
import '../matchers';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('normalize', () => {
      it('normalizes E#', () => {
        const chord = new Chord({
          base: 'E',
          modifier: '#',
          suffix: null,
          bassBase: 'E',
          bassModifier: '#',
        });

        const normalizedChord = chord.normalize();
        expect(normalizedChord).toBeChord({
          base: 'F', modifier: null, suffix: null, bassBase: 'F', bassModifier: null,
        });
      });

      it('normalizes B#', () => {
        const chord = new Chord({
          base: 'B',
          modifier: '#',
          suffix: null,
          bassBase: 'B',
          bassModifier: '#',
        });

        const normalizedChord = chord.normalize();
        expect(normalizedChord).toBeChord({
          base: 'C', modifier: null, suffix: null, bassBase: 'C', bassModifier: null,
        });
      });

      it('normalizes Cb', () => {
        const chord = new Chord({
          base: 'C',
          modifier: 'b',
          suffix: null,
          bassBase: 'C',
          bassModifier: 'b',
        });

        const normalizedChord = chord.normalize();
        expect(normalizedChord).toBeChord({
          base: 'B', modifier: null, suffix: null, bassBase: 'B', bassModifier: null,
        });
      });

      it('normalizes Fb', () => {
        const chord = new Chord({
          base: 'F',
          modifier: 'b',
          suffix: null,
          bassBase: 'F',
          bassModifier: 'b',
        });

        const normalizedChord = chord.normalize();
        expect(normalizedChord).toBeChord({
          base: 'E', modifier: null, suffix: null, bassBase: 'E', bassModifier: null,
        });
      });

      it('normalizes Em/A#', () => {
        const chord = new Chord({
          base: 'E',
          modifier: '',
          suffix: 'm',
          bassBase: 'A',
          bassModifier: '#',
        });

        const normalizedChord = chord.normalize();
        expect(normalizedChord).toBeChord({
          base: 'E', modifier: null, suffix: 'm', bassBase: 'B', bassModifier: 'b',
        });
      });

      it('normalizes D/F#', () => {
        const chord = new Chord({
          base: 'D',
          modifier: null,
          suffix: null,
          bassBase: 'F',
          bassModifier: '#',
        });

        const normalizedChord = chord.normalize();
        expect(normalizedChord).toBeChord({
          base: 'D', modifier: null, suffix: null, bassBase: 'F', bassModifier: '#',
        });
      });
    });
  });
});
