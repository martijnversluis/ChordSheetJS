import ChordProParser from '../../src/parser/chord_pro_parser';
import TerminalFormatter from '../../src/formatter/terminal_formatter';

const parse = (text: string) => new ChordProParser().parse(text);

describe('TerminalFormatter visibility and structural controls', () => {
  const formatter = new TerminalFormatter({
    width: 8,
    height: 2,
    layout: {
      sections: { global: { linePadding: 1, paragraphSpacing: 0 }, base: { display: { lyricsOnly: true } } },
    },
  });

  it('does not paginate padding for a removed chord-only line', () => {
    const document = formatter.format(parse('[C]\na'));
    expect(document.pages).toHaveLength(1);
    expect(document.rows.map((row) => row.spans.map((span) => span.text))).toEqual([['a'], []]);
    expect(document.pages[0].columns[0].usedHeight).toBe(2);
  });

  it('does not reject an empty filtered line whose padding exceeds the finite frame', () => {
    const document = formatter.format(parse('[C]'), {
      height: 1,
      layout: { sections: { global: { linePadding: 2 } } },
    });
    expect(document.pages).toHaveLength(1);
    expect(document.pages[0].columns[0].usedHeight).toBe(0);
    expect(document.rows[0].spans).toEqual([]);
  });

  it('combines hidden labels and repeat lyric filtering without blank destination pages', () => {
    const song = parse('{sov: V}\n[C]\na\n{eov}\n\n{sov: V}\n[G]\nb\n{eov}');
    const document = formatter.format(song, {
      layout: { sections: { base: { display: { showLabel: false, repeatedSections: 'lyrics_only' } } } },
    });
    expect(document.pages).toHaveLength(2);
    expect(document.pages.map((page) => page.rows[0].spans[0].text)).toEqual(['a', 'b']);
    expect(document.pages.map((page) => page.columns[0].usedHeight)).toEqual([2, 2]);
  });

  it('retains rendered comments, lyrics, chord rows and their intentional padding', () => {
    const document = formatter.format(parse('{comment: hush}\n[C]\na'), {
      layout: { sections: { base: { display: { lyricsOnly: false } } } },
    });
    expect(document.pages).toHaveLength(3);
    expect(document.pages.map((page) => page.rows[0].spans[0].text)).toEqual(['hush', 'C', 'a']);
    expect(document.pages.every((page) => page.rows[1].spans.length === 0)).toBe(true);
  });

  it.each(['hide', 'title_only'] as const)(
    'retains explicit breaks in %s repeated sections',
    (repeatedSections) => {
      const song = parse('{sov: V}\na\n{eov}\n\n{sov: V}\n{column_break}\nb\n{eov}');
      const document = new TerminalFormatter({
        height: 8,
        layout: { sections: { global: { paragraphSpacing: 0 }, base: { display: { repeatedSections } } } },
      }).format(song);
      expect(document.pages).toHaveLength(2);
      expect(document.pages[1].columns[0].usedHeight).toBe(0);
      expect(document.pages[0].rows.flatMap((row) => row.spans).map((span) => span.text)).toEqual(
        repeatedSections === 'hide' ? ['V', 'a'] : ['V', 'a', 'V'],
      );
    },
  );

  it.each(['hide', 'title_only'] as const)('retains consecutive controls with %s', (repeatedSections) => {
    const song = parse(
      '{sov: V}\na\n{eov}\n\n{sov: V}\n{column_break}\n{column_break}\nb\n{column_break}\n{eov}',
    );
    const document = formatter.format(song, {
      layout: { sections: { base: { display: { showLabel: false, repeatedSections } } } },
    });
    expect(document.pages).toHaveLength(4);
    expect(document.pages.map((page) => page.columns[0].usedHeight)).toEqual([2, 0, 0, 0]);
  });

  it('preserves a leading explicit break but does not add one for a filtered chord line', () => {
    const document = formatter.format(parse('{column_break}\n[C]\na'));
    expect(document.pages).toHaveLength(2);
    expect(document.pages[0].columns[0].usedHeight).toBe(0);
    expect(document.pages[1].rows[0].spans[0].text).toBe('a');
  });
});
