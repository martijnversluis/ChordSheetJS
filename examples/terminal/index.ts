import { TerminalPageView } from './page_view';
import { TerminalScrollView } from './scroll_view';
import { createTestRenderer } from '@opentui/core/testing';
import { stringWidth } from 'bun';

import { ChordProParser, TerminalFormatter } from '../../lib/module.js';
import { type CliRenderer, type KeyEvent, createCliRenderer } from '@opentui/core';
import { getTerminalSongExample, terminalSongExamples } from './songs';

const parser = new ChordProParser();
const smokeSong = parser.parse(
  `{title: Terminal smoke song}\n{key:C}\n${Array.from(
    { length: 24 },
    (_, i) => `[C]Hello ${i + 1} [G]界`,
  ).join('\n')}`,
);

function createFormatter(): TerminalFormatter {
  return new TerminalFormatter({
    cellWidth: stringWidth,
    layout: {
      global: {
        margins: {
          top: 1, right: 3, bottom: 1, left: 3,
        },
      },
      header: { height: 1, text: '{title} — {page}/{pages}', overflow: 'clip' },
      sections: { global: { minColumnWidth: 32, maxColumnWidth: 52, columnSpacing: 4 } },
    },
  });
}

function requestedSong(args: string[]): string | undefined {
  const inline = args.find((argument) => argument.startsWith('--song='));
  if (inline) return inline.slice('--song='.length);
  const index = args.indexOf('--song');
  if (index < 0) return undefined;
  if (!args[index + 1]) throw new Error('--song requires a slug; use --list-songs to see choices');
  return args[index + 1];
}

const pageActions: Record<string, (view: TerminalPageView) => void> = {
  left: (view) => view.previousPage(),
  up: (view) => view.previousPage(),
  pageup: (view) => view.previousPage(),
  k: (view) => view.previousPage(),
  right: (view) => view.nextPage(),
  down: (view) => view.nextPage(),
  pagedown: (view) => view.nextPage(),
  j: (view) => view.nextPage(),
  home: (view) => view.firstPage(),
  end: (view) => view.lastPage(),
};

function exitsViewer(key: KeyEvent): boolean {
  return key.name === 'q' || (key.ctrl && key.name === 'c');
}

function bindKeys(renderer: CliRenderer, view: TerminalPageView | TerminalScrollView): void {
  renderer.keyInput.on('keypress', (key: KeyEvent) => {
    if (exitsViewer(key)) {
      view.destroy();
      renderer.destroy();
      return;
    }
    if (view instanceof TerminalPageView) {
      const action = pageActions[key.name] ?? (key.sequence === ' ' ? pageActions.right : undefined);
      action?.(view);
    } else if (key.name === 'j') view.scroll.scrollBy(1);
    else if (key.name === 'k') view.scroll.scrollBy(-1);
    if (key.sequence === '+') view.transposeBy(1);
    if (key.sequence === '-') view.transposeBy(-1);
  });
}

async function smoke(): Promise<void> {
  const setup = await createTestRenderer({ width: 40, height: 10 });
  try {
    const view = new TerminalScrollView(setup.renderer, smokeSong, createFormatter());
    await setup.renderOnce();
    view.reflow();
    await setup.renderOnce();
    if (!setup.captureCharFrame().includes('Hello')) throw new Error('Native frame missing lyrics');
    view.scroll.scrollTo(view.document.height);
    await setup.renderOnce();
    if (!setup.captureCharFrame().includes('24')) throw new Error('Native scroll did not reach last lyric');
    view.destroy();
  } finally {
    setup.renderer.destroy();
  }
}

async function interactive(slug?: string, scrolling = false): Promise<void> {
  const example = getTerminalSongExample(slug);
  const renderer = await createCliRenderer();
  const song = parser.parse(example.content);
  const view = scrolling ?
    new TerminalScrollView(renderer, song, createFormatter()) :
    new TerminalPageView(renderer, song, createFormatter());
  bindKeys(renderer, view);
}

const args = process.argv.slice(2);
if (args.includes('--list-songs')) {
  terminalSongExamples.forEach(({ slug, name }) => process.stdout.write(`${slug}\t${name}\n`));
} else if (args.includes('--smoke')) {
  await smoke();
  process.stdout.write('OpenTUI native scroll smoke passed\n');
} else await interactive(requestedSong(args), args.includes('--scroll'));
