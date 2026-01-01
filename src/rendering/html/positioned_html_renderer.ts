import ChordLyricsPair from '../../chord_sheet/chord_lyrics_pair';
import Dimensions from '../../layout/engine/dimensions';
import HtmlDocWrapper from './html_doc_wrapper';
import HtmlElementStyler from './html_element_styler';
import Line from '../../chord_sheet/line';
import SoftLineBreak from '../../chord_sheet/soft_line_break';
import Song from '../../chord_sheet/song';
import Tag from '../../chord_sheet/tag';
import { getCapos } from '../../helpers';
import { isComment } from '../../template_helpers';
import { LineLayout, MeasuredItem } from '../../layout/engine';

import LayoutSectionRenderer, { LayoutRenderingBackend } from '../shared/layout_section_renderer';
import Renderer, { ParagraphLayout, PositionedElement } from '../renderer';

import {
  FontConfiguration,
  MeasuredHtmlFormatterConfiguration,
} from '../../formatter/configuration';

declare const document: any;

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * HtmlRenderer renders a song as HTML with absolute positioning
 */
class PositionedHtmlRenderer extends Renderer {
  private configuration: MeasuredHtmlFormatterConfiguration;

  private _dimensions: Dimensions | null = null;

  private _dimensionCacheKey: string | null = null;

  private styler: HtmlElementStyler;

  container: HTMLElement;

  doc: HtmlDocWrapper;

  /**
   * Creates a new HtmlRenderer
   */
  constructor(
    song: Song,
    container: HTMLElement,
    configuration: MeasuredHtmlFormatterConfiguration,
  ) {
    super(song);
    this.container = container;
    this.configuration = configuration;
    this.styler = new HtmlElementStyler({
      cssClassPrefix: configuration.cssClassPrefix,
      cssClasses: configuration.cssClasses,
    });

    if (!container) {
      throw new Error('Container element is required');
    }

    this.doc = new HtmlDocWrapper(container, {
      width: this.configuration.pageSize.width,
      height: this.configuration.pageSize.height,
    });
  }

  //
  // PUBLIC API
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

  getDoc(): HtmlDocWrapper {
    return this.doc;
  }

  getHTML(): HTMLElement {
    return this.container;
  }

  dispose(): void {
    if (this.doc) {
      this.doc.dispose();
    }
  }

  //
  // ABSTRACT METHOD IMPLEMENTATIONS
  //

  protected initializeBackend(): void {
    if (this.configuration.additionalCss) {
      const styleElement = document.createElement('style');
      styleElement.textContent = this.configuration.additionalCss;
      document.head.appendChild(styleElement);
    }
  }

  protected createNewPage(): void {
    this.doc.newPage();
  }

  protected renderChordDiagrams(): void {
    // eslint-disable-next-line no-console
    console.log('Chord diagram rendering is stubbed out');
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
      text: (content, x, y) => this.renderHtmlText(content, x, y),
      getTextWidth: (text, font) => this.doc.getTextWidth(text, font!),
      splitTextToSize: (text, maxWidth, font) => this.doc.splitTextToSize(text, maxWidth, font!),
      setFontStyle: () => { /* no-op for HTML */ },
      addElement: (element, x, y) => this.doc.addElement(element, x, y),
      addImage: (src, _format, x, y, width, height) => this.renderHtmlImage(src, x, y, width, height),
      line: (x1, y1, x2, y2) => this.renderHtmlLine(x1, y1, x2, y2),
      setLineStyle: () => { /* no-op for HTML */ },
      resetDash: () => { /* no-op for HTML */ },
    };
  }

  private renderHtmlText(content: string, x: number, y: number): void {
    const element = document.createElement('div');
    element.className = `${this.styler.prefix}header-text`;
    element.textContent = content;
    this.doc.addElement(element, x, y);
  }

  private renderHtmlImage(src: string, x: number, y: number, width: number, height: number): void {
    const img = document.createElement('img');
    img.className = `${this.styler.prefix}image`;
    img.src = src;
    img.style.width = `${width}px`;
    img.style.height = `${height}px`;
    this.doc.addElement(img, x, y);
  }

  private renderHtmlLine(x1: number, y1: number, x2: number, _y2: number): void {
    const lineElement = document.createElement('div');
    lineElement.className = `${this.styler.prefix}line`;
    lineElement.style.width = `${x2 - x1}px`;
    lineElement.style.height = '1px';
    lineElement.style.borderBottomWidth = '1px';
    lineElement.style.borderBottomStyle = 'solid';
    lineElement.style.borderBottomColor = '#000000';
    this.doc.addElement(lineElement, x1, y1);
  }

  protected renderParagraphs(paragraphLayouts: ParagraphLayout[]): void {
    paragraphLayouts.forEach((layout, index) => {
      this.renderParagraph(layout, index, paragraphLayouts);
    });
  }

  private renderParagraph(layout: ParagraphLayout, paragraphIndex: number, paragraphLayouts: ParagraphLayout[]) {
    const paragraphElements: PositionedElement[] = [];
    const originalElements = this.elements;
    this.elements = paragraphElements;

    layout.units.forEach((lines) => {
      this.renderLineItems(lines);
    });

    const groups = this.groupElementsByPageAndColumn(paragraphElements);

    Object.values(groups).forEach((group, groupIndex) => {
      this.renderElementGroup(group, paragraphIndex, groupIndex, layout);
    });

    if (layout.addSpacing && paragraphIndex < paragraphLayouts.length - 1) {
      this.y += this.getParagraphSpacing();
    }

    this.x = this.getColumnStartX();
    this.elements = originalElements;
  }

  private groupElementsByPageAndColumn(elements: PositionedElement[]): Record<string, PositionedElement[]> {
    const groups: Record<string, PositionedElement[]> = {};
    elements.forEach((el) => {
      const key = `${el.page}-${el.column}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(el);
    });
    return groups;
  }

  protected renderLineItems(lines: LineLayout[]): void {
    let ctx = { column: this.currentColumn, page: this.currentPage };
    lines.forEach((lineLayout) => { ctx = this.renderSingleLine(lineLayout, ctx); });
  }

  private renderSingleLine(
    lineLayout: LineLayout,
    ctx: { column: number; page: number },
  ): { column: number; page: number } {
    if (this.hasColumnBreak(lineLayout)) {
      this.moveToNextColumn();
      return this.getCurrentContext();
    }

    const currentCtx = this.handleColumnOverflow(lineLayout.lineHeight, ctx);
    this.renderLineContent(lineLayout, currentCtx);
    return currentCtx;
  }

  private getCurrentContext(): { column: number; page: number } {
    return { column: this.currentColumn, page: this.currentPage };
  }

  private handleColumnOverflow(
    lineHeight: number,
    ctx: { column: number; page: number },
  ): { column: number; page: number } {
    if (this.y + lineHeight > this.getColumnBottomY()) {
      this.moveToNextColumn();
      return this.getCurrentContext();
    }
    return ctx;
  }

  private renderLineContent(lineLayout: LineLayout, ctx: { column: number; page: number }): void {
    const { items, lineHeight, line } = lineLayout;
    const yOffset = this.y;
    const { chordsYOffset, lyricsYOffset } = this.calculateChordLyricYOffsets(items, yOffset);

    let currentX = this.x;
    items.forEach((measuredItem) => {
      this.renderMeasuredItem(measuredItem, currentX, yOffset, chordsYOffset, lyricsYOffset, items, line, ctx);
      currentX += measuredItem.width;
    });

    this.y += lineHeight;
    this.x = this.getColumnStartX();
  }

  private renderMeasuredItem(
    measuredItem: MeasuredItem,
    currentX: number,
    yOffset: number,
    chordsYOffset: number,
    lyricsYOffset: number,
    items: MeasuredItem[],
    line: Line | null,
    ctx: { column: number; page: number },
  ): void {
    const { item } = measuredItem;
    if (item instanceof ChordLyricsPair) {
      this.renderChordLyricsPairItem(item, currentX, chordsYOffset, lyricsYOffset, items, line as Line, ctx);
    } else if (item instanceof Tag) {
      this.renderTagItem(item, currentX, yOffset, ctx);
    } else if (item instanceof SoftLineBreak) {
      this.addTextElement(item.content, currentX, lyricsYOffset, 'lyrics');
      this.updatePosition(ctx.column, ctx.page);
    }
  }

  private renderChordLyricsPairItem(
    item: ChordLyricsPair,
    currentX: number,
    chordsYOffset: number,
    lyricsYOffset: number,
    items: MeasuredItem[],
    line: Line,
    ctx: { column: number; page: number },
  ): void {
    let { chords } = item;
    const { lyrics } = item;
    if (chords) chords = this.processChords(chords, line);

    if (!this.isLyricsOnly() && chords) {
      const chordBaseline = this.calculateChordBaseline(chordsYOffset, items, chords);
      this.addTextElement(chords, currentX, chordBaseline, 'chord');
      this.updatePosition(ctx.column, ctx.page);
    }

    if (lyrics && lyrics.trim() !== '') {
      this.addTextElement(lyrics, currentX, lyricsYOffset, 'lyrics');
      this.updatePosition(ctx.column, ctx.page);
    }
  }

  private renderTagItem(
    item: Tag,
    currentX: number,
    yOffset: number,
    ctx: { column: number; page: number },
  ): void {
    const isTitleSeparator = item.attributes.__titleSeparator === 'true';

    if (item.isSectionDelimiter()) {
      this.addSectionLabel(item.label, currentX, yOffset, { noUnderline: isTitleSeparator });
      this.updatePosition(ctx.column, ctx.page);
    } else if (isComment(item)) {
      this.addComment(item.value, currentX, yOffset, { noUnderline: isTitleSeparator });
      this.updatePosition(ctx.column, ctx.page);
    }
  }

  private updatePosition(column: number, page: number) {
    const lastElement = this.elements[this.elements.length - 1];
    lastElement.column = column;
    lastElement.page = page;
  }

  protected addSectionLabel(
    label: string,
    x: number,
    y: number,
    options: { noUnderline?: boolean } = {},
  ): void {
    this.addTextElementWithOptions(label, x, y, 'sectionLabel', options);
  }

  protected addComment(
    comment: string,
    x: number,
    y: number,
    options: { noUnderline?: boolean } = {},
  ): void {
    this.addTextElementWithOptions(comment, x, y, 'comment', options);
  }

  private addTextElementWithOptions(
    text: string,
    x: number,
    y: number,
    type: string,
    options: { noUnderline?: boolean } = {},
  ): void {
    const font = this.getFontForType(type);
    const { width, height } = this.measureText(text, font);
    const style = options.noUnderline ? { ...font, underline: false } : font;

    this.elements.push({
      x,
      y,
      width,
      height,
      content: text,
      type,
      style,
      page: this.currentPage,
      column: this.currentColumn,
    });
  }

  protected measureText(text: string, font: FontConfiguration): { width: number; height: number } {
    const { w, h } = this.doc.getTextDimensions(text, font);
    return { width: w, height: h };
  }

  protected calculateChordBaseline(yOffset: number, items: MeasuredItem[], chordText: string): number {
    const chordFont = this.getFontConfiguration('chord');
    const { height } = this.measureText(chordText, chordFont);
    return yOffset + this.getMaxChordHeight(items) - height;
  }

  protected finalizeRendering(): void {
    const pageCount = Math.max(this.currentPage, this.doc.totalPages);

    while (this.doc.totalPages < pageCount) {
      this.doc.createPage();
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

  public get dimensions(): Dimensions {
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

  private calculateBounds(group: PositionedElement[]): Bounds {
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;

    group.forEach((element) => {
      minX = Math.min(minX, element.x);
      minY = Math.min(minY, element.y);
      maxX = Math.max(maxX, element.x + element.width);
      maxY = Math.max(maxY, element.y + element.height);
    });

    return {
      minX, minY, maxX, maxY,
    };
  }

  private createParagraphDiv(bounds: Bounds, classes: (string | undefined)[]) {
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    const div = document.createElement('div');
    div.className = this.styler.createClassName(...classes);

    Object.assign(div.style, {
      position: 'absolute',
      left: `${bounds.minX}px`,
      top: `${bounds.minY}px`,
      width: `${width}px`,
      height: `${height}px`,
    });

    return div;
  }

  private createElementGroupDiv(
    x: number,
    y: number,
    content: string,
    classes: (string | undefined)[],
  ): HTMLElement {
    const div = document.createElement('div');
    div.className = this.styler.createClassName(...classes);

    Object.assign(div.style, {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
    });

    div.textContent = content;
    return div;
  }

  private renderElementGroup(
    group: PositionedElement[],
    paragraphIndex: number,
    groupIndex: number,
    layout: ParagraphLayout,
  ) {
    const { page } = group[0];
    this.doc.setPage(page);

    const bounds = this.calculateBounds(group);
    const { prefix } = this.styler;

    const paragraphDiv = this.createParagraphDiv(bounds, [
      `${prefix}paragraph`,
      `paragraph-${paragraphIndex}-${groupIndex}`,
      `${prefix}${layout.sectionType}`,
    ]);

    group.forEach((element) => {
      this.renderElement(element, bounds, paragraphDiv);
    });

    this.doc.addElement(paragraphDiv, bounds.minX, bounds.minY);
  }

  private renderElement(element: PositionedElement, bounds: Bounds, paragraphDiv: any) {
    const { prefix } = this.styler;
    const htmlElement = this.createElementGroupDiv(
      element.x - bounds.minX,
      element.y - bounds.minY,
      element.content,
      [
        `${prefix}element ${prefix}${element.type}`,
        this.styler.getCustomClass(element.type),
      ],
    );

    this.styler.applyElementStyle(htmlElement, element);
    paragraphDiv.appendChild(htmlElement);
  }

  private drawElement(element: PositionedElement): void {
    switch (element.type) {
      case 'chord':
      case 'lyrics':
      case 'sectionLabel':
      case 'comment':
        this.drawTextElement(element);
        break;
      default:
        // eslint-disable-next-line no-console
        console.warn(`Unknown element type: ${element.type}`);
        break;
    }
  }

  private drawTextElement(element: PositionedElement): void {
    const htmlElement = document.createElement('div');
    const { prefix } = this.styler;
    htmlElement.className = `${prefix}element ${prefix}${element.type}`;

    const customClass = this.styler.getCustomClass(element.type);
    if (customClass) {
      htmlElement.classList.add(customClass);
    }

    htmlElement.textContent = element.content;

    if (element.style) {
      this.styler.applyElementStyle(htmlElement, element);
    }

    this.doc.addElement(htmlElement, element.x, element.y);
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
      layout.header?.height || 0,
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

export default PositionedHtmlRenderer;
