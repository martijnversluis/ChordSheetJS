import Note from '../../src/note';

describe('Note', () => {
  describe('#isNumeric', () => {
    it('returns true if the note is numeric', () => {
      expect(new Note('5').isNumeric()).toBe(true);
    });

    it('returns false if the note is not numeric', () => {
      expect(new Note('F').isNumeric()).toBe(false);
    });
  });
});
