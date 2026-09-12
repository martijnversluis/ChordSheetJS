import ChordProParser from '../../src/parser/chord_pro_parser';
import Key from '../../src/key';
import TerminalFormatter from '../../src/formatter/terminal_formatter';

const parse = (text: string) => new ChordProParser().parse(text);
const text = (document) => document.rows.flatMap((row) => row.spans).map((span) => span.text);

describe('TerminalFormatter positioned pages', () => {
  it('places exact-fit columns and rolls into pages using resolved integer geometry', () => {
    const result = new TerminalFormatter({
      width: 13,
      height: 4,
      layout: {
        global: {
          margins: {
            left: 1,
            right: 1,
            top: 1,
            bottom: 1,
          },
        },
        sections: { global: { columnCount: 2, columnSpacing: 1, paragraphSpacing: 0 } },
      },
    }).format(parse('a\nb\nc\nd\ne'));
    expect(result.pages).toHaveLength(2);
    expect(result.geometry.columnWidth).toBe(5);
    expect(result.pages[0].columns.map((column) => [column.x, column.y, column.usedHeight])).toEqual([
      [1, 1, 2],
      [7, 1, 2],
    ]);
    expect(result.pages[0].rows[1].spans.map((span) => [span.text, span.x, span.column])).toEqual([
      ['a', 1, 1],
      ['c', 7, 2],
    ]);
    expect(result.pages[1].rows[1].spans[0].text).toBe('e');
    expect(result.height).toBe(9);
  });
  it('preserves explicit empty destinations and does not double advance', () => {
    const formatter = new TerminalFormatter({
      width: 8,
      height: 2,
      layout: { sections: { global: { columnCount: 2, paragraphSpacing: 0 } } },
    });
    const result = formatter.format(parse('{column_break}\nA\n{column_break}\n{column_break}'));
    expect(result.pages).toHaveLength(2);
    expect(result.pages[0].rows[0].spans[0]).toMatchObject({ text: 'A', column: 2 });
    expect(result.pages[1].columns.every((column) => column.usedHeight === 0)).toBe(true);
  });
  it('keeps fitting paragraphs together and splits oversized wrapped paragraphs losslessly', () => {
    const formatter = new TerminalFormatter({
      width: 4,
      height: 3,
      layout: { sections: { global: { columnCount: 1, paragraphSpacing: 1 } } },
    });
    const result = formatter.format(parse('one\ntwo\n\nabcdabcdabcdabcd'));
    expect(result.pages).toHaveLength(3);
    expect(text(result).join('')).toBe('onetwoabcdabcdabcdabcd');
    expect(result.pages[1].rows[0].spans[0].text).toBe('abcd');
    expect(result.pages[2].rows[0].spans[0].source).toMatchObject({ paragraph: 1, line: 0 });
  });
  it('separates chord gaps from trailing padding and rejects too-short atomic frames', () => {
    const formatter = new TerminalFormatter({
      layout: { sections: { global: { chordLyricSpacing: 1, linePadding: 1 } } },
    });
    const result = formatter.format(parse('[C]word'));
    expect(result.rows.map((row) => row.spans.map((span) => span.text))).toEqual([['C'], [], ['word'], []]);
    expect(() => formatter.format(parse('[C]word'), { height: 3 })).toThrow(/atomic/i);
    expect(formatter.configuration.height).toBeUndefined();
  });
  it('prefers the widest feasible responsive columns when several counts satisfy bounds', () => {
    const formatter = new TerminalFormatter({
      height: 10,
      layout: { sections: { global: { columnSpacing: 2, minColumnWidth: 32, maxColumnWidth: 52 } } },
    });
    expect(formatter.format(parse('a'), { width: 53 }).geometry).toMatchObject({
      columnCount: 1,
      columnWidth: 53,
    });
    expect(formatter.format(parse('a'), { width: 80 }).geometry).toMatchObject({
      columnCount: 2,
      columnWidth: 39,
    });
    expect(formatter.format(parse('a'), { width: 100 }).geometry).toMatchObject({
      columnCount: 2,
      columnWidth: 49,
    });
    expect(formatter.format(parse('a'), { width: 120 }).geometry).toMatchObject({
      columnCount: 3,
      columnWidth: 38,
    });
  });
  it('resolves responsive counts, honors explicit counts and validates bounds', () => {
    const formatter = new TerminalFormatter({
      height: 10,
      layout: { sections: { global: { columnSpacing: 1, minColumnWidth: 3, maxColumnWidth: 5 } } },
    });
    const resolved = formatter.format(parse('a'), { width: 13 });
    expect(resolved.geometry.columnCount).toBe(3);
    expect(resolved.pages[0].columns.filter((column) => column.usedHeight > 0)).toHaveLength(1);
    expect(formatter.format(parse('a'), { width: 9 }).geometry.columnCount).toBe(2);
    const explicit = { width: 13, layout: { sections: { global: { columnCount: 1 } } } };
    expect(() => formatter.format(parse('a'), explicit)).toThrow(/column/i);
    expect(() => formatter.format(parse('a'), {
      layout: { sections: { global: { minColumnWidth: 6, maxColumnWidth: 5 } } },
    })).toThrow(/minimum/i);
    const multiple = new TerminalFormatter({ layout: { sections: { global: { columnCount: 2 } } } });
    expect(() => multiple.format(parse('a'))).toThrow(/height/i);
    const empty = new TerminalFormatter({ height: 1, layout: { global: { margins: { top: 1 } } } });
    expect(() => empty.format(parse('a'))).toThrow();
  });
  it.each([NaN, Infinity, -1, 1.5])('rejects non-cell geometry %s', (height) => {
    expect(() => new TerminalFormatter({ height }).format(parse('a'))).toThrow();
  });
  it('reserves fixed headers/footers, evaluates page totals and clips text', () => {
    const result = new TerminalFormatter({
      width: 8,
      height: 4,
      layout: {
        header: { height: 1, text: '{title}', align: 'center' },
        footer: { height: 1, text: '{page}/{pages}', condition: 'last' },
        sections: { global: { paragraphSpacing: 0 } },
      },
    }).format(parse('{title: Song}\na\nb\nc'));
    expect(result.pages).toHaveLength(2);
    expect(result.pages[0].rows[0].spans[0]).toMatchObject({ text: 'Song', x: 2, kind: 'header' });
    expect(result.pages[0].rows[3].spans).toEqual([]);
    expect(result.pages[1].rows[3].spans[0]).toMatchObject({ text: '2/2', kind: 'footer' });
  });
  it('renders target keys, safe repeat policies, labels and diagnostics', () => {
    const formatter = new TerminalFormatter({ key: Key.parse('D') });
    expect(text(formatter.format(parse('{key:C}\n[C]word')))).toContain('D');
    const song = parse('{sov: Verse}\n[C]First\n{eov}\n\n{sov: Verse}\n[G]Second\n{eov}');
    const result = formatter.format(song, {
      layout: {
        sections: { base: { display: { repeatedSections: 'lyrics_only', labelStyle: 'uppercase' } } },
      },
    });
    expect(text(result)).toContain('Second');
    expect(text(result)).not.toContain('G');
    expect(text(result)).toContain('VERSE');
    expect(
      text(formatter.format(song, { layout: { sections: { base: { display: { showLabel: false } } } } })),
    ).not.toContain('Verse');
    expect(formatter.format(parse('{start_of_tab}\nE---\n{end_of_tab}')).diagnostics.length).toBeGreaterThan(
      0,
    );
  });
});
