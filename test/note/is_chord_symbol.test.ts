import Note from '../../src/note';
import { SYMBOL } from '../../src';

describe('Note', () => {
  describe('#isChordSymbol', () => {
    it('returns true if the note is a chord symbol', () => {
      expect(Note.parse('F').is(SYMBOL)).toBe(true);
    });

    it('returns true if the note is a chord solfege', () => {
      expect(Note.parse('Fa').is(SYMBOL)).toBe(false);
    });

    it('returns false if the note is a numeric', () => {
      expect(Note.parse('4').is(SYMBOL)).toBe(false);
    });

    it('returns false if the note is a numeral', () => {
      expect(Note.parse('IV').is(SYMBOL)).toBe(false);
    });
  });
});
