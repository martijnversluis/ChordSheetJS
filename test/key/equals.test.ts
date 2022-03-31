import { Key } from '../../src';
import Note from '../../src/note';
import { NUMERAL } from '../../src/constants';

describe('Key', () => {
  describe('#equals', () => {
    it('returns true when both the note and modifier are equal', () => {
      const noteA = new Note({ note: 3, type: NUMERAL, minor: true });
      const keyA = new Key({ note: noteA, modifier: '#' });

      const noteB = new Note({ note: 3, type: NUMERAL, minor: true });
      const keyB = new Key({ note: noteB, modifier: '#' });

      expect(keyA.equals(keyB)).toBe(true);
    });

    it('returns true when the note differs', () => {
      const noteA = new Note({ note: 3, type: NUMERAL, minor: true });
      const keyA = new Key({ note: noteA, modifier: '#' });

      const noteB = new Note({ note: 3, type: NUMERAL, minor: false });
      const keyB = new Key({ note: noteB, modifier: '#' });

      expect(keyA.equals(keyB)).toBe(false);
    });

    it('returns true when the modifier differs', () => {
      const noteA = new Note({ note: 3, type: NUMERAL, minor: true });
      const keyA = new Key({ note: noteA, modifier: '#' });

      const noteB = new Note({ note: 3, type: NUMERAL, minor: true });
      const keyB = new Key({ note: noteB, modifier: 'b' });

      expect(keyA.equals(keyB)).toBe(false);
    });
  });
});
