import NumericChord from '../../src/numeric_chord';
import '../matchers';

describe('NumericChord', () => {
  describe('transposeUp', () => {
    it('is a noop', () => {
      const chord = new NumericChord({
        base: '3',
        modifier: '#',
        suffix: null,
        bassBase: '4',
        bassModifier: 'b',
      });

      const transposedChord = chord.transposeDown();
      expect(transposedChord).toBeChord(3, '#', null, 4, 'b');
    });
  });
});
