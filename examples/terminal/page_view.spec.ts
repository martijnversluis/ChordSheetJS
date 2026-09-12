import { type TestRendererSetup, createTestRenderer } from '@opentui/core/testing';

import { TerminalPageView } from './page_view';
import { getTerminalSongExample } from './songs';

import { expect, test } from 'bun:test';

import { ChordProParser, TerminalFormatter } from '../../lib/module.js';

async function ready(setup: TestRendererSetup, view: TerminalPageView): Promise<void> {
  await setup.renderOnce();
  view.reflow();
  await setup.renderOnce();
}

function firstSource(view: TerminalPageView) {
  return view.document.pages[view.currentPage - 1].rows
    .flatMap((row) => row.spans)
    .find((span) => span.source)?.source;
}

test('renders one terminal page and redraws it for page navigation', async () => {
  const setup = await createTestRenderer({ width: 40, height: 10 });
  try {
    const song = new ChordProParser().parse(getTerminalSongExample('fit-columns').content);
    const formatter = new TerminalFormatter({
      cellWidth: Bun.stringWidth,
      layout: {
        header: { height: 1, text: '{title} — {page}/{pages}', overflow: 'clip' },
        sections: { global: { minColumnWidth: 32, maxColumnWidth: 52, columnSpacing: 2 } },
      },
    });
    const view = new TerminalPageView(setup.renderer, song, formatter);
    await ready(setup, view);
    expect(view.currentPage).toBe(1);
    expect(view.pageCount).toBeGreaterThan(1);
    expect(setup.captureCharFrame()).toContain(`1/${view.pageCount}`);
    expect(view.shell.getChildren()).toHaveLength(1);

    view.nextPage();
    await setup.renderOnce();
    expect(view.currentPage).toBe(2);
    expect(setup.captureCharFrame()).toContain(`2/${view.pageCount}`);
    expect(view.shell.getChildren()).toHaveLength(1);

    view.previousPage();
    await setup.renderOnce();
    expect(view.currentPage).toBe(1);
    view.lastPage();
    await setup.renderOnce();
    expect(view.currentPage).toBe(view.pageCount);
    view.nextPage();
    expect(view.currentPage).toBe(view.pageCount);
    view.firstPage();
    expect(view.currentPage).toBe(1);
    view.destroy();
  } finally {
    setup.renderer.destroy();
  }
});

test('preserves the visible source page across responsive reflow and transpose', async () => {
  const setup = await createTestRenderer({ width: 40, height: 10 });
  try {
    const song = new ChordProParser().parse(getTerminalSongExample('kingdom').content);
    const view = new TerminalPageView(
      setup.renderer,
      song,
      new TerminalFormatter({
        cellWidth: Bun.stringWidth,
        layout: { sections: { global: { minColumnWidth: 32, maxColumnWidth: 52, columnSpacing: 2 } } },
      }),
    );
    await ready(setup, view);
    view.nextPage();
    await setup.renderOnce();
    const source = firstSource(view);
    expect(source).toBeDefined();

    setup.resize(70, 12);
    await ready(setup, view);
    const pageSources = view.document.pages[view.currentPage - 1].rows
      .flatMap((row) => row.spans)
      .map((span) => span.source);
    expect(
      pageSources.some(
        (candidate) => candidate?.paragraph === source?.paragraph && candidate?.line === source?.line,
      ),
    ).toBe(true);
    expect(view.document.geometry.columnWidth).toBeGreaterThanOrEqual(32);

    view.transposeBy(2);
    await setup.renderOnce();
    expect(view.currentPage).toBeGreaterThanOrEqual(1);
    expect(
      song.lines.flatMap((line) => line.items).some((item) => item.toString().includes('chords=Gm')),
    ).toBe(true);
    view.destroy();
  } finally {
    setup.renderer.destroy();
  }
});
