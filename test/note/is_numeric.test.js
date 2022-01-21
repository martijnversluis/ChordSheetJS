import Note from '../../src/note';

describe('Note', () => {
  describe('#isNumeric', () => {
    it('returns true if the note is numeric', () => {
      expect(Note.parse('5').isNumeric()).toBe(true);
    });

    it('returns false if the note is a chord symbol', () => {
      expect(Note.parse('F').isNumeric()).toBe(false);
    });

    it('returns false if the note is a numeral', () => {
      expect(Note.parse('IV').isNumeric()).toBe(false);
    });
  });
});
