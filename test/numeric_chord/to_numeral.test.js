import { Chord } from '../../src';

import '../matchers';

describe('Chord', () => {
  describe('numeric', () => {
    describe('toNumeral', () => {
      it('returns the numeral version', () => {
        const originalChord = new Chord({
          base: 6,
          modifier: '#',
          suffix: 'sus4',
          bassBase: '4',
          bassModifier: 'b',
        });

        const numeralChord = originalChord.toNumeral();

        expect(numeralChord).toBeChord({
          base: 'VI',
          modifier: '#',
          suffix: 'sus',
          bassBase: 'IV',
          bassModifier: 'b',
        });
      });
    });
  });
});
