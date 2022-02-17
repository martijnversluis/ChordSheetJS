import Key from '../../src/key';
import Note from '../../src/note';
import { NUMERAL } from '../../src/constants';

describe('Key', () => {
  describe('#clone', () => {
    it('returns a deep copy of the key', () => {
      const note = new Note({ note: 3, type: NUMERAL, minor: true });
      const key = new Key({ note, modifier: '#' });
      const clone = key.clone();

      expect(key.note).not.toBe(clone.note);
      expect(key.note.note).toEqual('iii');
      expect(key.note.type).toEqual(NUMERAL);
      expect(key.note.minor).toBe(true);
      expect(key.modifier).toEqual('#');
    });
  });
});
