import SectionTokenizer from '../../src/song_map/section_tokenizer';

describe('SectionTokenizer', () => {
  describe('#prefixFor', () => {
    it('assigns the documented prefix to every known section type', () => {
      const tokenizer = new SectionTokenizer();
      const types = [
        'verse', 'chorus', 'bridge', 'pre-chorus', 'part', 'tab', 'grid', 'intro', 'instrumental', 'tag', 'end',
      ];

      expect(types.map((type) => tokenizer.prefixFor(type).prefix))
        .toEqual(['V', 'C', 'B', 'PC', 'P', 'TAB', 'G', 'I', 'INST', 'T', 'E']);
      expect(types.map((type) => tokenizer.prefixFor(type).inferred)).toEqual(types.map(() => false));
    });

    it('assigns the untyped prefix to a paragraph that is not part of a section', () => {
      expect(new SectionTokenizer().prefixFor('none')).toEqual({ prefix: 'S', inferred: true });
    });

    it('infers a prefix that does not claim a reserved one', () => {
      const tokenizer = new SectionTokenizer();

      expect(tokenizer.prefixFor('solo')).toEqual({ prefix: 'SO', inferred: true });
      expect(tokenizer.prefixFor('coda')).toEqual({ prefix: 'CO', inferred: true });
      expect(tokenizer.prefixFor('vamp')).toEqual({ prefix: 'VA', inferred: true });
    });

    it('infers the initials of a section type with more than one word', () => {
      expect(new SectionTokenizer().prefixFor('false ending')).toEqual({ prefix: 'FE', inferred: true });
    });

    it('grows the prefix when the initials are reserved', () => {
      expect(new SectionTokenizer().prefixFor('post chorus')).toEqual({ prefix: 'PO', inferred: true });
    });

    it('returns the same prefix for a section type it has seen before', () => {
      const tokenizer = new SectionTokenizer();

      expect(tokenizer.prefixFor('solo').prefix).toEqual(tokenizer.prefixFor('solo').prefix);
    });
  });
});
