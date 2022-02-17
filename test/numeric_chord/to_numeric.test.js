import { Chord } from '../../src';

import '../matchers';

describe('Chord', () => {
  describe('numeric', () => {
    describe('toNumeric', () => {
      it('returns a clone of the chord', () => {
        const originalChord = new Chord({
          base: 3,
          modifier: '#',
          suffix: 'sus',
          bassBase: 5,
          bassModifier: 'b',
        });

        const numericChord = originalChord.toNumeric();
        expect(numericChord).not.toBe(originalChord);

        expect(numericChord).toBeChord({
          base: 3,
          modifier: '#',
          suffix: 'sus',
          bassBase: 5,
          bassModifier: 'b',
        });
      });
    });
  });
});
