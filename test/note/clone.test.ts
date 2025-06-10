import Note from '../../src/note';

import { NUMERIC } from '../../src/constants';

describe('Note', () => {
  describe('#clone', () => {
    it('returns a deep copy of the note', () => {
      const note = new Note({ note: 5, type: NUMERIC, minor: true });
      const clone = note.clone();

      expect(note).not.toBe(clone);
      expect(note.note).toEqual(5);
      expect(note.type).toEqual(NUMERIC);
      expect(note.minor).toBe(true);
    });
  });
});
