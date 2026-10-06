import type Song from '../../chord_sheet/song';
import type { PositionedLayout, PositionedLine } from '../../layout/engine/placement_planner';

import type { TerminalFormatterConfiguration } from '../../formatter/configuration/terminal_configuration';
import type {
  TerminalDiagnostic,
  TerminalDocument,
  TerminalGeometry,
  TerminalPage,
  TerminalRow,
} from './types';

import { TerminalBlocks } from './terminal_blocks';
import { TerminalMeasurer } from '../../layout/measurement/terminal_measurer';
import { TerminalRows } from './terminal_rows';

/** Paints a plan without any fit decisions. All pages and projection metadata derive from it. */
export class TerminalDocumentBuilder {
  constructor(
    private readonly config: TerminalFormatterConfiguration,
    private readonly geometry: TerminalGeometry,
    private readonly measurer: TerminalMeasurer,
  ) {}

  build(plan: PositionedLayout, song: Song, diagnostics: TerminalDiagnostic[]): TerminalDocument {
    const pages = Array.from({ length: plan.pageCount }, (_, index) => this.page(index + 1, plan));
    plan.placements.forEach((placement) => this.paint(pages[placement.page - 1], placement, diagnostics));
    const blocks = new TerminalBlocks(this.config, this.geometry, this.measurer, song);
    pages.forEach((page) => blocks.paint(page, pages.length));
    const rows = this.project(pages);
    return {
      width: this.config.width,
      height: rows.length,
      pages,
      rows,
      geometry: this.geometry,
      diagnostics,
    };
  }

  private page(index: number, plan: PositionedLayout): TerminalPage {
    const { config, geometry } = this;
    const used = Math.max(
      geometry.contentY,
      ...plan.placements.filter((line) => line.page === index).map((line) => line.y + line.layout.lineHeight),
    );
    const height = config.height ?? used + config.layout.global.margins.bottom;
    const columns = Array.from({ length: geometry.columnCount }, (_, column) => ({
      index: column + 1,
      x: geometry.contentX + column * (geometry.columnWidth + geometry.columnSpacing),
      y: geometry.contentY,
      width: geometry.columnWidth,
      height: geometry.contentHeight ?? used - geometry.contentY,
      usedHeight: 0,
    }));
    return {
      index,
      width: config.width,
      height,
      columns,
      rows: Array.from({ length: height }, (_, y) => ({ y, spans: [] })),
    };
  }

  private paint(page: TerminalPage, placement: PositionedLine, diagnostics: TerminalDiagnostic[]): void {
    const painter = new TerminalRows(this.measurer, this.config.layout.sections.global.linePadding);
    painter.append(placement.layout);
    const column = page.columns[placement.column - 1];
    column.usedHeight = Math.max(column.usedHeight, placement.y - column.y + placement.layout.lineHeight);
    painter.rows.forEach((row) => row.spans.forEach((span) => {
      const role = span.styleRole ?? span.kind;
      if (span.x + span.width > column.width) {
        diagnostics.push({
          code: 'horizontal-overflow',
          message: 'Span exceeds its terminal column; consumers must clip',
          source: placement.source,
        });
      }
      page.rows[placement.y + row.y].spans.push({
        ...span,
        x: placement.x + span.x,
        column: placement.column,
        source: placement.source,
        style: this.config.styles[role],
      });
    }));
  }

  private project(pages: TerminalPage[]): TerminalRow[] {
    const rows: TerminalRow[] = [];
    pages.forEach((page, index) => {
      if (index) {
        for (let i = 0; i < this.config.layout.global.pageSpacing; i += 1) rows.push({ y: rows.length, spans: [] });
      }
      page.rows.forEach((row) => {
        row.spans.sort((a, b) => a.x - b.x);
        rows.push({ y: rows.length, spans: row.spans.map((span) => ({ ...span })) });
      });
    });
    return rows;
  }
}
