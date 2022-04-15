import { Chord } from '../../src';

describe('Chord', () => {
  describe('numeric', () => {
    describe('isChordSymbol', () => {
      describe('for a pure numeric chord', () => {
        it('returns false', () => {
          const chord = new Chord({ base: 1, bassBase: 3 });

          expect(chord.isChordSymbol()).toBe(false);
        });
      });

      describe('for a mixed chord', () => {
        it('returns false', () => {
          const chord = new Chord({ base: 'A', bassBase: 3 });

          expect(chord.isChordSymbol()).toBe(false);
        });
      });
    });
  });
});
