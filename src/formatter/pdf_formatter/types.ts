import {
  ImageCompression, ImageOptions, jsPDFOptions, RGBAData, TextOptionsLight,
} from 'jspdf';
import {
  ChordLyricsPair, Comment, Line, SoftLineBreak, Tag,
} from '../../index';
import Item from '../../chord_sheet/item';
import { ParagraphType } from '../../constants';

type FontSection = 'title' | 'subtitle' | 'metadata' | 'text' | 'chord' | 'comment' | 'annotation' | 'sectionLabel';
export type LayoutSection = 'header' | 'footer';
export type Alignment = 'left' | 'center' | 'right';

type SingleCondition = Record<string, {
  exists: boolean;
}>;

export type Condition = {
and?: Condition[];
or?: Condition[];
} | SingleCondition;

export interface Margins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface Position {
  x: Alignment,
  y: number,
  width?: number,
  height?: number,
  clip?: boolean,
  ellipsis?: boolean,
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

export interface FontConfiguration {
  name: string;
  style: string;
  weight?: string | number;
  size: number;
  lineHeight?: number;
  color: string | number;
  underline?: boolean;
  inherit?: string;
}

export type FontConfigurations = Record<FontSection, FontConfiguration>;

export interface SectionDisplay {
  labelStyle?: 'uppercase';
  showLabel?: boolean;
  lyricsOnly?: boolean;
  indent?: number;
  compact?: boolean;
}

export interface SectionTypeConfig {
  fonts?: FontConfigurations;
  display?: SectionDisplay;
  overrides?: {
    condition: Condition;
    display: Partial<SectionDisplay>;
  }[];
}

export interface SectionsConfig {
  global: {
    columnCount: number;
    columnWidth: number;
    columnSpacing: number;
    spacingBottom?: number;
    spacingAfter?: number;
    chordLyricSpacing: number;
    linePadding: number;
    paragraphSpacing?: number;
    chordSpacing: number;
  };
  base: SectionTypeConfig;
  types?: Record<ParagraphType, SectionTypeConfig | undefined>;
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

export interface LayoutContentItemWithLine {
  type: 'line';
  style: {
      color: string; // Color of the line (e.g., "black", "#000000")
      width: number; // Line width in points
      dash?: number[]; // Array for dash pattern, e.g., [2, 2] for dashed lines
  };
  position: {
      x?: number;
      y: number;
      width: number | 'auto';
      height?: number;
  };
  condition?: Condition;
}

export type LayoutContentItem =
  | LayoutContentItemWithValue
  | LayoutContentItemWithTemplate
  | LayoutContentItemWithImage
  | LayoutContentItemWithLine;

export interface LayoutItem {
  height: number,
  content: LayoutContentItem[],
}

export interface LayoutConfig {
  global: {
    margins: Margins;
  };
  header: LayoutItem;
  footer: LayoutItem;
  sections: SectionsConfig;
}

export interface MeasuredItem {
  item: ChordLyricsPair | Comment | SoftLineBreak | Tag | Item | null,
  width: number,
  chordLyricWidthDifference?: number,
  chordHeight?: number,
  adjustedChord?: string,
}

export interface LineLayout {
  type: 'ChordLyricsPair' | 'Comment' | 'Tag' | 'ColumnBreak' | 'SectionLabel'
  items: MeasuredItem[];
  lineHeight: number;
  line?: Line
}

export interface PDFConfiguration {
  version?: string;
  fonts: FontConfigurations;
  layout: LayoutConfig;
}

export interface PdfDoc {
  get internal(): {
    pageSize: {
      getWidth(): number,
    }
  };

  addImage(
    // eslint-disable-next-line no-undef
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
    // eslint-disable-next-line no-undef
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
