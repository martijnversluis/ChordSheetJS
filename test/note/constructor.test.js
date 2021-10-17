import Note from '../../src/note';

describe('Note', () => {
  describe('constructor', () => {
    it('converts a valid lower case chord letter to upper case', () => {
      expect(new Note('f').note).toEqual('F');
    });

    it('uses a valid upper case chord letteras-is', () => {
      expect(new Note('A').note).toEqual('A');
    });

    it('converts a valid numeric string chord number to integer', () => {
      expect(new Note('7').note).toEqual(7);
    });

    it('uses a valid integer chord number as-is', () => {
      expect(new Note(5).note).toEqual(5);
    });

    it('raises on an invalid chord letter', () => {
      expect(() => new Note('J')).toThrow('Invalid note J');
    });

    it('raises on an invalid chord number', () => {
      expect(() => new Note(9)).toThrow('Invalid note 9');
    });

    it('raises on anything else', () => {
      expect(() => new Note('foobar')).toThrow('Invalid note foobar');
    });
  });

  describe('#clone', () => {
    it('returns a deep copy of the note', () => {
      const note = new Note('E');
      const clone = note.clone();

      expect(note).not.toBe(clone);
      expect(note.note).toEqual('E');
    });
  });
});
