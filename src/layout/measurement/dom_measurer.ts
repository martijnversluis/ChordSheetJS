import { FontConfiguration } from '../../formatter/configuration';
import { BaseMeasurer, TextDimensions } from './measurer';

declare const document: any;
declare type HTMLElement = any;

/**
 * Measures text using DOM elements
 */
export class DomMeasurer extends BaseMeasurer {
  private measureElement: HTMLElement;

  constructor() {
    super();
    // Create an offscreen span element for measuring
    this.measureElement = document.createElement('span');

    // Set styles needed for accurate measurement
    Object.assign(this.measureElement.style, {
      position: 'absolute',
      visibility: 'hidden',
      whiteSpace: 'pre',
      padding: '0',
      margin: '0',
      border: 'none',
      left: '-9999px',
      top: '-9999px',
    });

    // Add to DOM for measuring
    document.body.appendChild(this.measureElement);
  }

  /**
   * Cleans up the DOM element when no longer needed
   */
  public dispose(): void {
    if (this.measureElement.parentNode) {
      this.measureElement.parentNode.removeChild(this.measureElement);
    }
  }

  /**
   * Sets font configuration on the measurement element
   * @param fontConfig The font configuration to apply
   */
  private setFont(fontConfig: FontConfiguration): void {
    const {
      name,
      size,
      weight = 'normal',
      style = 'normal',
      lineHeight = 1,
      textTransform = 'none',
      textDecoration = 'none',
      letterSpacing = 'normal',
    } = fontConfig;

    Object.assign(this.measureElement.style, {
      fontFamily: name,
      fontSize: `${size}px`,
      fontWeight: weight,
      fontStyle: style,
      lineHeight,
      textTransform,
      textDecoration,
      letterSpacing,
    });
  }

  measureText(text: string, fontConfig: FontConfiguration): TextDimensions {
    this.setFont(fontConfig);

    // Set the text content
    this.measureElement.textContent = text || '';

    // Get accurate measurements from the DOM
    const rect = this.measureElement.getBoundingClientRect();

    return {
      width: rect.width,
      height: rect.height,
    };
  }

  splitTextToSize(text: string, maxWidth: number, fontConfig: FontConfiguration): string[] {
    this.setFont(fontConfig);

    return this.splitTextWithMeasure(text, maxWidth, (value) => this.measureWidth(value));
  }

  private measureWidth(text: string): number {
    this.measureElement.textContent = text;
    return this.measureElement.getBoundingClientRect().width;
  }
}
