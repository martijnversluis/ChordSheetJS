import { Chord, NUMERIC } from '../../src';

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
          chordType: NUMERIC,
        });

        const numericChord = originalChord.toNumeric();

        expect(numericChord.equals(originalChord)).toBeTruthy();
        expect(numericChord).not.toBe(originalChord);
      });
    });
  });
});
