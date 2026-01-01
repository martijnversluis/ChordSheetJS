import { FontConfiguration } from '../../formatter/configuration';
import { BaseMeasurer, TextDimensions } from './measurer';

declare const document: any;
declare type CanvasRenderingContext2D = any;
declare type HTMLCanvasElement = any;

/**
 * Measures text using Canvas API
 */
export class CanvasMeasurer extends BaseMeasurer {
  private canvas: HTMLCanvasElement;

  private context: CanvasRenderingContext2D;

  constructor() {
    super();
    // Create canvas element in memory (no need to add to DOM)
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context not available');
    }
    this.context = ctx;
  }

  /**
   * Sets font configuration on the canvas context
   * @param fontConfig The font configuration to apply
   */
  private setFont(fontConfig: FontConfiguration): void {
    const {
      name, size, weight = 'normal', style = 'normal', letterSpacing,
    } = fontConfig;

    // Set basic font properties
    this.context.font = `${style} ${weight} ${size}px ${name}`;

    // Set additional text properties if supported
    if (letterSpacing !== undefined) {
      this.context.letterSpacing = letterSpacing;
    }
  }

  measureText(text: string, fontConfig: FontConfiguration): TextDimensions {
    this.setFont(fontConfig);

    const metrics = this.context.measureText(text);

    // Get width from metrics
    const { width } = metrics;

    // Calculate height based on font metrics or size
    // Note: For more accurate height calculation, we need font metrics
    let height: number;

    if (metrics.fontBoundingBoxAscent && metrics.fontBoundingBoxDescent) {
      // Modern browsers provide these metrics
      height = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    } else if (metrics.actualBoundingBoxAscent && metrics.actualBoundingBoxDescent) {
      // Alternative metrics for this specific text
      height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    } else {
      // Fallback to approximation based on font size
      height = fontConfig.size * 1.2; // Common approximation
    }

    return { width, height };
  }

  splitTextToSize(text: string, maxWidth: number, fontConfig: FontConfiguration): string[] {
    this.setFont(fontConfig);

    return this.splitTextWithMeasure(text, maxWidth, (value) => this.measureWidth(value));
  }

  private measureWidth(text: string): number {
    return this.context.measureText(text).width;
  }
}
