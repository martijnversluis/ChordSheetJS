import { Key } from '../../src';

describe('Key', () => {
  describe('isChordSymbol', () => {
    describe('for a symbol key', () => {
      it('returns true', () => {
        const key = new Key({ note: 'A', modifier: '#' });

        expect(key.isChordSymbol()).toBe(true);
      });
    });

    describe('for a numeric key', () => {
      it('returns false', () => {
        const key = new Key({ note: 5, modifier: '#' });

        expect(key.isChordSymbol()).toBe(false);
      });
    });
  });
});
