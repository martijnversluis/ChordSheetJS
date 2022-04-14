import { Key } from '../../src';

describe('Key', () => {
  describe('isNumeral', () => {
    describe('for a symbol key', () => {
      it('returns false', () => {
        const key = new Key({ note: 'A', modifier: '#' });

        expect(key.isNumeral()).toBe(false);
      });
    });

    describe('for a numeric key', () => {
      it('returns false', () => {
        const key = new Key({ note: 5, modifier: '#' });

        expect(key.isNumeral()).toBe(false);
      });
    });

    describe('for a numeral', () => {
      it('returns true', () => {
        const key = new Key({ note: 'V', modifier: '#' });

        expect(key.isNumeral()).toBe(true);
      });
    });
  });
});
