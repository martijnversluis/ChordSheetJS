/* eslint-disable no-promise-executor-return */
/* eslint-disable no-dupe-class-members */
/* eslint-disable no-undef */
import JsPDF, {
  ImageCompression, ImageFormat, ImageOptions, jsPDFOptions, RGBAData, TextOptionsLight,
} from 'jspdf';

type ColorString = string;
type ColorShade = number;
type ColorRGB = [number, number, number];
type ColorRGBA = [number, number, number, number];
type RenderColor = ColorShade | ColorString | ColorRGB | ColorRGBA;

interface RenderedImage {
  type: 'image';
  imageData: string | HTMLImageElement | HTMLCanvasElement | Uint8Array | RGBAData;
  format?: ImageFormat;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  alias?: string;
  compression?: ImageCompression;
  rotation?: number;
}

export interface RenderedLine {
  type: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  style?: string | null;
  lineWidth: number;
  color: RenderColor;
}

export interface RenderedText {
  type: 'text';
  text: string;
  x: number;
  y: number;
  options?: TextOptionsLight;
  transform?: any;
  fontName?: string;
  fontSize: number;
  fontStyle?: string;
  fontWeight?: string | number;
  color: RenderColor;
}

export type RenderedItem = RenderedLine | RenderedImage | RenderedText;

class StubbedPdfDoc {
  drawColor: RenderColor = '0 G';

  filename?: string;

  fontName = 'helvetica';

  fontStyle = 'normal';

  fontWeight: string | number = 'normal';

  fontSize = 16;

  internal: any = null;

  jsPDF: JsPDF = new JsPDF();

  lineWidth = 0.200025;

  options: jsPDFOptions;

  renderedItems: RenderedItem[] = [];

  textColor: RenderColor = '0 g';

  constructor(options?: jsPDFOptions) {
    this.options = options || {};
    this.jsPDF = new JsPDF(options);
    this.internal = this.jsPDF.internal;
  }

  addFileToVFS(fileName: string, data: string): StubbedPdfDoc {
    this.jsPDF.addFileToVFS(fileName, data);
    return this;
  }

  addFont(
    postScriptName: string,
    id: string,
    fontStyle: string,
    fontWeight?: string | number,
    encoding?:'StandardEncoding' | 'MacRomanEncoding' | 'Identity-H' | 'WinAnsiEncoding',
    isStandardFont?: boolean,
  ): string {
    return this.jsPDF.addFont(postScriptName, id, fontStyle, fontWeight, encoding, isStandardFont);
  }

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
  ): StubbedPdfDoc;

  addImage(
    imageData: string | HTMLImageElement | HTMLCanvasElement | Uint8Array | RGBAData,
    x: number,
    y: number,
    width: number,
    height: number,
    alias?: string,
    compression?: ImageCompression,
    rotation?: number
  ): StubbedPdfDoc;

  addImage(options: ImageOptions): StubbedPdfDoc;

  addImage(
    imageDataOrOptions:
    | string
    | HTMLImageElement
    | HTMLCanvasElement
    | Uint8Array
    | RGBAData
    | ImageOptions,
    formatOrX?: string | number,
    xOrY?: number,
    yOrWidth?: number,
    widthOrHeight?: number,
    heightOrAlias?: number | string,
    aliasOrCompression?: string | ImageCompression,
    compressionOrRotation?: ImageCompression | number,
    maybeRotation?: number,
  ): StubbedPdfDoc {
    if (typeof imageDataOrOptions === 'object' && 'imageData' in imageDataOrOptions) {
      // This branch handles the ImageOptions case
      const options = imageDataOrOptions as ImageOptions;
      this.renderedItems.push({ type: 'image', ...options });
    } else {
      // This branch handles the cases where imageData and other parameters are passed
      const imageData = imageDataOrOptions as string | HTMLImageElement | HTMLCanvasElement | Uint8Array | RGBAData;

      if (typeof formatOrX === 'string') {
        const format = formatOrX as ImageFormat;
        const x = xOrY;
        const y = yOrWidth;
        const width = widthOrHeight;
        const height = heightOrAlias as number;
        const alias = aliasOrCompression as string;
        const compression = compressionOrRotation as ImageCompression;
        const rotation = maybeRotation as number;

        this.renderedItems.push({
          type: 'image',
          imageData,
          format,
          x,
          y,
          width,
          height,
          alias,
          compression,
          rotation,
        });
      } else {
        const format = undefined;
        const x = formatOrX;
        const y = xOrY;
        const width = yOrWidth;
        const height = widthOrHeight;
        const alias = heightOrAlias as string;
        const compression = aliasOrCompression as ImageCompression;
        const rotation = compressionOrRotation as number;

        this.renderedItems.push({
          type: 'image',
          imageData,
          format,
          x,
          y,
          width,
          height,
          alias,
          compression,
          rotation,
        });
      }
    }

    return this;
  }

  getTextDimensions(text: string, options?: TextOptionsLight): { w: number; h: number } {
    return this.jsPDF.getTextDimensions(text, options);
  }

  line(x1: number, y1: number, x2: number, y2: number, style?: string | null): StubbedPdfDoc {
    this.renderedItems.push({
      type: 'line',
      x1: Math.round(x1),
      y1: Math.round(y1),
      x2: Math.round(x2),
      y2: Math.round(y2),
      style,
      lineWidth: this.lineWidth,
      color: this.drawColor,
    });

    return this;
  }

  save(filename: string, options: { returnPromise: true }): Promise<void>;

  save(filename?: string): StubbedPdfDoc;

  save(filename: string, options?: { returnPromise: true }): Promise<void> | StubbedPdfDoc {
    this.filename = filename;

    if (options?.returnPromise) {
      return new Promise((resolve) => resolve());
    }

    return this;
  }

  setDrawColor(ch1: string | number, ch2?: number, ch3?: number, ch4?: number): StubbedPdfDoc {
    this.drawColor = this.#normalizeColor(ch1, ch2, ch3, ch4);
    return this;
  }

  setFont(fontName: string, fontStyle?: string, fontWeight?: string | number): StubbedPdfDoc {
    this.fontName = fontName;

    if (fontStyle) this.fontStyle = fontStyle;
    if (fontWeight) this.fontWeight = fontWeight;

    this.jsPDF.setFont(fontName, fontStyle, fontWeight);

    return this;
  }

  setFontSize(size: number): StubbedPdfDoc {
    this.fontSize = size;
    this.jsPDF.setFontSize(size);
    return this;
  }

  setLineWidth(width: number): StubbedPdfDoc {
    this.lineWidth = width;
    return this;
  }

  setPage(page: number): StubbedPdfDoc {
    this.jsPDF.setPage(page);
    return this;
  }

  setTextColor(ch1: string): StubbedPdfDoc;

  setTextColor(ch1: number): StubbedPdfDoc;

  setTextColor(ch1: number, ch2: number, ch3: number, ch4?: number): StubbedPdfDoc;

  setTextColor(ch1: string | number, ch2?: number, ch3?: number, ch4?: number): StubbedPdfDoc {
    this.textColor = this.#normalizeColor(ch1, ch2, ch3, ch4);
    return this;
  }

  splitTextToSize(text: string, maxlen: number, options?: any): any {
    return this.jsPDF.splitTextToSize(text, maxlen, options);
  }

  text(text: string | string[], x: number, y: number, options?: TextOptionsLight, transform?: any): StubbedPdfDoc {
    this.renderedItems.push({
      type: 'text',
      text: text.toString(),
      x: Math.round(x),
      y: Math.round(y),
      options,
      transform,
      fontName: this.fontName,
      fontSize: this.fontSize,
      fontStyle: this.fontStyle,
      fontWeight: this.fontWeight,
      color: this.textColor,
    });

    return this;
  }

  #normalizeColor(ch1: string | number, ch2?: number, ch3?: number, ch4?: number): RenderColor {
    const oneArg = ch2 === undefined && ch3 === undefined && ch4 === undefined;
    const threeArgs = ch1 !== undefined && ch2 !== undefined && ch3 !== undefined && ch4 === undefined;
    const fourArgs = ch1 !== undefined && ch2 !== undefined && ch3 !== undefined && ch4 !== undefined;

    if (typeof ch1 === 'string') return ch1;
    if (oneArg) return ch1;
    if (threeArgs) return [ch1, ch2, ch3];
    if (fourArgs) return [ch1, ch2, ch3, ch4];

    throw new Error(`Invalid color: ${ch1}, ${ch2}, ${ch3}, ${ch4}`);
  }
}

export default StubbedPdfDoc;
