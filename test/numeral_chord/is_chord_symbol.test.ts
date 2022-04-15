import { Chord } from '../../src';

describe('Chord', () => {
  describe('isChordSymbol', () => {
    describe('for a numeral chord', () => {
      it('returns false', () => {
        const chord = new Chord({ base: 'V', bassBase: 'VII' });

        expect(chord.isChordSymbol()).toBe(false);
      });
    });

    describe('for a mixed chord with numeral bassBase', () => {
      it('returns false', () => {
        const chord = new Chord({ base: 'A', bassBase: 'VI' });

        expect(chord.isChordSymbol()).toBe(false);
      });
    });
  });
});
