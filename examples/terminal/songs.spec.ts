import { expect, test } from 'bun:test';

import { ChordProParser, TerminalFormatter } from '../../lib/module.js';
import { getTerminalSongExample, terminalSongExamples } from './songs';

test('offers representative long Playground songs by stable CLI slug', () => {
  expect(terminalSongExamples.map(({ slug }) => slug)).toEqual(['fit-columns', 'kingdom', 'firm-foundation']);
  expect(getTerminalSongExample().slug).toBe('kingdom');
  expect(getTerminalSongExample('firm-foundation').name).toBe('Firm Foundation (He Won\'t)');
  expect(() => getTerminalSongExample('missing')).toThrow('fit-columns, kingdom, firm-foundation');
});

test('long examples paginate and preserve wrapped source-line anchors at terminal widths', () => {
  const parser = new ChordProParser();
  const formatter = new TerminalFormatter({
    width: 31,
    height: 10,
    cellWidth: Bun.stringWidth,
    layout: { sections: { global: { minColumnWidth: 12, columnSpacing: 1, paragraphSpacing: 1 } } },
  });

  terminalSongExamples.forEach(({ content, slug }) => {
    const document = formatter.format(parser.parse(content));
    expect(document.pages.length, slug).toBeGreaterThan(1);
    expect(
      document.pages.flatMap((page) => page.rows).some((row) => row.spans.length > 0),
      slug,
    ).toBe(true);
  });

  const kingdom = formatter.format(parser.parse(getTerminalSongExample('kingdom').content));
  const rowsBySource = new Map<string, Set<number>>();
  kingdom.pages.forEach((page) => page.rows.forEach((row) => row.spans.forEach((span) => {
    if (!span.source) return;
    const key = `${span.source.paragraph}:${span.source.line}`;
    const rows = rowsBySource.get(key) ?? new Set<number>();
    rows.add((page.index - 1) * page.height + row.y);
    rowsBySource.set(key, rows);
  })));
  expect([...rowsBySource.values()].some((rows) => rows.size > 2)).toBe(true);
});
