import Chord from '../../src/chord';
import { SYMBOL } from '../../src';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('toChordSymbol', () => {
      it('returns a clone of the chord', () => {
        const originalChord = new Chord({
          base: 'E',
          modifier: 'b',
          suffix: 'sus',
          bassBase: 'G',
          bassModifier: '#',
          chordType: SYMBOL,
        });

        const convertedChord = originalChord.toChordSymbol();

        expect(convertedChord.equals(originalChord)).toBeTruthy();
        expect(convertedChord).not.toBe(originalChord);
      });
    });
  });
});
