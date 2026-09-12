import { type TestRendererSetup, createTestRenderer } from '@opentui/core/testing';

import { TerminalScrollView } from './scroll_view';

import { expect, test } from 'bun:test';

import { ChordProParser, TerminalFormatter } from '../../lib/module.js';

async function ready(setup: TestRendererSetup, view: TerminalScrollView): Promise<void> {
  await setup.renderOnce();
  view.reflow();
  await setup.renderOnce();
}

async function checkResize(setup: TestRendererSetup, view: TerminalScrollView): Promise<void> {
  const shell = view.scroll;
  setup.resize(15, 5);
  await ready(setup, view);
  expect(view.scroll).toBe(shell);
  expect(view.scroll.getChildren()).toHaveLength(1);
  expect(view.document.width).toBe(view.scroll.viewport.width);
  expect(view.document.pages[0].height).toBe(view.scroll.viewport.height);
  expect(view.scroll.focused).toBe(true);
  view.scroll.scrollTo(0);
  await setup.renderOnce();
  setup.mockInput.pressArrow('down');
  await setup.renderOnce();
  expect(view.scroll.scrollTop).toBeGreaterThan(0);
}

test('paints after the renderer first lays out its viewport without manual reflow', async () => {
  const setup = await createTestRenderer({ width: 20, height: 6 });
  try {
    const view = new TerminalScrollView(
      setup.renderer,
      new ChordProParser().parse('[C]Visible'),
      new TerminalFormatter({ layout: { sections: { global: { paragraphSpacing: 0 } } } }),
    );
    await setup.renderOnce();
    await setup.renderOnce();
    expect(setup.captureCharFrame()).toContain('Visible');
    expect(view.scroll.getChildren()).toHaveLength(1);
    view.destroy();
  } finally {
    setup.renderer.destroy();
  }
});

test('persistent ScrollBox paints columns, scrolls and reflows after resize', async () => {
  const setup = await createTestRenderer({ width: 21, height: 6 });
  try {
    const song = new ChordProParser().parse('{key:C}\n[C]First\n[G]Second\n[Am]Third\n[F]Fourth\n[C]Last');
    const formatter = new TerminalFormatter({
      layout: { sections: { global: { columnCount: 2, columnSpacing: 1, paragraphSpacing: 0 } } },
    });
    const view = new TerminalScrollView(setup.renderer, song, formatter);
    await ready(setup, view);
    expect(view.document.geometry.columnCount).toBe(2);
    expect(setup.captureCharFrame()).toContain('First');
    expect(view.scroll.focused).toBe(true);
    view.scroll.scrollTo(view.document.height);
    await setup.renderOnce();
    expect(setup.captureCharFrame()).toContain('Last');
    await checkResize(setup, view);
    view.destroy();
  } finally {
    setup.renderer.destroy();
  }
});

test('uses wider responsive columns and recomputes their count when the viewport changes', async () => {
  const setup = await createTestRenderer({ width: 100, height: 10 });
  try {
    const view = new TerminalScrollView(
      setup.renderer,
      new ChordProParser().parse('[C]A realistically long lyric line that should stay readable'),
      new TerminalFormatter({
        layout: {
          sections: {
            global: {
              minColumnWidth: 32,
              maxColumnWidth: 52,
              columnSpacing: 2,
              paragraphSpacing: 0,
            },
          },
        },
      }),
    );
    await ready(setup, view);
    expect(view.document.geometry).toMatchObject({ columnCount: 2, columnWidth: 48 });
    setup.resize(60, 10);
    await ready(setup, view);
    expect(view.document.geometry).toMatchObject({ columnCount: 1, columnWidth: 59 });
    expect(view.lastError).toBeUndefined();
    view.destroy();
  } finally {
    setup.renderer.destroy();
  }
});

test('invalid transient geometry keeps the focused shell alive and recovers', async () => {
  const setup = await createTestRenderer({ width: 20, height: 6 });
  try {
    const view = new TerminalScrollView(
      setup.renderer,
      new ChordProParser().parse('[C]a'),
      new TerminalFormatter({ layout: { sections: { global: { columnCount: 2 } } } }),
    );
    await ready(setup, view);
    setup.resize(2, 6);
    await ready(setup, view);
    expect(view.lastError).toContain('column');
    expect(view.scroll.focused).toBe(true);
    setup.resize(20, 6);
    await ready(setup, view);
    expect(view.lastError).toBeUndefined();
    expect(view.scroll.getChildren()).toHaveLength(1);
    view.destroy();
  } finally {
    setup.renderer.destroy();
  }
});

test('preserves an occurrence/line anchor when resize adds wraps and supports transpose', async () => {
  const setup = await createTestRenderer({ width: 21, height: 6 });
  try {
    const song = new ChordProParser().parse(
      `{key:C}\n${Array.from({ length: 12 }, (_, i) => `[C]line${i} abcdefghijk`).join('\n')}`,
    );
    const formatter = new TerminalFormatter({ layout: { sections: { global: { paragraphSpacing: 0 } } } });
    const view = new TerminalScrollView(setup.renderer, song, formatter);
    await ready(setup, view);
    const anchor = view.document.rows.find((row) => row.spans.some((span) => span.source?.line === 8));
    expect(anchor).toBeDefined();
    view.scroll.scrollTo(anchor!.y);
    await setup.renderOnce();
    setup.resize(15, 6);
    await ready(setup, view);
    const visible = view.document.rows[Math.floor(view.scroll.scrollTop)].spans;
    expect(visible.some((span) => span.source?.line === 8)).toBe(true);
    view.transposeBy(2);
    await setup.renderOnce();
    expect(setup.captureCharFrame()).toContain('D');
    expect(song.lines[1].items[0].toString()).toContain('chords=C');
    view.destroy();
  } finally {
    setup.renderer.destroy();
  }
});
