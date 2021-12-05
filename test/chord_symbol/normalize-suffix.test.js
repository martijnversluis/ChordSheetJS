import { Chord } from '../../src/index';

import '../matchers';

describe('Chord', () => {
  describe('normalize suffix', () => {
    describe('chord without bass', () => {
      it('works when no suffix', () => {
        const chord = Chord.parse('E').toString();
        expect(chord).toBe('E');
      });

      it('normalizes a suffix', () => {
        const chord = Chord.parse('Esus4').toString();
        expect(chord).toBe('Esus');
      });

      it('normalizes a suffix when chord has a modifier', () => {
        const chord = Chord.parse('F#add13').toString();
        expect(chord).toBe('F#(13)');
      });

      it('normalizes a suffix with a bass', () => {
        const chord = Chord.parse('E13(+9+5)/B').toString();
        expect(chord).toBe('E13(#9#5)/B');
      });

      it('remove the suffix when the normalize should remove the suffix', () => {
        const chord = Chord.parse('EMajj').toString();
        expect(chord).toBe('E');
      });

      it('returns the suffix when it\'s not in the config', () => {
        const chord = Chord.parse('Enot-a-real-suffix/B#').toString();
        expect(chord).toBe('Enot-a-real-suffix/B#');
      });
    });
  });
});
