import {
  BoxRenderable, type CliRenderer, type Renderable, type StylableInput, TextRenderable, bg, bold, dim, fg,
  italic, t, underline,
} from '@opentui/core';
import type {
  TerminalDocument, TerminalPage, TerminalSpan, TerminalStyle, TerminalStyleRole,
} from '../../lib/module.js';

const theme: Partial<Record<TerminalStyleRole, TerminalStyle>> = {
  'chord': { foreground: '#00ffff', bold: true },
  'lyrics': { foreground: '#ffffff' },
  'rhythmSymbol': { foreground: '#88aaff' },
  'barline': { foreground: '#888888' },
  'noChord': { foreground: '#ff8888', dim: true },
  'instruction': { foreground: '#ffff00', italic: true },
  'annotation': { foreground: '#ffaa55' },
  'comment': { foreground: '#aaaaaa', dim: true },
  'section-label': { foreground: '#55ff88', bold: true },
  'header': { foreground: '#55ff88', bold: true },
  'footer': { foreground: '#aaaaaa', dim: true },
};

function styled(span: TerminalSpan) {
  const style = { ...theme[span.styleRole ?? span.kind], ...span.style };
  let content: StylableInput = span.text;
  if (style.foreground) content = fg(style.foreground)(content);
  if (style.background) content = bg(style.background)(content);
  if (style.bold) content = bold(content);
  if (style.dim) content = dim(content);
  if (style.italic) content = italic(content);
  if (style.underline) content = underline(content);
  return t`${content}`;
}

function paint(renderer: CliRenderer, parent: BoxRenderable, span: TerminalSpan, x: number, y: number, width: number) {
  if (x >= width || !span.width) return;
  parent.add(new TextRenderable(renderer, {
    position: 'absolute',
    left: x,
    top: y,
    width: Math.min(span.width, width - x),
    height: 1,
    content: styled(span),
    wrapMode: 'none',
  }));
}

function paintPage(renderer: CliRenderer, view: BoxRenderable, page: TerminalPage, top: number): void {
  const columns = page.columns.map((column) => {
    const box = new BoxRenderable(renderer, {
      position: 'absolute',
      left: column.x,
      top: top + column.y,
      width: column.width,
      height: column.height,
      overflow: 'hidden',
    });
    view.add(box);
    return box;
  });
  page.rows.forEach((row) => row.spans.forEach((span) => {
    const column = span.column ? page.columns[span.column - 1] : undefined;
    if (column) paint(renderer, columns[column.index - 1], span, span.x - column.x, row.y - column.y, column.width);
    else paint(renderer, view, span, span.x, top + row.y, page.width);
  }));
}

/** Paints one page at viewport coordinates; callers own page navigation. */
export function mountPage(
  renderer: CliRenderer,
  document: TerminalDocument,
  pageNumber: number,
  parent: Renderable = renderer.root,
): BoxRenderable {
  const page = document.pages[pageNumber - 1];
  if (!page) throw new Error(`Terminal page ${pageNumber} is out of range`);
  const view = new BoxRenderable(renderer, {
    width: page.width, height: page.height, flexShrink: 0, overflow: 'hidden',
  });
  paintPage(renderer, view, page, 0);
  parent.add(view);
  return view;
}

/** Each body column owns a clipping box, so horizontal overflow cannot invade its neighbor. */
export function mountDocument(
  renderer: CliRenderer,
  document: TerminalDocument,
  parent: Renderable = renderer.root,
): BoxRenderable {
  const view = new BoxRenderable(renderer, {
    width: document.width, height: document.height, flexShrink: 0, overflow: 'hidden',
  });
  let top = 0;
  const gap = document.pages.length > 1 ?
    (document.height - document.pages.reduce((sum, page) => sum + page.height, 0)) / (document.pages.length - 1) : 0;
  document.pages.forEach((page) => {
    paintPage(renderer, view, page, top);
    top += page.height + gap;
  });
  parent.add(view);
  return view;
}
