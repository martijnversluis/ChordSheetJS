import { Key, NUMERIC, SYMBOL } from '../../src';
import Note from '../../src/note';

describe('Key', () => {
  describe('#is', () => {
    it('returns true when the provided type matches the note type', () => {
      const note = new Note({ note: 5, type: NUMERIC });
      const key = new Key({ note });

      expect(key.is(NUMERIC)).toBe(true);
    });

    it('returns false when the provided type does not match the note type', () => {
      const note = new Note({ note: 5, type: NUMERIC });
      const key = new Key({ note });

      expect(key.is(SYMBOL)).toBe(false);
    });
  });
});
