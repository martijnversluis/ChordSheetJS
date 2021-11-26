import Chord from '../../src/chord';
import '../matchers';

describe('Chord', () => {
  describe('normalize', () => {
    it('normalizes #3', () => {
      const chord = new Chord({
        base: 3,
        modifier: '#',
        suffix: null,
        bassBase: 3,
        bassModifier: '#',
      });

      const normalizedChord = chord.normalize();
      expect(normalizedChord).toBeChord({
        base: 4, modifier: null, suffix: null, bassBase: 4, bassModifier: null,
      });
    });

    it('normalizes #7', () => {
      const chord = new Chord({
        base: '7',
        modifier: '#',
        suffix: null,
        bassBase: '7',
        bassModifier: '#',
      });

      const normalizedChord = chord.normalize();
      expect(normalizedChord).toBeChord({
        base: 1, modifier: null, suffix: null, bassBase: 1, bassModifier: null,
      });
    });

    it('normalizes b1', () => {
      const chord = new Chord({
        base: 1,
        modifier: 'b',
        suffix: null,
        bassBase: 1,
        bassModifier: 'b',
      });

      const normalizedChord = chord.normalize();
      expect(normalizedChord).toBeChord({
        base: 7, modifier: null, suffix: null, bassBase: 7, bassModifier: null,
      });
    });

    it('normalizes b4', () => {
      const chord = new Chord({
        base: 4,
        modifier: 'b',
        suffix: null,
        bassBase: 4,
        bassModifier: 'b',
      });

      const normalizedChord = chord.normalize();
      expect(normalizedChord).toBeChord({
        base: 3, modifier: null, suffix: null, bassBase: 3, bassModifier: null,
      });
    });
  });
});
