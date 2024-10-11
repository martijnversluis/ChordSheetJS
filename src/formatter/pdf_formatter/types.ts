import { ImageCompression, ImageOptions, jsPDFOptions, RGBAData, TextOptionsLight } from 'jspdf';
import { ChordLyricsPair, Comment, SoftLineBreak, Tag } from '../../index';
import Item from '../../chord_sheet/item';

type FontSection = 'title' | 'subtitle' | 'metadata' | 'text' | 'chord' | 'comment' | 'annotation';
export type LayoutSection = 'header' | 'footer';
export type Alignment = 'left' | 'center' | 'right';

export interface FontConfiguration {
  name: string;
  style: string;
  weight?: string | number;
  size: number;
  lineHeight?: number;
  color: string | number;
}

interface Position {
  x: Alignment,
  y: number,
  width?: number,
  height?: number,
}

interface Dimension {
  width: number,
  height: number,
}

interface ILayoutContentItem {
  type: string,
  position: Position,
  condition?: Condition, 
}

export interface LayoutContentItemWithText extends ILayoutContentItem {
  type: 'text',
  style: FontConfiguration,
  value?: string,
  template?: string,
}

interface LayoutContentItemWithValue extends LayoutContentItemWithText {
  value: string,
}

interface LayoutContentItemWithTemplate extends LayoutContentItemWithText {
  template: string,
}

export interface LayoutContentItemWithImage extends ILayoutContentItem {
  type: 'image',
  src: string,
  position: Position,
  compression: ImageCompression,
  size: Dimension,
  alias?: string,
  rotation?: number,
}

export type LayoutContentItemWithLine = {
  type: "line";
  style: {
      color: string; // Color of the line (e.g., "black", "#000000")
      width: number; // Line width in points
      dash?: number[]; // Array for dash pattern, e.g., [2, 2] for dashed lines
  };
  position: {
      x?: number;
      y: number; 
      width: number | "auto"; 
      height?: number;
  };
  condition?: Condition;
};

export type Condition = {
  and?: Condition[];
  or?: Condition[]; 
} | SingleCondition;

interface SingleCondition {
  [key: string]: {
      exists: boolean;
  };
}

export type LayoutContentItem = LayoutContentItemWithValue | LayoutContentItemWithTemplate | LayoutContentItemWithImage | LayoutContentItemWithLine;

export type LayoutItem = {
  height: number,
  content: LayoutContentItem[],
};

export type LineLayout = {
  type: 'ChordLyricsPair' | 'Comment' | 'Tag' | 'ColumnBreak'
  items: MeasuredItem[];
  lineHeight: number;
};

export type MeasuredItem = {
  item: ChordLyricsPair | Comment | SoftLineBreak | Tag | Item,
  width: number,
  chordLyricWidthDifference?: number,
  chordHeight?: number,
  adjustedChord?: string,
};

export type PDFConfiguration = {
  fonts: Record<FontSection, FontConfiguration>,
  margintop: number,
  marginbottom: number,
  marginleft: number,
  marginright: number,
  paragraphSpacing: number,
  chordLyricSpacing: number,
  linePadding: number,
  chordSpacing: number,
  columnCount: number,
  columnWidth: number,
  columnSpacing: number,
  layout: Record<LayoutSection, LayoutItem>,
};

export type PdfDoc = {
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

  getTextDimensions(text: string, options?: TextOptionsLight): { w: number; h: number };

  line(x1: number, y1: number, x2: number, y2: number, style?: string | null): PdfDoc;

  save(filename: string, options: { returnPromise: true }): Promise<void>;
  save(filename?: string): PdfDoc;

  setDrawColor(ch1: string | number, ch2?: number, ch3?: number, ch4?: number): PdfDoc;

  setFont(fontName: string, fontStyle?: string, fontWeight?: string | number): PdfDoc;

  setFontSize(size: number): PdfDoc;

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
      | "StandardEncoding"
      | "MacRomanEncoding"
      | "Identity-H"
      | "WinAnsiEncoding",
    isStandardFont?: boolean
  ): string;
};

export type PdfConstructor = {
  new (options?: jsPDFOptions): PdfDoc;
};
