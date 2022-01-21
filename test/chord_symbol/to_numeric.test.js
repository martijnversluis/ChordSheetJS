import { Chord, Key } from '../../src';

import '../matchers';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('toNumeric', () => {
      describe('for a chord symbol', () => {
        it('returns a the numeric version', () => {
          const originalChord = new Chord({
            base: 'D',
            modifier: null,
            suffix: 'sus4',
            bassBase: 'F',
            bassModifier: '#',
          });

          const key = Key.parse('Ab');
          const numericChord = originalChord.toNumeric(key);

          expect(numericChord).toBeChord({
            base: 5,
            modifier: 'b',
            suffix: 'sus4',
            bassBase: 7,
            bassModifier: 'b',
          });
        });

        it('accepts a string key', () => {
          const originalChord = new Chord({
            base: 'D',
            modifier: null,
            suffix: 'sus4',
            bassBase: 'F',
            bassModifier: '#',
          });

          const numericChord = originalChord.toNumeric('Ab');

          expect(numericChord).toBeChord({
            base: 5,
            modifier: 'b',
            suffix: 'sus4',
            bassBase: 7,
            bassModifier: 'b',
          });
        });
      });
    });
  });
});
