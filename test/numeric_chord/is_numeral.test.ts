import { Chord } from '../../src';

describe('Chord', () => {
  describe('numeric', () => {
    describe('isNumeral', () => {
      describe('for a pure numeric chord', () => {
        it('returns false', () => {
          const chord = new Chord({ base: 1, bassBase: 3 });

          expect(chord.isNumeral()).toBe(false);
        });
      });

      describe('for a mixed chord', () => {
        it('returns false', () => {
          const chord = new Chord({ base: 'A', bassBase: 3 });

          expect(chord.isNumeral()).toBe(false);
        });
      });
    });
  });
});
