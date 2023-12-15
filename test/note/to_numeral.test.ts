import Note from '../../src/note';

describe('Note', () => {
  describe('#toNumeral', () => {
    it('converts from a numeric', () => {
      const numeric = Note.parse(5);
      const numeral = numeric.toNumeral();

      expect(numeral.isNumeral()).toBe(true);
      expect(numeral.note).toEqual('V');
    });

    it('clones a numeral', () => {
      const numeral = Note.parse('III');
      const clone = numeral.toNumeral();

      expect(clone).not.toBe(numeral);
      expect(clone.note).toEqual('III');
    });

    it('errors for other note types', () => {
      const chordSymbol = Note.parse('E');
      const chordSolfege = Note.parse('Mi');

      expect(() => chordSymbol.toNumeral()).toThrow('Converting a symbol note to numeral is not supported');
      expect(() => chordSolfege.toNumeral()).toThrow('Converting a solfege note to numeral is not supported');
    });
  });
});
