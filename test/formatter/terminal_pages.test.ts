import ChordProParser from '../../src/parser/chord_pro_parser';
import Key from '../../src/key';
import TerminalFormatter from '../../src/formatter/terminal_formatter';

const parse = (text: string) => new ChordProParser().parse(text);
const text = (document) => document.rows.flatMap((row) => row.spans).map((span) => span.text);
const section = (label: string, count: number) => [
  `{comment: ${label}}`,
  ...Array.from({ length: count }, (_, index) => `[C]Line ${index + 1}`),
].join('\n');
const blackBoxFormatter = (width: number, finite = true) => new TerminalFormatter({
  width,
  ...(finite ? { height: 38 } : {}),
  layout: {
    global: {
      margins: {
        top: 1, right: 3, bottom: 1, left: 3,
      },
    },
    header: { height: 5, text: '{title}' },
    sections: {
      global: {
        minColumnWidth: 32,
        maxColumnWidth: 52,
        columnSpacing: 4,
        paragraphSpacing: 1,
      },
    },
  },
});
const sourceOrder = (document) => document.pages.flatMap((page) => page.columns.flatMap((column) => (
  page.rows.flatMap((row) => row.spans
    .filter((span) => span.column === column.index && span.source)
    .map((span) => [span.source.paragraph, span.source.line]))
)));
const lyricDestinations = (document, paragraph: number) => {
  const destinations = new Map<string, Set<number>>();
  document.pages.forEach((page) => page.rows.forEach((row) => row.spans.forEach((span) => {
    if (span.kind !== 'lyrics' || span.source?.paragraph !== paragraph) return;
    const key = `${page.index}:${span.column}`;
    const lines = destinations.get(key) ?? new Set<number>();
    lines.add(span.source.line);
    destinations.set(key, lines);
  })));
  return [...destinations.entries()]
    .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
    .map(([destination, lines]) => [destination, [...lines].sort((left, right) => left - right)]);
};

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
  describe('paragraph splitting parity', () => {
    it('uses safe remaining space before splitting a five-line section onto the next page', () => {
      const result = blackBoxFormatter(44).format(parse(
        `{title: Split audit}\n${section('First', 10)}\n\n${section('Second', 5)}`,
      ));
      expect(result.geometry).toMatchObject({ columnCount: 1, columnWidth: 38, contentHeight: 31 });
      expect(lyricDestinations(result, 1)).toEqual([
        ['1:1', [1, 2, 3]],
        ['2:1', [4, 5]],
      ]);
      expect(result.pages.map((page) => page.columns[0].usedHeight)).toEqual([29, 4]);
      const unbounded = blackBoxFormatter(44, false).format(parse(
        `{title: Split audit}\n${section('First', 10)}\n\n${section('Second', 5)}`,
      ));
      expect(sourceOrder(result)).toEqual(sourceOrder(unbounded));
    });
    it('continues applying orphan-safe splits across more than two destinations', () => {
      const result = blackBoxFormatter(44).format(parse(`{title: Split audit}\n${section('Very long', 31)}`));
      expect(lyricDestinations(result, 0)).toEqual([
        ['1:1', Array.from({ length: 15 }, (_, index) => index + 1)],
        ['2:1', Array.from({ length: 14 }, (_, index) => index + 16)],
        ['3:1', [30, 31]],
      ]);
    });
    it('keeps two chord/lyric lines after an oversized section break', () => {
      const result = blackBoxFormatter(44).format(parse(`{title: Split audit}\n${section('Long', 16)}`));
      expect(lyricDestinations(result, 0)).toEqual([
        ['1:1', Array.from({ length: 14 }, (_, index) => index + 1)],
        ['2:1', [15, 16]],
      ]);
      expect(result.pages.map((page) => page.columns[0].usedHeight)).toEqual([29, 4]);
    });
    it.each([
      { prefix: '', paragraph: 1, destinations: ['1:1', '1:2'] },
      { prefix: '{column_break}\n\n', paragraph: 2, destinations: ['1:2', '2:1'] },
    ])('applies safe splits across two-column destinations %#', ({ prefix, paragraph, destinations }) => {
      const result = blackBoxFormatter(100).format(parse(
        `{title: Split audit}\n${prefix}${section('First', 10)}\n\n${section('Second', 5)}`,
      ));
      expect(result.geometry).toMatchObject({ columnCount: 2, columnWidth: 45, contentHeight: 31 });
      expect(lyricDestinations(result, paragraph)).toEqual([
        [destinations[0], [1, 2, 3]],
        [destinations[1], [4, 5]],
      ]);
    });
    it.each([
      { prefix: '', paragraph: 0, destinations: ['1:1', '1:2'] },
      { prefix: '{column_break}\n\n', paragraph: 1, destinations: ['1:2', '2:1'] },
    ])('avoids oversized-section orphans across two-column destinations %#', ({
      prefix, paragraph, destinations,
    }) => {
      const result = blackBoxFormatter(100).format(parse(
        `{title: Split audit}\n${prefix}${section('Long', 16)}`,
      ));
      expect(lyricDestinations(result, paragraph)).toEqual([
        [destinations[0], Array.from({ length: 14 }, (_, index) => index + 1)],
        [destinations[1], [15, 16]],
      ]);
    });
    it('preserves wrapped source anchors while splitting without losing body spans', () => {
      const result = new TerminalFormatter({ width: 4, height: 2 }).format(parse('abcdefghijkl'));
      const body = result.pages.flatMap((page) => page.rows.flatMap((row) => row.spans.filter((span) => span.source)));
      expect(result.pages.length).toBeGreaterThan(1);
      expect(body.every((span) => span.source?.paragraph === 0 && span.source.line === 0)).toBe(true);
      expect(body.filter((span) => span.kind === 'lyrics').map((span) => span.text).join('')).toBe('abcdefghijkl');
    });
    it('leaves unbounded terminal documents unpaginated', () => {
      const result = new TerminalFormatter({ width: 38 }).format(parse(section('Long', 16)));
      expect(result.pages).toHaveLength(1);
      expect(lyricDestinations(result, 0)).toEqual([
        ['1:1', Array.from({ length: 16 }, (_, index) => index + 1)],
      ]);
    });
    it('moves three-line sections intact and splits four-line sections two/two', () => {
      const three = blackBoxFormatter(44).format(parse(
        `{title: Split audit}\n${section('First', 13)}\n\n${section('Short', 3)}`,
      ));
      expect(lyricDestinations(three, 1)).toEqual([['2:1', [1, 2, 3]]]);

      const four = blackBoxFormatter(44).format(parse(
        `{title: Split audit}\n${section('First', 11)}\n\n${section('Four', 4)}`,
      ));
      expect(lyricDestinations(four, 1)).toEqual([
        ['1:1', [1, 2]],
        ['2:1', [3, 4]],
      ]);
    });
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
