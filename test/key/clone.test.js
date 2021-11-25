import Key from '../../src/key';

describe('Key', () => {
  describe('#clone', () => {
    it('returns a deep copy of the key', () => {
      const key = new Key({ note: 'A', modifier: '#' });
      const clone = key.clone();

      expect(key.note).not.toBe(clone.note);
      expect(key.note.note).toEqual('A');
      expect(key.modifier).toEqual('#');
    });
  });
});
