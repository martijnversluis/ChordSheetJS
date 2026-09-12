import { createTestRenderer } from '@opentui/core/testing';
import { mountDocument } from './adapter';

import { expect, test } from 'bun:test';

import { ChordProParser, TerminalFormatter } from '../../lib/module.js';

// Native assertions complement semantic DTO checks: no overflow may enter a neighboring column.
test('clips overflow per column, preserves wide cells and applies semantic role styles', async () => {
  const setup = await createTestRenderer({ width: 7, height: 3 });
  try {
    const song = new ChordProParser().parse('[Cmaj7]a\n{column_break}\n[G]界Z');
    const formatter = new TerminalFormatter({
      width: 7,
      height: 3,
      styles: { chord: { foreground: '#ff0000', bold: true, underline: true } },
      layout: { sections: { global: { columnCount: 2, columnSpacing: 1 } } },
    });
    mountDocument(setup.renderer, formatter.format(song));
    await setup.renderOnce();
    expect(setup.captureCharFrame().split('\n')[0]).toBe('Cma G  ');
    expect(setup.captureCharFrame()).toContain('界Z');
    const spans = setup.captureSpans().lines.flatMap((line) => line.spans);
    const chord = spans.find((span) => span.text.includes('Cma'));
    const lyric = spans.find((span) => span.text.includes('界Z'));
    expect(chord?.fg).not.toEqual(lyric?.fg);
    expect(chord?.attributes).not.toBe(lyric?.attributes);
  } finally {
    setup.renderer.destroy();
  }
});

test('styleRole takes precedence over rhythm token kind', async () => {
  const setup = await createTestRenderer({ width: 10, height: 3 });
  try {
    const song = new ChordProParser().parse('[/] [x]');
    mountDocument(setup.renderer, new TerminalFormatter({ width: 10, height: 3 }).format(song));
    await setup.renderOnce();
    const spans = setup.captureSpans().lines.flatMap((line) => line.spans);
    expect(spans.find((span) => span.text.includes('/'))?.fg).not.toEqual(
      spans.find((span) => span.text.includes('x'))?.fg,
    );
  } finally {
    setup.renderer.destroy();
  }
});

test('drops an indivisible wide glyph in a one-cell column without painting into its gap', async () => {
  const setup = await createTestRenderer({ width: 3, height: 1 });
  try {
    const song = new ChordProParser().parse('界\n{column_break}\nZ');
    const document = new TerminalFormatter({
      width: 3,
      height: 1,
      layout: { sections: { global: { columnCount: 2, columnSpacing: 1 } } },
    }).format(song);
    expect(document.pages[0].rows[0].spans[0].width).toBe(2);
    mountDocument(setup.renderer, document);
    await setup.renderOnce();
    expect(setup.captureCharFrame()).toBe('  Z\n');
  } finally {
    setup.renderer.destroy();
  }
});
