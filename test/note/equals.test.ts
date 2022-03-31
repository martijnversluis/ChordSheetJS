import { NUMERAL } from '../../src/constants';
import Note from '../../src/note';

describe('Note', () => {
  describe('#equals', () => {
    it('returns true when two notes are equal', () => {
      const noteA = new Note({ note: 'iii', type: NUMERAL, minor: true });
      const noteB = new Note({ note: 'iii', type: NUMERAL, minor: true });

      expect(noteA.equals(noteB)).toBe(true);
    });

    it('returns false when any property differs', () => {
      const noteA = new Note({ note: 'iii', type: NUMERAL, minor: true });
      const noteB = new Note({ note: 'iii', type: NUMERAL, minor: false });

      expect(noteA.equals(noteB)).toBe(false);
    });
  });
});
