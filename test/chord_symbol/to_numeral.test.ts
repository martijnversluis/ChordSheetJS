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

        const key = Key.parseOrFail('Ab');
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

      it('supports a minor chord', () => {
        const originalChord = new Chord({
          base: 'G',
          modifier: null,
          suffix: 'm',
        });

        const numericChord = originalChord.toNumeric('Bb');

        expect(numericChord).toBeChord({
          base: 'vi',
          modifier: null,
          suffix: null,
          bassBase: null,
          bassModifier: null,
        });
      });
    });
  });
});
