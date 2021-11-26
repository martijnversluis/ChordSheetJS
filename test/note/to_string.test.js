import Note from '../../src/note';

describe('Note', () => {
  describe('#toString', () => {
    it('returns a string version of the note', () => {
      expect(new Note('A').toString()).toEqual('A');
      expect(new Note(5).toString()).toEqual('5');
    });
  });
});
