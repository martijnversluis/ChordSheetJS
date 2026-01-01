import '../util/matchers';

import { Chord } from '../../src';

describe('Chord', () => {
  describe('normalize suffix', () => {
    describe('chord without bass', () => {
      it('works when no suffix', () => {
        const chord = Chord.parseOrFail('Mi').normalize().toString();
        expect(chord).toBe('Mi');
      });

      it('normalizes a suffix', () => {
        const chord = Chord.parseOrFail('Misus4').normalize().toString();
        expect(chord).toBe('Misus');
      });

      it('normalizes a suffix when chord has a modifier', () => {
        const chord = Chord.parseOrFail('Fa#add13').normalize().toString();
        expect(chord).toBe('Fa#(13)');
      });

      it('normalizes a suffix with a bass', () => {
        const chord = Chord.parseOrFail('Mi13(+9+5)/Si').normalize().toString();
        expect(chord).toBe('Mi13(#9#5)/Si');
      });

      it('remove the suffix when the normalize should remove the suffix', () => {
        const chord = Chord.parseOrFail('MiMajj').normalize().toString();
        expect(chord).toBe('Mi');
      });

      it('returns the suffix when it\'s not in the config', () => {
        const chord = Chord.parseOrFail('Mi13(add2)').normalize().toString();
        expect(chord).toBe('Mi13(add2)');
      });
    });
  });
});
