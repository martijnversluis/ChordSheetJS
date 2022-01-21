import Chord from '../../src/chord';

import '../matchers';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('toChordSymbol', () => {
      describe('when the chord is already a chord symbol', () => {
        it('returns a clone of the chord', () => {
          const originalChord = new Chord({
            base: 'E',
            modifier: 'b',
            suffix: 'sus4',
            bassBase: 'G',
            bassModifier: '#',
          });

          const convertedChord = originalChord.toChordSymbol();

          expect(convertedChord).toBeChord({
            base: 'E',
            modifier: 'b',
            suffix: 'sus4',
            bassBase: 'G',
            bassModifier: '#',
          });

          expect(convertedChord).not.toBe(originalChord);
        });
      });
    });
  });
});
