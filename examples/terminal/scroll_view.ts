import {
  BoxRenderable, type CliRenderer, ScrollBoxRenderable, TextRenderable,
} from '@opentui/core';
import { type Song, type TerminalDocument, TerminalFormatter } from '../../lib/module.js';

import { mountDocument } from './adapter';

/** Persistent focused shell; only the document canvas is replaced on reflow. */
export class TerminalScrollView {
  readonly scroll: ScrollBoxRenderable;

  document!: TerminalDocument;

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
    this.scroll = new ScrollBoxRenderable(renderer, {
      width: '100%',
      height: '100%',
      scrollY: true,
      scrollX: false,
      stickyScroll: false,
      verticalScrollbarOptions: { width: 1, visible: true },
    });
    this.scroll.verticalScrollBar.visible = true;
    renderer.root.add(this.scroll);
    this.scroll.focus();
    this.scroll.viewport.on('resized', this.schedule);
    renderer.on('resize', this.schedule);
    // The live renderer computes Yoga viewport dimensions during its first frame.
    // The eager schedule can therefore see 0×0 even though test renderers do not.
    renderer.once('frame', this.schedule);
    this.schedule();
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
    const { width, height } = this.scroll.viewport;
    if (this.disposed || width < 1 || height < 2) return;
    try {
      this.update(width, height);
      this.lastError = undefined;
    } catch (error) {
      this.showError(error instanceof Error ? error.message : 'Terminal reflow failed');
    }
  }

  private update(width: number, height: number): void {
    const oldTop = this.scroll.scrollTop;
    const anchor = this.document?.rows.find((row) => row.y >= oldTop && row.spans.some((span) => span.source));
    const source = anchor?.spans.find((span) => span.source)?.source;
    const song = this.transpose ? this.song.transpose(this.transpose) : this.song;
    const document = this.formatter.format(song, { width, height });
    const target = document.rows.find((row) => row.spans.some((span) => span.source?.paragraph === source?.paragraph &&
      span.source?.line === source?.line && source !== undefined));
    this.replace(document);
    this.scroll.scrollTo(target && anchor ? target.y - (anchor.y - oldTop) : oldTop);
    this.renderer.requestRender();
  }

  private showError(message: string): void {
    this.lastError = message;
    this.canvas?.destroyRecursively();
    this.canvas = new BoxRenderable(this.renderer, { width: this.scroll.viewport.width, height: 1 });
    this.canvas.add(new TextRenderable(this.renderer, { content: message, wrapMode: 'none', fg: '#ff8888' }));
    this.scroll.add(this.canvas);
  }

  private replace(document: TerminalDocument): void {
    const next = mountDocument(this.renderer, document, this.scroll);
    this.canvas?.destroyRecursively();
    this.canvas = next;
    this.document = document;
  }

  transposeBy(semitones: number): void {
    this.transpose += semitones;
    this.reflow();
  }

  destroy(): void {
    this.disposed = true;
    this.renderer.off('resize', this.schedule);
    this.renderer.off('frame', this.schedule);
    this.scroll.viewport.off('resized', this.schedule);
    this.scroll.destroyRecursively();
  }
}
