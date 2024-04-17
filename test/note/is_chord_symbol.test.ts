import Note from '../../src/note';

describe('Note', () => {
  describe('#isChordSymbol', () => {
    it('returns true if the note is a chord symbol', () => {
      expect(Note.parse('F').isChordSymbol()).toBe(true);
    });

    it('returns true if the note is a chord solfege', () => {
      expect(Note.parse('Fa').isChordSymbol()).toBe(false);
    });

    it('returns false if the note is a numeric', () => {
      expect(Note.parse('4').isChordSymbol()).toBe(false);
    });

    it('returns false if the note is a numeral', () => {
      expect(Note.parse('IV').isChordSymbol()).toBe(false);
    });
  });
});
