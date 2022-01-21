import { NUMERAL } from '../../src/constants';
import Note from '../../src/note';
import { Key } from '../../src';

describe('Key', () => {
  describe('#isMinor', () => {
    it('returns true when the note is minor', () => {
      const note = new Note({ note: 3, type: NUMERAL, minor: true });
      const key = new Key({ note });

      expect(key.isMinor()).toBe(true);
    });

    it('returns false when the note is major', () => {
      const note = new Note({ note: 3, type: NUMERAL, minor: false });
      const key = new Key({ note });

      expect(key.isMinor()).toBe(false);
    });
  });
});
