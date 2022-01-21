import { Chord } from '../../src';

describe('Chord', () => {
  describe('numeral', () => {
    describe('isNumeral', () => {
      describe('for a pure numeral chord', () => {
        it('returns true', () => {
          const chord = new Chord({ base: 'I', bassBase: 'III' });

          expect(chord.isNumeral()).toBe(true);
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
