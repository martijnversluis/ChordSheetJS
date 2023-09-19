import { Chord } from '../../src';

describe('Chord', () => {
  describe('normalize suffix on number chord', () => {
    describe('chord without bass', () => {
      it('works when no suffix', () => {
        const chord = Chord.parseOrFail('1').normalize().toString();
        expect(chord).toBe('1');
      });

      it('normalizes a suffix', () => {
        const chord = Chord.parseOrFail('4sus4').normalize().toString();
        expect(chord).toBe('4sus');
      });

      it('normalizes a suffix when chord has a modifier', () => {
        const chord = Chord.parseOrFail('b5add13').normalize().toString();
        expect(chord).toBe('b5(13)');
      });

      it('normalizes a suffix with a bass', () => {
        const chord = Chord.parseOrFail('513(+9+5)/7').normalize().toString();
        expect(chord).toBe('513(#9#5)/7');
      });

      it('remove the suffix when the normalize should remove the suffix', () => {
        const chord = Chord.parseOrFail('1Majj').normalize().toString();
        expect(chord).toBe('1');
      });

      it('normalizes a number chord', () => {
        const chord = Chord.parseOrFail('1sus4').normalize().toString();
        expect(chord).toBe('1sus');
      });
    });
  });
});
