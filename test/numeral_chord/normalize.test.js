import Chord from '../../src/chord';
import '../matchers';

describe('Chord', () => {
  describe('numeral', () => {
    describe('normalize', () => {
      it('normalizes #3', () => {
        const chord = new Chord({
          base: 'iii',
          modifier: '#',
          suffix: null,
          bassBase: 'III',
          bassModifier: '#',
        });

        const normalizedChord = chord.normalize();
        expect(normalizedChord).toBeChord({
          base: 'iv', modifier: null, suffix: null, bassBase: 'IV', bassModifier: null,
        });
      });

      it('normalizes #7', () => {
        const chord = new Chord({
          base: 'vii',
          modifier: '#',
          suffix: null,
          bassBase: 'VII',
          bassModifier: '#',
        });

        const normalizedChord = chord.normalize();
        expect(normalizedChord).toBeChord({
          base: 'i', modifier: null, suffix: null, bassBase: 'I', bassModifier: null,
        });
      });

      it('normalizes b1', () => {
        const chord = new Chord({
          base: 'i',
          modifier: 'b',
          suffix: null,
          bassBase: 'I',
          bassModifier: 'b',
        });

        const normalizedChord = chord.normalize();
        expect(normalizedChord).toBeChord({
          base: 'vii', modifier: null, suffix: null, bassBase: 'VII', bassModifier: null,
        });
      });

      it('normalizes b4', () => {
        const chord = new Chord({
          base: 'iv',
          modifier: 'b',
          suffix: null,
          bassBase: 'IV',
          bassModifier: 'b',
        });

        const normalizedChord = chord.normalize();
        expect(normalizedChord).toBeChord({
          base: 'iii', modifier: null, suffix: null, bassBase: 'III', bassModifier: null,
        });
      });
    });
  });
});
