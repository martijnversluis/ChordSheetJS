import NumericChord from '../../src/numeric_chord';
import '../matchers';

describe('NumericChord', () => {
  describe('constructor', () => {
    it('assigns the right instance variables', () => {
      const chord = new NumericChord({
        base: 1,
        modifier: 'b',
        suffix: 'sus4',
        bassBase: 3,
        bassModifier: '#',
      });

      expect(chord).toBeChord(1, 'b', 'sus4', 3, '#');
    });
  });
});
