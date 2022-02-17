import { Chord } from '../../src';

import '../matchers';

describe('Chord', () => {
  describe('numeral', () => {
    describe('toNumeral', () => {
      it('returns a clone of the chord', () => {
        const originalChord = new Chord({
          base: 'iii',
          modifier: '#',
          suffix: 'sus4',
          bassBase: 'V',
          bassModifier: 'b',
        });

        const numeralChord = originalChord.toNumeral();
        expect(numeralChord).not.toBe(originalChord);

        expect(numeralChord).toBeChord({
          base: 'iii',
          modifier: '#',
          suffix: 'sus4',
          bassBase: 'V',
          bassModifier: 'b',
        });
      });
    });
  });
});
