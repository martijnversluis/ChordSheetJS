import Chord from '../../src/chord';
import '../matchers';

describe('Chord', () => {
  describe('clone', () => {
    it('assigns the right instance variables', () => {
      const chord = new Chord({
        base: 'i',
        modifier: 'b',
        suffix: 'sus',
        bassBase: 'IV',
        bassModifier: '#',
      });

      const clonedChord = chord.clone();
      expect(clonedChord).toBeChord({
        base: 'i', modifier: 'b', suffix: 'sus', bassBase: 'IV', bassModifier: '#',
      });
    });
  });
});
