import type Metadata from '../../chord_sheet/metadata';
import type Song from '../../chord_sheet/song';
import type {
  TerminalFormatterConfiguration,
  TerminalTextBlock,
} from '../../formatter/configuration/terminal_configuration';
import type { TerminalGeometry, TerminalPage } from './types';

import { TerminalMeasurer } from '../../layout/measurement/terminal_measurer';

function visible(block: TerminalTextBlock, page: number, pages: number): boolean {
  switch (block.condition) {
    case 'first':
      return page === 1;
    case 'last':
      return page === pages;
    case 'not-first':
      return page !== 1;
    default:
      return true;
  }
}

function template(text: string, metadata: Metadata, page: number, pages: number, separator: string): string {
  return text.replace(/\{([\w-]+)\}/g, (_match, key: string) => {
    if (key === 'page') return String(page);
    if (key === 'pages') return String(pages);
    const value = metadata.get(key);
    return Array.isArray(value) ? value.join(separator) : String(value ?? '');
  });
}

export class TerminalBlocks {
  private readonly metadata: Metadata;

  constructor(
    private readonly config: TerminalFormatterConfiguration,
    private readonly geometry: TerminalGeometry,
    private readonly measurer: TerminalMeasurer,
    song: Song,
  ) {
    this.metadata = song.getMetadata(config);
  }

  paint(page: TerminalPage, pages: number): void {
    this.block(this.config.layout.header, page, pages, this.config.layout.global.margins.top, 'header');
    this.block(
      this.config.layout.footer,
      page,
      pages,
      page.height - this.config.layout.global.margins.bottom - (this.config.layout.footer?.height ?? 0),
      'footer',
    );
  }

  private textLines(block: TerminalTextBlock, page: number, pages: number): string[] {
    const text = template(block.text, this.metadata, page, pages, this.config.metadata.separator);
    const lines = this.measurer.splitTextToSize(text, this.geometry.contentWidth);
    return lines.slice(0, block.overflow === 'clip' ? 1 : block.height);
  }

  private block(
    block: TerminalTextBlock | undefined,
    page: TerminalPage,
    pages: number,
    y: number,
    kind: 'header' | 'footer',
  ): void {
    if (!block || !visible(block, page.index, pages)) return;
    const width = this.geometry.contentWidth;
    this.textLines(block, page.index, pages).forEach((line, index) => {
      if (index >= block.height || this.measurer.measureText(line).width > width) return;
      const cells = this.measurer.measureText(line).width;
      const offset = block.align === 'right' ? width - cells : Math.floor((width - cells) / 2);
      page.rows[y + index].spans.push({
        text: line,
        width: cells,
        x: this.geometry.contentX + (block.align && block.align !== 'left' ? offset : 0),
        kind,
        styleRole: kind,
        style: this.config.styles[kind],
      });
    });
  }
}
