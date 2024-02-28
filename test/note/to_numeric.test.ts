import Note from '../../src/note';

describe('Note', () => {
  describe('#toNumeric', () => {
    it('converts from a numeral', () => {
      const numeral = Note.parse('VI');
      const numeric = numeral.toNumeric();

      expect(numeric.isNumeric()).toBe(true);
      expect(numeric.note).toEqual(6);
    });

    it('clones a numeric', () => {
      const numeric = Note.parse(6);
      const clone = numeric.toNumeric();

      expect(clone).not.toBe(numeric);
      expect(clone.note).toEqual(6);
    });

    it('errors for other note types', () => {
      const chordSymbol = Note.parse('E');
      const chordSolfege = Note.parse('Mi');

      expect(() => chordSymbol.toNumeric()).toThrow('Converting a symbol note to numeric is not supported');
      expect(() => chordSolfege.toNumeric()).toThrow('Converting a solfege note to numeric is not supported');
    });
  });
});
