import { expect, test } from 'bun:test';

import { createTestRenderer } from '@opentui/core/testing';
import { mountDocument } from './adapter';
import { ChordProParser, TerminalFormatter } from '../../lib/module.js';

test('native renderer paints semantic cells and reflows on resize', async () => {
  const setup = await createTestRenderer({ width: 20, height: 8 });
  try {
    const song = new ChordProParser().parse('[C]Hi [G]界');
    const formatter = new TerminalFormatter({ width: 20, cellWidth: Bun.stringWidth });
    let view = mountDocument(setup.renderer, formatter.format(song));
    await setup.renderOnce();
    expect(setup.captureCharFrame()).toContain('C  G');
    expect(setup.captureCharFrame()).toContain('Hi 界');
    const spans = setup.captureSpans().lines.flatMap((line) => line.spans);
    const chord = spans.find((span) => span.text.includes('C'));
    const lyrics = spans.find((span) => span.text.includes('Hi'));
    expect(chord?.fg).not.toEqual(lyrics?.fg);
    view.destroyRecursively();
    setup.resize(4, 8);
    view = mountDocument(setup.renderer, formatter.configure({ width: 4 }).format(song));
    await setup.renderOnce();
    expect(setup.captureCharFrame()).toContain('界');
    expect(view.height).toBeGreaterThan(2);
  } finally {
    setup.renderer.destroy();
  }
});
