import Note from '../../src/note';
import { SOLFEGE } from '../../src';

describe('Note', () => {
  describe('#isChordSolfege', () => {
    it('returns true if the note is a chord solfege', () => {
      expect(Note.parse('Fa').is(SOLFEGE)).toBe(true);
    });

    it('returns false if the note is a chord symbol', () => {
      expect(Note.parse('F').is(SOLFEGE)).toBe(false);
    });

    it('returns false if the note is a numeric', () => {
      expect(Note.parse('4').is(SOLFEGE)).toBe(false);
    });

    it('returns false if the note is a numeral', () => {
      expect(Note.parse('IV').is(SOLFEGE)).toBe(false);
    });
  });
});
