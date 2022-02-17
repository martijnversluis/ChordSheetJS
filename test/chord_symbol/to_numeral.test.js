import { Chord, Key } from '../../src';

import '../matchers';

describe('Chord', () => {
  describe('toNumeral', () => {
    describe('for a chord symbol', () => {
      it('returns a the numeral version', () => {
        const originalChord = new Chord({
          base: 'D',
          modifier: null,
          suffix: 'sus',
          bassBase: 'F',
          bassModifier: '#',
        });

        const key = Key.parse('Ab');
        const numeralChord = originalChord.toNumeral(key);

        expect(numeralChord).toBeChord({
          base: 'V',
          modifier: 'b',
          suffix: 'sus',
          bassBase: 'VII',
          bassModifier: 'b',
        });
      });

      it('accepts a string key', () => {
        const originalChord = new Chord({
          base: 'D',
          modifier: null,
          suffix: 'sus',
          bassBase: 'F',
          bassModifier: '#',
        });

        const numeralChord = originalChord.toNumeral('Ab');

        expect(numeralChord).toBeChord({
          base: 'V',
          modifier: 'b',
          suffix: 'sus',
          bassBase: 'VII',
          bassModifier: 'b',
        });
      });
    });
  });
});
