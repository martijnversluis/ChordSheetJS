import { Blob } from 'buffer';

import Dimensions from '../../layout/engine/dimensions';
import DocWrapper from '../../formatter/pdf_formatter/doc_wrapper';
import PdfChordDiagramRenderer from './pdf_chord_diagram_renderer';
import Song from '../../chord_sheet/song';

import { MeasuredItem } from '../../layout/engine';
import { PdfConstructor } from '../../formatter/pdf_formatter/types';
import { getCapos } from '../../helpers';

import LayoutSectionRenderer, { LayoutRenderingBackend } from '../shared/layout_section_renderer';
import Renderer, { PositionedElement } from '../renderer';

import {
  FontConfiguration,
  PDFFormatterConfiguration,
} from '../../formatter/configuration';

class JsPdfRenderer extends Renderer {
  private configuration: PDFFormatterConfiguration;

  private _dimensions: Dimensions | null = null;

  private _dimensionCacheKey: string | null = null;

  doc: DocWrapper;

  constructor(
    song: Song,
    docConstructor: PdfConstructor,
    configuration: PDFFormatterConfiguration,
  ) {
    super(song);
    this.doc = DocWrapper.setup(docConstructor);
    this.configuration = configuration;
  }

  //
  // PUBLIC API IMPLEMENTATION
  //

  getFontConfiguration(objectType: string): FontConfiguration {
    return this.configuration.fonts[objectType];
  }

  getDocumentMetadata(): Record<string, any> {
    return {
      pageWidth: this.getPageWidth(),
      pageHeight: this.getPageHeight(),
      marginLeft: this.getLeftMargin(),
      marginRight: this.getRightMargin(),
      marginTop: this.getTopMargin(),
      marginBottom: this.getBottomMargin(),
      columnWidth: this.getColumnWidth(),
      columnCount: this.getColumnCount(),
      currentPage: this.doc.currentPage,
      totalPages: this.doc.totalPages,
      renderTime: this.renderTime,
      dimensions: this.dimensions,
    };
  }

  save(filename: string): void {
    this.doc.save(filename);
  }

  async generatePDF(): Promise<Blob> {
    return this.doc.output();
  }

  getDoc(): DocWrapper {
    return this.doc;
  }

  //
  // ABSTRACT METHOD IMPLEMENTATIONS
  //

  protected initializeBackend(): void {
    // Any PDF-specific initialization
  }

  protected createNewPage(): void {
    this.doc.newPage();
  }

  protected renderChordDiagrams(): void {
    const { chordDiagrams } = this.configuration.layout;
    const diagramRenderer = new PdfChordDiagramRenderer(
      this.createDiagramContext(),
      this.createDiagramConfig(chordDiagrams),
    );
    diagramRenderer.render();
  }

  private createDiagramContext() {
    return {
      song: this.song,
      doc: this.doc,
      getMinY: () => this.getMinY(),
      getColumnStartX: () => this.getColumnStartX(),
      getColumnBottomY: () => this.getColumnBottomY(),
      moveToNextColumn: () => this.moveToNextColumn(),
      dimensions: this.dimensions,
      getX: () => this.x,
      getY: () => this.y,
      getCurrentColumn: () => this.currentColumn,
      getCurrentPage: () => this.currentPage,
      setPosition: (x: number, y: number, column: number, page: number) => {
        this.x = x;
        this.y = y;
        this.currentColumn = column;
        this.currentPage = page;
      },
    };
  }

  private createDiagramConfig(chordDiagrams: any) {
    return {
      enabled: chordDiagrams.enabled,
      renderingConfig: chordDiagrams.renderingConfig,
      fonts: chordDiagrams.fonts,
      overrides: chordDiagrams.overrides,
    };
  }

  protected renderHeadersAndFooters(): void {
    const layoutRenderer = this.createLayoutRenderer();

    if (this.getHeaderConfig()) {
      this.doc.eachPage(() => {
        layoutRenderer.renderLayout(this.getHeaderConfig()!, 'header');
      });
    }
    if (this.getFooterConfig()) {
      this.doc.eachPage(() => {
        layoutRenderer.renderLayout(this.getFooterConfig()!, 'footer');
      });
    }
  }

  private createLayoutRenderer(): LayoutSectionRenderer {
    const backend = this.createLayoutBackend();
    return new LayoutSectionRenderer(backend, {
      metadata: this.song.metadata,
      margins: this.dimensions.margins,
      extraMetadata: this.getExtraMetadata(this.doc.currentPage, this.doc.totalPages),
    });
  }

  private createLayoutBackend(): LayoutRenderingBackend {
    return {
      pageSize: this.doc.pageSize,
      currentPage: this.doc.currentPage,
      totalPages: this.doc.totalPages,
      text: (content, x, y) => this.doc.text(content, x, y),
      getTextWidth: (text) => this.doc.getTextWidth(text),
      splitTextToSize: (text, maxWidth) => this.doc.splitTextToSize(text, maxWidth),
      setFontStyle: (style) => this.doc.setFontStyle(style),
      addImage: (src, format, x, y, width, height, alias, compression, rotation) => {
        this.doc.addImage(src, format, x, y, width, height, alias, compression, rotation);
      },
      line: (x1, y1, x2, y2) => this.doc.line(x1, y1, x2, y2),
      setLineStyle: (style) => this.doc.setLineStyle(style),
      resetDash: () => this.doc.resetDash(),
      setDrawColor: (color) => this.doc.setDrawColor(color),
      setLineWidth: (width) => this.doc.setLineWidth(width),
    };
  }

  protected measureText(text: string, font: FontConfiguration): { width: number; height: number } {
    const dimensions = this.doc.getTextDimensions(text, font);
    return {
      width: dimensions.w,
      height: dimensions.h,
    };
  }

  protected calculateChordBaseline(yOffset: number, items: MeasuredItem[], chordText: string): number {
    const chordFont = this.getFontConfiguration('chord');
    const chordDimensions = this.doc.getTextDimensions(chordText, chordFont);
    return yOffset + this.getMaxChordHeight(items) - chordDimensions.h;
  }

  protected finalizeRendering(): void {
    const pageCount = Math.max(this.currentPage, this.doc.totalPages);

    while (this.doc.totalPages < pageCount) {
      this.doc.newPage();
    }

    for (let page = 1; page <= pageCount; page += 1) {
      const pageElements = this.getElementsForPage(page);
      if (pageElements.length > 0) {
        this.doc.setPage(page);
        pageElements.forEach((element) => {
          this.drawElement(element);
        });
      }
    }
  }

  //
  // ABSTRACT ACCESSOR IMPLEMENTATIONS
  //

  protected getConfiguration() {
    return this.configuration;
  }

  protected get dimensions(): Dimensions {
    const currentKey = this.generateDimensionCacheKey();
    if (this._dimensionCacheKey !== currentKey || this._dimensions === null) {
      this._dimensions = this.buildDimensions();
      this._dimensionCacheKey = currentKey;
    }
    return this._dimensions;
  }

  protected getDocPageSize(): { width: number; height: number } {
    return this.doc.pageSize;
  }

  //
  // PRIVATE HELPERS
  //

  private drawElement(element: PositionedElement): void {
    if (element.style) {
      this.doc.setFontStyle(element.style);
    }

    switch (element.type) {
      case 'chord':
      case 'lyrics':
      case 'sectionLabel':
      case 'comment': {
        this.doc.text(element.content, element.x, element.y);
        this.drawUnderlineIfNeeded(element);
        break;
      }
      default:
        // eslint-disable-next-line no-console
        console.warn(`Unknown element type: ${element.type}`);
        break;
    }
  }

  private drawUnderlineIfNeeded(element: PositionedElement): void {
    const isTitleSeparator = element.content?.trim() === '>';
    if (element.style?.underline && !isTitleSeparator) {
      const { w: textWidth } = this.doc.getTextDimensions(element.content);
      this.doc.setDrawColor(0);
      this.doc.setLineWidth(1.25);
      this.doc.line(element.x, element.y + 3, element.x + textWidth, element.y + 3);
    }
  }

  private buildDimensions(): Dimensions {
    const { width, height } = this.doc.pageSize;
    const {
      columnCount,
      columnSpacing,
      minColumnWidth,
      maxColumnWidth,
    } = this.configuration.layout.sections.global;

    return new Dimensions(width, height, this.configuration.layout, {
      columnCount,
      columnSpacing,
      minColumnWidth,
      maxColumnWidth,
    });
  }

  private generateDimensionCacheKey(): string {
    const { width, height } = this.doc.pageSize;
    const { layout } = this.configuration;
    const { global } = layout.sections;

    return [
      width,
      height,
      layout.global.margins.left,
      layout.global.margins.right,
      layout.global.margins.top,
      layout.global.margins.bottom,
      layout.header.height,
      global.columnCount,
      global.columnSpacing,
      global.minColumnWidth || 0,
      global.maxColumnWidth || 0,
    ].join('-');
  }

  protected getExtraMetadata(page: number, totalPages: number): Record<string, string | string[]> {
    const baseMetadata: Record<string, string | string[]> = {
      page: page.toString(),
      pages: totalPages.toString(),
      renderTime: this.renderTime.toString(),
    };

    const capo = this.song.metadata.getSingle('capo');
    const key = this.song.metadata.getSingle('key');

    if (capo && key) {
      const capoInt = parseInt(capo, 10);
      baseMetadata.capoKey = getCapos(key)[capoInt];
    }

    return baseMetadata;
  }
}

export default JsPdfRenderer;
