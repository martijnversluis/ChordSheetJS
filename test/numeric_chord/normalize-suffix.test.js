import { Chord } from '../../src/index';

import '../matchers';

describe('Chord', () => {
  describe('normalize suffix on number chord', () => {
    describe('chord without bass', () => {
      it('works when no suffix', () => {
        const chord = Chord.parse('1').normalize().toString();
        expect(chord).toBe('1');
      });

      it('normalizes a suffix', () => {
        const chord = Chord.parse('4sus4').normalize().toString();
        expect(chord).toBe('4sus');
      });

      it('normalizes a suffix when chord has a modifier', () => {
        const chord = Chord.parse('b5add13').normalize().toString();
        expect(chord).toBe('b5(13)');
      });

      it('normalizes a suffix with a bass', () => {
        const chord = Chord.parse('513(+9+5)/7').normalize().toString();
        expect(chord).toBe('513(#9#5)/7');
      });

      it('remove the suffix when the normalize should remove the suffix', () => {
        const chord = Chord.parse('1Majj').normalize().toString();
        expect(chord).toBe('1');
      });

      it('normalizes a number chord', () => {
        const chord = Chord.parse('1sus4').normalize().toString();
        expect(chord).toBe('1sus');
      });

      it('returns the suffix when it\'s not in the config', () => {
        const chord = Chord.parse('1not-a-real-suffix/3').normalize().toString();
        expect(chord).toBe('1not-a-real-suffix/3');
      });
    });
  });
});
