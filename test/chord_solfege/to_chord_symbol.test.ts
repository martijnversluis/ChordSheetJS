import Chord from '../../src/chord';
import { SOLFEGE } from '../../src';

describe('Chord', () => {
  describe('chord solfege', () => {
    describe('toChordSolfege', () => {
      it('returns a clone of the chord', () => {
        const originalChord = new Chord({
          base: 'Mi',
          modifier: 'b',
          suffix: 'sus',
          bassBase: 'Sol',
          bassModifier: '#',
          chordType: SOLFEGE,
        });

        const convertedChord = originalChord.toChordSolfege();

        expect(convertedChord.equals(originalChord)).toBeTruthy();
        expect(convertedChord).not.toBe(originalChord);
      });
    });
  });
});
