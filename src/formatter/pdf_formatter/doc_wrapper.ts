import { ImageCompression, jsPDFOptions } from 'jspdf';

import { PdfConstructor } from './types';
import { FontConfiguration, LineStyle, defaultFontConfigurations } from '../configuration';

import {
  NimbusSansLBolBold,
  NimbusSansLBolItaBoldItalic,
  NimbusSansLRegItaItalic,
  NimbusSansLRegNormal,
} from './fonts/NimbusSansLFonts.base64';

const defaultOptions: jsPDFOptions = {
  orientation: 'p',
  unit: 'pt',
  format: 'letter',
  compress: true,
  putOnlyUsedFonts: true,
};

class DocWrapper {
  currentPage = 1;

  fontConfiguration: FontConfiguration = defaultFontConfigurations.text;

  totalPages = 1;

  doc: any;

  static setup(docConstructor: PdfConstructor, options: jsPDFOptions = defaultOptions): DocWrapper {
    return new DocWrapper(docConstructor, options);
  }

  constructor(DocConstructor: PdfConstructor, options: jsPDFOptions) {
    this.doc = new DocConstructor(options);
    this.doc.setLineWidth(0);
    this.doc.setDrawColor(0, 0, 0, 0);
    this.addFonts();
  }

  get pageSize(): { width: number, height: number } {
    return this.doc.internal.pageSize;
  }

  save(filename: string) {
    this.doc.save(filename);
  }

  output() {
    return this.doc.output('blob');
  }

  eachPage(callback: () => void) {
    for (let i = 1; i <= this.totalPages; i += 1) {
      this.setPage(i);
      callback();
    }
  }

  newPage() {
    this.doc.addPage();
    this.totalPages += 1;
    this.currentPage += 1;
  }

  setPage(page: number) {
    this.doc.setPage(page);
    this.currentPage = page;
  }

  setFont(fontName: string, fontStyle?: string, fontWeight?: string | number) {
    this.doc.setFont(fontName, fontStyle, fontWeight);
  }

  getFont() {
    return this.doc.getFont();
  }

  getFontSize() {
    return this.doc.getFontSize();
  }

  getFillColor() {
    return this.doc.getFillColor();
  }

  setFillColor(color: number | string) {
    this.doc.setFillColor(color);
  }

  setFontStyle(styleConfig: FontConfiguration) {
    this.doc.setFont(styleConfig.name, styleConfig.style, styleConfig.weight);
    this.doc.setFontSize(styleConfig.size);
    this.setTextColor(styleConfig.color);
    this.fontConfiguration = styleConfig;
  }

  setFontSize(size: number) {
    this.doc.setFontSize(size);
  }

  withFontConfiguration(fontConfiguration: FontConfiguration | null, callback: () => any): any {
    const previousFontConfiguration = this.fontConfiguration;
    if (fontConfiguration) this.setFontStyle(fontConfiguration);
    const returnValue = callback();
    this.setFontStyle(previousFontConfiguration);
    return returnValue;
  }

  setTextColor(color: string | number) {
    switch (typeof color) {
      case 'string':
        this.doc.setTextColor(color);
        break;
      case 'number':
        this.doc.setTextColor(color);
        break;
      default:
        break;
    }
  }

  getTextDimensions(text: string, fontStyle?: FontConfiguration): { w: number; h: number } {
    if (!text || text.length === 0) {
      return { w: 0, h: 0 };
    }

    return this.withFontConfiguration(fontStyle || null, () => this.doc.getTextDimensions(text));
  }

  getTextWidth(text: string, fontStyle?: FontConfiguration): number {
    return this.getTextDimensions(text, fontStyle).w;
  }

  getTextHeight(text: string, fontStyle?: FontConfiguration): number {
    return this.getTextDimensions(text, fontStyle).h;
  }

  getSpaceWidth(): number {
    return this.getTextWidth(' ');
  }

  text(text: string, x: number, y: number, style?: FontConfiguration) {
    this.withFontConfiguration(style || null, () => {
      this.doc.text(text, x, y);

      if (style?.underline) {
        const { w: textWidth } = this.doc.getTextDimensions(text);
        this.doc.setDrawColor(0);
        this.doc.setLineWidth(1.25);
        this.doc.line(x, y + 3, x + textWidth, y + 3);
      }
    });
  }

  setDrawColor(color: number | string) {
    this.doc.setDrawColor(color);
  }

  setLineWidth(width: number) {
    this.doc.setLineWidth(width);
  }

  splitTextToSize(text: string | null, maxWidth: number, fontStyle?: FontConfiguration) {
    return this.withFontConfiguration(fontStyle || null, () => this.doc.splitTextToSize(text, maxWidth));
  }

  addImage(
    imageData: string,
    format: string,
    x: number,
    y: number,
    width: number,
    height: number,
    alias?: string,
    compression?: ImageCompression,
    rotation?: number,
  ) {
    this.doc.addImage(imageData, format, x, y, width, height, alias, compression, rotation);
  }

  setLineStyle(style: LineStyle) {
    this.doc.setDrawColor(style.color);
    this.doc.setLineWidth(style.width);

    if (style.dash && Array.isArray(style.dash)) {
      this.doc.setLineDash(style.dash);
      this.doc.setLineCap(1);
    } else {
      this.doc.setLineDash([]);
    }
  }

  resetDash() {
    this.doc.setLineDash([]);
  }

  line(x1: number, y1: number, x2: number, y2: number): void {
    this.doc.line(x1, y1, x2, y2);
  }

  circle(x: number, y: number, r: number, style?: string | null): void {
    this.doc.circle(x, y, r, style);
  }

  roundedRect(
    x: number,
    y: number,
    w: number,
    h: number,
    rx: number,
    ry: number,
    style?: string | null,
  ): void {
    this.doc.roundedRect(x, y, w, h, rx, ry, style);
  }

  rect(
    x: number,
    y: number,
    w: number,
    h: number,
    style?: string | null,
  ): void {
    this.doc.rect(x, y, w, h, style);
  }

  withDrawColor(drawColor: number|string, callback: () => void) {
    const previousDrawColor = this.doc.getDrawColor();
    this.doc.setDrawColor(drawColor);
    callback();
    this.doc.setDrawColor(previousDrawColor);
  }

  withFillColor(fillColor: number|string, callback: () => void) {
    const previousFillColor = this.doc.getFillColor();
    this.doc.setFillColor(fillColor);
    callback();
    this.doc.setFillColor(previousFillColor);
  }

  withFontSize(fontSize: number, callback: () => void) {
    const previousFontSize = this.doc.getFontSize();
    this.doc.setFontSize(fontSize);
    callback();
    this.doc.setFontSize(previousFontSize);
  }

  withLineWidth(lineWidth: number, callback: () => void) {
    const previousLineWidth = this.doc.getLineWidth();
    this.doc.setLineWidth(lineWidth);
    callback();
    this.doc.setLineWidth(previousLineWidth);
  }

  private addFonts() {
    this.doc.addFileToVFS('NimbusSansL-Reg.ttf', NimbusSansLRegNormal);
    this.doc.addFont('NimbusSansL-Reg.ttf', 'NimbusSansL-Reg', 'normal');

    this.doc.addFileToVFS('NimbusSansL-Bol.ttf', NimbusSansLBolBold);
    this.doc.addFont('NimbusSansL-Bol.ttf', 'NimbusSansL-Bol', 'bold');

    this.doc.addFileToVFS('NimbusSansL-RegIta-italic.ttf', NimbusSansLRegItaItalic);
    this.doc.addFont('NimbusSansL-RegIta-italic.ttf', 'NimbusSansL-RegIta', 'italic');

    this.doc.addFileToVFS('NimbusSanL-BolIta-bolditalic.ttf', NimbusSansLBolItaBoldItalic);
    this.doc.addFont('NimbusSanL-BolIta-bolditalic.ttf', 'NimbusSansL-BolIta', 'bolditalic');
  }
}

export default DocWrapper;
