import Note from '../../src/note';

describe('Note', () => {
  describe('#isNumeric', () => {
    it('returns true if the note is a chord symbol', () => {
      expect(new Note('F').isChordSymbol()).toBe(true);
    });

    it('returns false if the note is a chord symbol', () => {
      expect(new Note('4').isChordSymbol()).toBe(false);
    });
  });
});
