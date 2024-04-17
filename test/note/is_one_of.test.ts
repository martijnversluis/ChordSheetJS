import Note from '../../src/note';

describe('Note', () => {
  describe('#isOneOf', () => {
    it('checks whether the note is one of the supplied options', () => {
      const note = Note.parse('E');

      expect(note.isOneOf('A', 6, 'E')).toBe(true);
      expect(note.isOneOf('F', 4, 'A')).toBe(false);
    });

    it('checks whether the note is one of the supplied options with solfege', () => {
      const note = Note.parse('Mi');

      expect(note.isOneOf('La', 6, 'Mi')).toBe(true);
      expect(note.isOneOf('Fa', 4, 'La')).toBe(false);
    });
  });
});
