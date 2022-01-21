import { Key } from '../../src';

describe('Key', () => {
  describe('isNumeric', () => {
    describe('for a symbol key', () => {
      it('returns false', () => {
        const key = new Key({ note: 'A', modifier: '#' });

        expect(key.isNumeric()).toBe(false);
      });
    });

    describe('for a numeric key', () => {
      it('returns true', () => {
        const key = new Key({ note: 5, modifier: '#' });

        expect(key.isNumeric()).toBe(true);
      });
    });

    describe('for a numeral', () => {
      it('returns false', () => {
        const key = new Key({ note: 'V', modifier: '#' });

        expect(key.isNumeric()).toBe(false);
      });
    });
  });
});
