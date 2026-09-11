import { META_TAGS } from '../../src/chord_sheet/tag';
import {
  ChordProFormatter,
  ChordProParser,
  ChordsOverWordsFormatter,
  ChordsOverWordsParser,
} from '../../src';

describe('configured metadata directives', () => {
  const writerMetadataConfiguration = { metadata: { additionalMetadataDirectives: ['writer'] } };

  it('formats configured ChordPro metadata directives in the ChordsOverWords header', () => {
    const song = new ChordProParser().parse('{writer: James Mont}\n[C]Hello');

    expect(new ChordsOverWordsFormatter(writerMetadataConfiguration).format(song)).toBe(
      'writer: James Mont\n\nC\nHello',
    );
  });

  it('formats configured ChordsOverWords metadata directives as standalone ChordPro directives', () => {
    const song = new ChordsOverWordsParser().parse('writer: James Mont\n---\nC\nHello');

    expect(new ChordProFormatter(writerMetadataConfiguration).format(song)).toBe(
      '{writer: James Mont}\n[C]Hello',
    );
  });

  it('formats unsupported non-standard ChordsOverWords metadata directives as meta directives', () => {
    const song = new ChordsOverWordsParser().parse('writer: James Mont\n---\nC\nHello');

    expect(new ChordProFormatter().format(song)).toBe('{meta: writer James Mont}\n[C]Hello');
  });

  it('formats unsupported non-standard ChordPro metadata directives as meta directives', () => {
    const song = new ChordProParser().parse('{writer: James Mont}\n[C]Hello');

    expect(new ChordProFormatter().format(song)).toBe('{meta: writer James Mont}\n[C]Hello');
  });

  it('uses configured metadata directives in selector evaluation', () => {
    const song = new ChordProParser().parse('{writer: James Mont}\n{start_of_verse-writer}\n[C]Hello\n{end_of_verse}');

    expect(new ChordsOverWordsFormatter(writerMetadataConfiguration).format(song)).toBe(
      'writer: James Mont\n\nC\nHello',
    );
    expect(new ChordsOverWordsFormatter().format(song)).toBe('');
  });

  it('does not add writer or author to the global standard metadata directives', () => {
    expect(META_TAGS).not.toContain('writer');
    expect(META_TAGS).not.toContain('author');
  });
});
