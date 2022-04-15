import Key from '../../src/key';
import '../matchers';

describe('Key', () => {
  describe('normalize', () => {
    it('normalizes E#', () => {
      const key = new Key({ note: 'E', modifier: '#' });

      const normalizedKey = key.normalize();
      expect(normalizedKey).toBeKey({ note: 'F', modifier: null });
    });

    it('normalizes B#', () => {
      const key = new Key({ note: 'B', modifier: '#' });

      const normalizedKey = key.normalize();
      expect(normalizedKey).toBeKey({ note: 'C', modifier: null });
    });

    it('normalizes Cb', () => {
      const key = new Key({ note: 'C', modifier: 'b' });

      const normalizedKey = key.normalize();
      expect(normalizedKey).toBeKey({ note: 'B', modifier: null });
    });

    it('normalizes Fb', () => {
      const key = new Key({ note: 'F', modifier: 'b' });

      const normalizedKey = key.normalize();
      expect(normalizedKey).toBeKey({ note: 'E', modifier: null });
    });

    it('normalizes #3', () => {
      const key = new Key({ note: 3, modifier: '#' });

      const normalizedKey = key.normalize();
      expect(normalizedKey).toBeKey({ note: 4, modifier: null });
    });

    it('normalizes #7', () => {
      const key = new Key({ note: '7', modifier: '#' });

      const normalizedKey = key.normalize();
      expect(normalizedKey).toBeKey({ note: 1, modifier: null });
    });

    it('normalizes b1', () => {
      const key = new Key({ note: 1, modifier: 'b' });

      const normalizedKey = key.normalize();
      expect(normalizedKey).toBeKey({ note: 7, modifier: null });
    });

    it('normalizes b4', () => {
      const key = new Key({ note: 4, modifier: 'b' });

      const normalizedKey = key.normalize();
      expect(normalizedKey).toBeKey({ note: 3, modifier: null });
    });

    it('normalizes #III', () => {
      const key = new Key({ note: 'III', modifier: '#' });

      const normalizedKey = key.normalize();
      expect(normalizedKey).toBeKey({ note: 'IV', modifier: null });
    });

    it('normalizes #VII', () => {
      const key = new Key({ note: 'VII', modifier: '#' });

      const normalizedKey = key.normalize();
      expect(normalizedKey).toBeKey({ note: 'I', modifier: null });
    });

    it('normalizes bI', () => {
      const key = new Key({ note: 'I', modifier: 'b' });

      const normalizedKey = key.normalize();
      expect(normalizedKey).toBeKey({ note: 'VII', modifier: null });
    });

    it('normalizes bIV', () => {
      const key = new Key({ note: 'IV', modifier: 'b' });

      const normalizedKey = key.normalize();
      expect(normalizedKey).toBeKey({ note: 'III', modifier: null });
    });
  });
});
