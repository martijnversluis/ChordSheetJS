import Note from '../../src/note';
import { NUMERAL, SOLFEGE } from '../../src';

describe('Note', () => {
  describe('#isNumeral', () => {
    it('returns true if the note is a numeral', () => {
      expect(Note.parse('V').is(NUMERAL)).toBe(true);
    });

    it('returns false if the note is numeric', () => {
      expect(Note.parse('5').is(NUMERAL)).toBe(false);
    });

    it('returns false if the note is a chord symbol', () => {
      expect(Note.parse('F').is(NUMERAL)).toBe(false);
    });

    it('returns false if the note is a chord solfege', () => {
      expect(Note.parse('F').is(SOLFEGE)).toBe(false);
    });
  });
});
