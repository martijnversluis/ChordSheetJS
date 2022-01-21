import Note from '../../src/note';

describe('Note', () => {
  describe('#toString', () => {
    it('returns a string version of the note', () => {
      expect(Note.parse('A').toString()).toEqual('A');
      expect(Note.parse(5).toString()).toEqual('5');
      expect(Note.parse('VI').toString()).toEqual('VI');
    });
  });
});
