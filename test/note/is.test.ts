import Note from '../../src/note';
import { SYMBOL } from '../../src';
import { NUMERAL } from '../../src/constants';

describe('Note', () => {
  describe('#is', () => {
    it('returns true when the provided type equals the note type', () => {
      const note = new Note({ note: 'A', type: SYMBOL });

      expect(note.is(SYMBOL)).toBe(true);
    });

    it('returns false when the provided type does not equal the note type', () => {
      const note = new Note({ note: 'III', type: NUMERAL });

      expect(note.is(SYMBOL)).toBe(false);
    });
  });
});
