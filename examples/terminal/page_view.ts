import {
  BoxRenderable, type CliRenderer, TextRenderable,
} from '@opentui/core';
import {
  type Song, type TerminalDocument, TerminalFormatter, type TerminalSpan,
} from '../../lib/module.js';

import { mountPage } from './adapter';

interface SourceAnchor {
  paragraph: number;
  line: number;
}

/** Persistent viewport shell that redraws exactly one measured terminal page. */
export class TerminalPageView {
  readonly shell: BoxRenderable;

  document!: TerminalDocument;

  currentPage = 1;

  lastError?: string;

  private canvas?: BoxRenderable;

  private disposed = false;

  private queued = false;

  private transpose = 0;

  constructor(
    private readonly renderer: CliRenderer,
    private readonly song: Song,
    private readonly formatter: TerminalFormatter,
  ) {
    this.shell = new BoxRenderable(renderer, {
      width: '100%', height: '100%', overflow: 'hidden',
    });
    this.shell.focusable = true;
    renderer.root.add(this.shell);
    this.shell.focus();
    this.shell.on('resized', this.schedule);
    renderer.on('resize', this.schedule);
    renderer.once('frame', this.schedule);
    this.schedule();
  }

  get pageCount(): number {
    return this.document?.pages.length ?? 0;
  }

  private schedule = (): void => {
    if (this.queued || this.disposed) return;
    this.queued = true;
    queueMicrotask(() => {
      this.queued = false;
      if (!this.disposed) this.reflow();
    });
  };

  reflow(): void {
    const { width, height } = this.shell;
    if (this.disposed || width < 1 || height < 2) return;
    try {
      this.update(width, height);
      this.lastError = undefined;
    } catch (error) {
      this.showError(error instanceof Error ? error.message : 'Terminal reflow failed');
    }
  }

  private update(width: number, height: number): void {
    const anchor = this.firstSource(this.currentPage);
    const song = this.transpose ? this.song.transpose(this.transpose) : this.song;
    const document = this.formatter.format(song, { width, height });
    this.document = document;
    this.currentPage = this.pageFor(anchor) ?? Math.min(this.currentPage, document.pages.length);
    this.replacePage();
  }

  private firstSource(pageNumber: number): SourceAnchor | undefined {
    return this.document?.pages[pageNumber - 1]?.rows
      .flatMap((row) => row.spans).find((span) => span.source)?.source;
  }

  private pageFor(anchor?: SourceAnchor): number | undefined {
    if (!anchor) return undefined;
    const index = this.document.pages.findIndex((page) => (
      page.rows.some((row) => row.spans.some((span) => this.matchesSource(span, anchor)))
    ));
    return index < 0 ? undefined : index + 1;
  }

  private matchesSource(span: TerminalSpan, anchor: SourceAnchor): boolean {
    return span.source?.paragraph === anchor.paragraph && span.source.line === anchor.line;
  }

  private showError(message: string): void {
    this.lastError = message;
    this.canvas?.destroyRecursively();
    this.canvas = new BoxRenderable(this.renderer, { width: this.shell.width, height: 1 });
    this.canvas.add(new TextRenderable(this.renderer, { content: message, wrapMode: 'none', fg: '#ff8888' }));
    this.shell.add(this.canvas);
    this.renderer.requestRender();
  }

  private replacePage(): void {
    const next = mountPage(this.renderer, this.document, this.currentPage, this.shell);
    this.canvas?.destroyRecursively();
    this.canvas = next;
    this.renderer.requestRender();
  }

  goToPage(pageNumber: number): void {
    if (!this.pageCount) return;
    const next = Math.max(1, Math.min(Math.trunc(pageNumber), this.pageCount));
    if (next === this.currentPage) return;
    this.currentPage = next;
    this.replacePage();
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  firstPage(): void {
    this.goToPage(1);
  }

  lastPage(): void {
    this.goToPage(this.pageCount);
  }

  transposeBy(semitones: number): void {
    this.transpose += semitones;
    this.reflow();
  }

  destroy(): void {
    this.disposed = true;
    this.renderer.off('resize', this.schedule);
    this.renderer.off('frame', this.schedule);
    this.shell.off('resized', this.schedule);
    this.shell.destroyRecursively();
  }
}
