import Note from '../../src/note';

describe('Note', () => {
  describe('#isMinor', () => { 
    it('returns true for minor numerals', () => {
      expect(Note.parse('iii').isMinor()).toBe(true);
    });

    it('returns false for major numerals', () => {
      expect(Note.parse('III').isMinor()).toBe(false);
    });
  });
});
