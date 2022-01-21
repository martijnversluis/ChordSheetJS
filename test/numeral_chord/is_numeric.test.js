import { Chord } from '../../src';

describe('Chord', () => {
  describe('numeral', () => {
    describe('isNumeric', () => {
      it('returns true', () => {
        const chord = new Chord({ base: 'I', bassBase: 'III' });

        expect(chord.isNumeric()).toBe(false);
      });
    });

    describe('for a mixed chord', () => {
      it('returns false', () => {
        const chord = new Chord({ base: 'I', bassBase: 3 });

        expect(chord.isNumeric()).toBe(false);
      });
    });
  });
});
