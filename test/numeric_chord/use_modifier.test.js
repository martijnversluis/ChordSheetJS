import NumericChord from '../../src/numeric_chord';
import '../matchers';

describe('NumericChord', () => {
  describe('useModifier', () => {
    it('is a noop', () => {
      const chord = new NumericChord({
        base: '3',
        modifier: '#',
        suffix: null,
        bassBase: '4',
        bassModifier: 'b',
      });

      const switchedChord = chord.useModifier('b');
      expect(switchedChord).toBeChord(3, '#', null, 4, 'b');
    });
  });
});
