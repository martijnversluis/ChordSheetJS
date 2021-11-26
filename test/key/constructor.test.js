import Note from '../../src/note';
import Key from '../../src/key';

describe('Key', () => {
  describe('constructor', () => {
    it('assigns a note object', () => {
      const note = new Note('A');
      const key = new Key({ note });

      expect(key.note).toBe(note);
    });

    it('wraps a numeric or string note', () => {
      const key = new Key({ note: 'A' });

      expect(key.note).toBeInstanceOf(Note);
      expect(key.note.note).toEqual('A');
    });

    it('assigns the modifier', () => {
      const key = new Key({ note: 'B', modifier: '#' });

      expect(key.modifier).toEqual('#');
    });

    it('defaults the modifier to null', () => {
      const key = new Key({ note: 'F' });

      expect(key.modifier).toBe(null);
    });
  });
});
