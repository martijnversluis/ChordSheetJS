import {
  ImageCompression,
  ImageOptions,
  RGBAData,
  TextOptionsLight,
  jsPDFOptions,
} from 'jspdf';

export interface PdfDoc {
  get internal(): {
    pageSize: {
      getWidth(): number,
    }
  };

  addImage(
    imageData: string | HTMLImageElement | HTMLCanvasElement | Uint8Array | RGBAData,
    format: string,
    x: number,
    y: number,
    width: number,
    height: number,
    alias?: string,
    compression?: ImageCompression,
    rotation?: number
  ): PdfDoc;

  addImage(
    imageData: string | HTMLImageElement | HTMLCanvasElement | Uint8Array | RGBAData,
    x: number,
    y: number,
    width: number,
    height: number,
    alias?: string,
    compression?: ImageCompression,
    rotation?: number
  ): PdfDoc;

  addImage(options: ImageOptions): PdfDoc;

  circle(x: number, y: number, r: number, style?: string | null): PdfDoc;

  getTextDimensions(text: string, options?: TextOptionsLight): { w: number; h: number };

  line(x1: number, y1: number, x2: number, y2: number, style?: string | null): PdfDoc;

  roundedRect(
    x: number,
    y: number,
    w: number,
    h: number,
    rx: number,
    ry: number,
    style?: string | null
  ): PdfDoc;

  save(filename: string, options: { returnPromise: true }): Promise<void>;
  save(filename?: string): PdfDoc;

  setDrawColor(ch1: string | number, ch2?: number, ch3?: number, ch4?: number): PdfDoc;

  setFont(fontName: string, fontStyle?: string, fontWeight?: string | number): PdfDoc;

  setFontSize(size: number): PdfDoc;

  setPage(page: number): PdfDoc;

  setLineWidth(width: number): PdfDoc;

  setTextColor(ch1: string): PdfDoc;
  setTextColor(ch1: number): PdfDoc;
  setTextColor(ch1: number, ch2: number, ch3: number, ch4?: number): PdfDoc;

  text(text: string | string[], x: number, y: number, options?: TextOptionsLight, transform?: any): PdfDoc;

  addFileToVFS(fileName: string, data: string): PdfDoc;
  addFont(
    postScriptName: string,
    id: string,
    fontStyle: string,
    fontWeight?: string | number,
    encoding?:
      | 'StandardEncoding'
      | 'MacRomanEncoding'
      | 'Identity-H'
      | 'WinAnsiEncoding',
    isStandardFont?: boolean
  ): string;
}

export type PdfConstructor = new (options?: jsPDFOptions) => PdfDoc;
