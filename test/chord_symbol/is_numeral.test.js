import { Chord } from '../../src';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('isNumeral', () => {
      describe('for a pure chord symbol', () => {
        it('returns false', () => {
          const chord = new Chord({ base: 'C', bassBase: 'E' });

          expect(chord.isNumeral()).toBe(false);
        });
      });

      describe('for a mixed chord', () => {
        it('returns false', () => {
          const chord = new Chord({ base: 'A', bassBase: 'III' });

          expect(chord.isNumeral()).toBe(false);
        });
      });
    });
  });
});
