import { Chord } from '../../src';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('isChordSymbol', () => {
      describe('for a pure chord symbol', () => {
        it('returns true', () => {
          const chord = new Chord({ base: 'A', bassBase: 'C' });

          expect(chord.isChordSymbol()).toBe(true);
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
