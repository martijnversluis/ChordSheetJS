import Chord from '../../src/chord';
import '../matchers';
import { Key } from '../../src';

describe('Chord', () => {
  describe('numeral', () => {
    describe('toChordSymbol', () => {
      it('returns a chord symbol version', () => {
        const originalChord = new Chord({
          base: 'V',
          modifier: 'b',
          suffix: 'sus',
          bassBase: 'VII',
          bassModifier: '#',
        });

        const key = Key.parse('Ab');
        const convertedChord = originalChord.toChordSymbol(key);

        expect(convertedChord).toBeChord({
          base: 'D',
          modifier: null,
          suffix: 'sus',
          bassBase: 'G',
          bassModifier: '#',
        });

        expect(convertedChord).not.toBe(originalChord);
      });

      it('accepts a string key', () => {
        const originalChord = new Chord({
          base: 'V',
          modifier: 'b',
          suffix: 'sus',
          bassBase: 'VII',
          bassModifier: '#',
        });

        const convertedChord = originalChord.toChordSymbol('Ab');

        expect(convertedChord).toBeChord({
          base: 'D',
          modifier: null,
          suffix: 'sus',
          bassBase: 'G',
          bassModifier: '#',
        });

        expect(convertedChord).not.toBe(originalChord);
      });
    });
  });
});
