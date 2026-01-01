import '../util/matchers';

import { Chord } from '../../src';

describe('Chord', () => {
  describe('normalize suffix', () => {
    describe('chord without bass', () => {
      it('works when no suffix', () => {
        const chord = Chord.parseOrFail('E').normalize().toString();
        expect(chord).toBe('E');
      });

      it('normalizes a suffix', () => {
        const chord = Chord.parseOrFail('Esus4').normalize().toString();
        expect(chord).toBe('Esus');
      });

      it('normalizes a suffix when chord has a modifier', () => {
        const chord = Chord.parseOrFail('F#add13').normalize().toString();
        expect(chord).toBe('F#(13)');
      });

      it('normalizes a suffix with a bass', () => {
        const chord = Chord.parseOrFail('E13(+9+5)/B').normalize().toString();
        expect(chord).toBe('E13(#9#5)/B');
      });

      it('remove the suffix when the normalize should remove the suffix', () => {
        const chord = Chord.parseOrFail('EMajj').normalize().toString();
        expect(chord).toBe('E');
      });

      it('returns the suffix when it\'s not in the config', () => {
        const chord = Chord.parseOrFail('E13(add2)').normalize().toString();
        expect(chord).toBe('E13(add2)');
      });
    });
  });
});
