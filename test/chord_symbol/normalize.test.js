import ChordSymbol from '../../src/chord_symbol';
import '../matchers';

describe('ChordSymbol', () => {
  describe('normalize', () => {
    it('normalizes E#', () => {
      const chord = new ChordSymbol({
        base: 'E',
        modifier: '#',
        suffix: null,
        bassBase: 'E',
        bassModifier: '#',
      });

      const normalizedChord = chord.normalize();
      expect(normalizedChord).toBeChord('F', null, null, 'F', null);
    });

    it('normalizes B#', () => {
      const chord = new ChordSymbol({
        base: 'B',
        modifier: '#',
        suffix: null,
        bassBase: 'B',
        bassModifier: '#',
      });

      const normalizedChord = chord.normalize();
      expect(normalizedChord).toBeChord('C', null, null, 'C', null);
    });

    it('normalizes Cb', () => {
      const chord = new ChordSymbol({
        base: 'C',
        modifier: 'b',
        suffix: null,
        bassBase: 'C',
        bassModifier: 'b',
      });

      const normalizedChord = chord.normalize();
      expect(normalizedChord).toBeChord('B', null, null, 'B', null);
    });

    it('normalizes Fb', () => {
      const chord = new ChordSymbol({
        base: 'F',
        modifier: 'b',
        suffix: null,
        bassBase: 'F',
        bassModifier: 'b',
      });

      const normalizedChord = chord.normalize();
      expect(normalizedChord).toBeChord('E', null, null, 'E', null);
    });
  });
});
