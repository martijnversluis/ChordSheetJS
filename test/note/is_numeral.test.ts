import Note from '../../src/note';

describe('Note', () => {
  describe('#isNumeral', () => {
    it('returns true if the note is a numeral', () => {
      expect(Note.parse('V').isNumeral()).toBe(true);
    });

    it('returns false if the note is numeric', () => {
      expect(Note.parse('5').isNumeral()).toBe(false);
    });

    it('returns false if the note is a chord symbol', () => {
      expect(Note.parse('F').isNumeral()).toBe(false);
    });
  
    it('returns false if the note is a chord solfege', () => {
      expect(Note.parse('F').isChordSolfege()).toBe(false);
    });
  });
});
