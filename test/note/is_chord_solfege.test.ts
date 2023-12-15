import Note from '../../src/note';

describe('Note', () => {
  describe('#isChordSolfege', () => {
    it('returns true if the note is a chord solfege', () => {
      expect(Note.parse('Fa').isChordSolfege()).toBe(true);
    });

    it('returns false if the note is a chord symbol', () => {
      expect(Note.parse('F').isChordSolfege()).toBe(false);
    });

    it('returns false if the note is a numeric', () => {
      expect(Note.parse('4').isChordSolfege()).toBe(false);
    });

    it('returns false if the note is a numeral', () => {
      expect(Note.parse('IV').isChordSolfege()).toBe(false);
    });
  });
});
