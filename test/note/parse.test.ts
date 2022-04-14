import Note from '../../src/note';

describe('Note', () => {
  describe('parse', () => {
    it('converts a valid lower case chord letter to upper case', () => {
      expect(Note.parse('f').note).toEqual('F');
    });

    it('uses a valid upper case chord letter as-is', () => {
      expect(Note.parse('A').note).toEqual('A');
    });

    it('converts a valid numeric string chord number to integer', () => {
      expect(Note.parse('7').note).toEqual(7);
    });

    it('uses a valid integer chord number as-is', () => {
      expect(Note.parse(5).note).toEqual(5);
    });

    it('parses a valid numeral', () => {
      expect(Note.parse('VI').note).toEqual('VI');
    });

    it('raises on an invalid chord letter', () => {
      expect(() => Note.parse('J')).toThrow('Invalid note J');
    });

    it('raises on an invalid chord number', () => {
      expect(() => Note.parse(9)).toThrow('Invalid note 9');
    });

    it('raises on an invalid numeral', () => {
      expect(() => Note.parse('IX')).toThrow('Invalid note IX');
    });

    it('raises on anything else', () => {
      expect(() => Note.parse('foobar')).toThrow('Invalid note foobar');
    });
  });
});
