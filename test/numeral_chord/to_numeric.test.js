import { Chord } from '../../src';

import '../matchers';

describe('Chord', () => {
  describe('numeral', () => {
    describe('toNumeric', () => {
      it('returns a numeric version of the chord', () => {
        const numeralChord = new Chord({
          base: 'III',
          modifier: '#',
          suffix: 'sus4',
          bassBase: 'V',
          bassModifier: 'b',
        });

        const numericChord = numeralChord.toNumeric();

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
