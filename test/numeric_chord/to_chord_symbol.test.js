import Chord from '../../src/chord';

import '../matchers';
import { Key } from '../../src';

describe('Chord', () => {
  describe('numeric', () => {
    describe('toChordSymbol', () => {
      describe('for a numeric chord', () => {
        it('returns a chord symbol version', () => {
          const originalChord = new Chord({
            base: 5,
            modifier: 'b',
            suffix: 'sus4',
            bassBase: 7,
            bassModifier: '#',
          });

          const key = Key.parse('Ab');
          const convertedChord = originalChord.toChordSymbol(key);

          expect(convertedChord).toBeChord({
            base: 'D',
            modifier: null,
            suffix: 'sus4',
            bassBase: 'A',
            bassModifier: 'b',
          });

          expect(convertedChord).not.toBe(originalChord);
        });

        it('accepts a string key', () => {
          const originalChord = new Chord({
            base: 5,
            modifier: 'b',
            suffix: 'sus4',
            bassBase: 7,
            bassModifier: '#',
          });

          const convertedChord = originalChord.toChordSymbol('Ab');

          expect(convertedChord).toBeChord({
            base: 'D',
            modifier: null,
            suffix: 'sus4',
            bassBase: 'A',
            bassModifier: 'b',
          });

          expect(convertedChord).not.toBe(originalChord);
        });
      });
    });
  });
});
