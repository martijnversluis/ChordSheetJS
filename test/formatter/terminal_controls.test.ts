import ChordLyricsPair from '../../src/chord_sheet/chord_lyrics_pair';
import ChordProFormatter from '../../src/formatter/chord_pro_formatter';
import ChordProParser from '../../src/parser/chord_pro_parser';
import Line from '../../src/chord_sheet/line';
import Song from '../../src/chord_sheet/song';
import Tag from '../../src/chord_sheet/tag';
import TerminalFormatter from '../../src/formatter/terminal_formatter';

const parse = (text: string) => new ChordProParser().parse(text);
const spans = (document) => document.rows.flatMap((row) => row.spans);

describe('TerminalFormatter cell controls', () => {
  it('retains leading, trailing, consecutive and mixed-line breaks', () => {
    const song = new Song();
    song.lines = [
      new Line({
        type: 'none',
        items: [
          new ChordLyricsPair('', 'a'),
          new Tag('column_break'),
          new ChordLyricsPair('', 'b'),
          new Tag('column_break'),
        ],
      }),
    ];
    const result = new TerminalFormatter({ height: 1, width: 3 }).format(song);
    expect(result.pages).toHaveLength(3);
    expect(result.pages.map((page) => page.rows[0].spans.map((span) => span.text))).toEqual([
      ['a'],
      ['b'],
      [],
    ]);
    expect(new TerminalFormatter({ height: 1 }).format(parse('{column_break}')).pages).toHaveLength(2);
  });
  it('uses three equal columns and leaves remainder cells on the right', () => {
    const result = new TerminalFormatter({
      width: 15,
      height: 1,
      layout: { sections: { global: { columnCount: 3, columnSpacing: 1 } } },
    }).format(parse('a\nb\nc'));
    expect(result.pages[0].columns.map(({ x, width }) => [x, width])).toEqual([
      [0, 4],
      [5, 4],
      [10, 4],
    ]);
    expect(result.rows[0].spans.map(({ x }) => x)).toEqual([0, 5, 10]);
  });
  it('does not split an atomic chord/lyric line across columns', () => {
    const result = new TerminalFormatter({
      width: 10,
      height: 2,
      layout: { sections: { global: { columnCount: 2 } } },
    }).format(parse('a\n[C]b'));
    expect(result.pages).toHaveLength(1);
    expect(result.rows[0].spans.map(({ text, column }) => [text, column])).toEqual([
      ['a', 1],
      ['C', 2],
    ]);
    expect(result.rows[1].spans[0]).toMatchObject({ text: 'b', column: 2 });
  });
  it('suppresses huge paragraph spacing at new columns and at the end', () => {
    const result = new TerminalFormatter({
      height: 2,
      layout: { sections: { global: { paragraphSpacing: 100 } } },
    }).format(parse('a\n\nb'));
    expect(result.pages).toHaveLength(2);
    expect(result.pages[1].rows[0].spans[0].text).toBe('b');
    expect(new TerminalFormatter({ height: 2 }).format(parse('')).pages).toHaveLength(1);
  });
  it('honors all repeat policies without replaying source and preserves immutability', () => {
    const song = parse('{sov: V}\n[C]first\n{eov}\n\n{sov: V}\n[G]second\n{eov}');
    const before = new ChordProFormatter().format(song);
    const formatter = new TerminalFormatter();
    expect(spans(formatter.format(song)).map((span) => span.text)).toContain('second');
    const hidden = spans(
      formatter.format(song, { layout: { sections: { base: { display: { repeatedSections: 'hide' } } } } }),
    );
    expect(hidden.filter((span) => span.text === 'V')).toHaveLength(1);
    const titles = spans(
      formatter.format(song, {
        layout: { sections: { base: { display: { repeatedSections: 'title_only' } } } },
      }),
    );
    expect(titles.filter((span) => span.text === 'V')).toHaveLength(2);
    expect(titles.map((span) => span.text)).not.toContain('second');
    expect(new ChordProFormatter().format(song)).toBe(before);
  });
  it('supports metadata separators/custom directives and semantic style overrides', () => {
    const document = new TerminalFormatter({
      height: 4,
      metadata: { separator: '/', additionalMetadataDirectives: ['custom'] },
      styles: { chord: { foreground: '#ff0000', bold: true } },
      layout: { header: { height: 1, text: '{artist} {custom}' } },
    }).format(parse('{artist:A}\n{artist:B}\n{custom:yes}\n[C]word'));
    expect(document.rows[0].spans[0].text).toBe('A/B yes');
    expect(document.rows[1].spans[0].style).toEqual({ foreground: '#ff0000', bold: true });
  });
  it('reports unsupported image directives instead of silently omitting them', () => {
    const result = new TerminalFormatter().format(parse('{image: foo.png}'));
    expect(result.diagnostics).toEqual([
      {
        code: 'unsupported-content',
        message: 'Unsupported terminal body item',
        source: { paragraph: 0, line: 0 },
      },
    ]);
    expect(result.rows).toEqual([]);
  });
  it('rejects controls in fixed blocks, including clipped tails', () => {
    expect(() => new TerminalFormatter({
      width: 2,
      layout: { header: { height: 1, text: 'ok\u001b', overflow: 'clip' } },
    }).format(parse('a'))).toThrow(/control/);
  });
});
