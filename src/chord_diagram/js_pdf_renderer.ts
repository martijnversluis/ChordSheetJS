import {
  DimensionOpts, FillColorOpts, FillOpts, PositionOpts, RadiusOpts, Renderer, SizeOpts, ThicknessOpts,
} from './renderer';

import DocWrapper from '../formatter/pdf_formatter/doc_wrapper';
import { ChordDiagramFontConfigurations, FontConfiguration } from '../formatter/configuration';

const defaultWidth = 150;
const defaultHeight = 270;

/**
 * Renderer implementation for drawing chord diagrams to a jsPDF document.
 */
class JsPDFRenderer implements Renderer {
  doc: DocWrapper;

  readonly #x: number;

  readonly #y: number;

  readonly #scale: number;

  height: number;

  width: number;

  fonts: ChordDiagramFontConfigurations;

  constructor(
    doc: DocWrapper,
    {
      x,
      y,
      width,
      fonts,
    }: {
      x: number;
      y: number,
      width: number,
      fonts: ChordDiagramFontConfigurations,
    },
  ) {
    this.doc = doc;
    this.#x = x;
    this.#y = y;
    this.#scale = width / defaultWidth;
    this.width = width;
    this.height = defaultHeight * this.#scale;
    this.fonts = fonts;
  }

  static calculateHeight(width: number): number {
    return defaultHeight * (width / defaultWidth);
  }

  circle({
    x, y, size, fill, thickness,
  }: FillOpts & PositionOpts & SizeOpts & ThicknessOpts) {
    this.withLineWidth(thickness, () => {
      this.doc.withDrawColor(0, () => {
        this.doc.circle(this.tx(x), this.ty(y), this.scale(size / 2), fill ? 'F' : 'S');
      });
    });
  }

  line({
    x1, y1, x2, y2, thickness, color = 0,
  }: { x1: number, y1: number, x2: number, y2: number } & ThicknessOpts & FillColorOpts) {
    this.withLineWidth(thickness, () => {
      this.doc.withFillColor(color, () => {
        this.doc.withDrawColor(color, () => {
          this.doc.line(this.tx(x1), this.ty(y1), this.tx(x2), this.ty(y2));
        });
      });
    });
  }

  rect({
    x, y, width, height, fill, thickness, radius, color = 0,
  }: DimensionOpts & FillOpts & PositionOpts & RadiusOpts & ThicknessOpts & FillColorOpts) {
    this.withLineWidth(thickness, () => {
      this.doc.withDrawColor(color, () => {
        this.doc.withFillColor(color, () => {
          this.doc.roundedRect(
            this.tx(x),
            this.ty(y),
            this.scale(width),
            this.scale(height),
            this.scale(radius),
            this.scale(radius),
            fill ? 'F' : 'S',
          );
        });
      });
    });
  }

  text(text: string, { fontStyle, x, y }: { fontSize: number, fontStyle?: string, x: number, y: number }) {
    const style = fontStyle ?? 'title';
    const font = this.fonts[style] ?? this.fonts.title;
    this.withFontConfiguration(font, () => {
      const textDimensions = this.doc.getTextDimensions(text);
      this.doc.text(text, this.tx(x) - (textDimensions.w / 2), this.ty(y), font);
    });
  }

  private scale(number: number) {
    return number * this.#scale;
  }

  private tx(x: number) {
    return this.#x + this.scale(x);
  }

  private ty(y: number) {
    return this.#y + this.scale(y);
  }

  private withFontConfiguration(fontStyle: FontConfiguration, callback: () => void) {
    this.doc.withFontConfiguration(fontStyle, callback);
  }

  private withLineWidth(lineWidth: number, callback: () => void) {
    this.doc.withLineWidth(this.scale(lineWidth), callback);
  }
}

export default JsPDFRenderer;
