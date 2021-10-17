import Note from '../../src/note';

describe('Note', () => {
  describe('#clone', () => {
    it('returns a deep copy of the note', () => {
      const note = new Note('E');
      const clone = note.clone();

      expect(note).not.toBe(clone);
      expect(note.note).toEqual('E');
    });
  });
});
