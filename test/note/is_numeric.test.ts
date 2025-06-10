import Note from '../../src/note';

import { NUMERIC } from '../../src';

describe('Note', () => {
  describe('#isNumeric', () => {
    it('returns true if the note is numeric', () => {
      expect(Note.parse('5').is(NUMERIC)).toBe(true);
    });

    it('returns false if the note is a chord symbol', () => {
      expect(Note.parse('F').is(NUMERIC)).toBe(false);
    });

    it('returns false if the note is a chord solfege', () => {
      expect(Note.parse('Fa').is(NUMERIC)).toBe(false);
    });

    it('returns false if the note is a numeral', () => {
      expect(Note.parse('IV').is(NUMERIC)).toBe(false);
    });
  });
});
