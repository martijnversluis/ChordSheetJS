import { Chord } from '../../src';
import '../matchers';

describe('Chord', () => {
  describe('normalize suffix', () => {
    describe('chord without bass', () => {
      it('works when no suffix', () => {
        const chord = Chord.parse('E').normalize().toString();
        expect(chord).toBe('E');
      });

      it('normalizes a suffix', () => {
        const chord = Chord.parse('Esus4').normalize().toString();
        expect(chord).toBe('Esus');
      });

      it('normalizes a suffix when chord has a modifier', () => {
        const chord = Chord.parse('F#add13').normalize().toString();
        expect(chord).toBe('F#(13)');
      });

      it('normalizes a suffix with a bass', () => {
        const chord = Chord.parse('E13(+9+5)/B').normalize().toString();
        expect(chord).toBe('E13(#9#5)/B');
      });

      it('remove the suffix when the normalize should remove the suffix', () => {
        const chord = Chord.parse('EMajj').normalize().toString();
        expect(chord).toBe('E');
      });

      it('returns the suffix when it\'s not in the config', () => {
        const chord = Chord.parse('E13(add2)').normalize().toString();
        expect(chord).toBe('E13(add2)');
      });
    });
  });
});
