import { FontConfiguration } from '../../formatter/configuration';
import { PositionedElement } from '../renderer';

declare type HTMLElement = any;
declare type CSSStyleDeclaration = any;

/**
 * Configuration for HTML element styling
 */
export interface HtmlStylerConfig {
  cssClassPrefix?: string;
  cssClasses?: Record<string, string>;
}

/**
 * Handles styling of HTML elements for the positioned HTML renderer.
 * Extracted to improve modularity and reduce file size.
 */
export class HtmlElementStyler {
  private config: HtmlStylerConfig;

  constructor(config: HtmlStylerConfig) {
    this.config = config;
  }

  /**
   * Gets the CSS class prefix
   */
  get prefix(): string {
    return this.config.cssClassPrefix || 'chord-sheet-';
  }

  /**
   * Applies styles to an HTML element based on its positioned element data
   */
  applyElementStyle(htmlElement: HTMLElement, element: PositionedElement): void {
    const { style } = element;

    if (!style) return;

    const baseStyles = {
      whiteSpace: 'pre',
      lineHeight: style.lineHeight || 1,
    };

    const conditionalStyles = this.getConditionalStyles(style);
    const typeSpecificStyles = this.getTypeSpecificStyles(element);

    Object.assign(
      htmlElement.style,
      baseStyles,
      conditionalStyles,
      typeSpecificStyles,
    );
  }

  /**
   * Gets conditional CSS styles from font configuration
   */
  getConditionalStyles(style: FontConfiguration): Partial<CSSStyleDeclaration> {
    return {
      ...(style.name && { fontFamily: style.name }),
      ...(style.size && { fontSize: `${style.size}px` }),
      ...(style.weight && { fontWeight: style.weight }),
      ...(style.style && { fontStyle: style.style }),
      ...(style.color && { color: style.color }),
      ...(style.underline && { textDecoration: 'underline' }),
      ...(style.textTransform && { textTransform: style.textTransform }),
      ...(style.textDecoration && { textDecoration: style.textDecoration }),
      ...(style.letterSpacing && { letterSpacing: style.letterSpacing }),
    };
  }

  /**
   * Gets type-specific styles for different element types
   */
  getTypeSpecificStyles(element: PositionedElement): Partial<CSSStyleDeclaration> {
    switch (element.type) {
      case 'chord':
        return this.chordStyles(element);
      case 'sectionLabel':
        return { fontWeight: element.style?.weight || 'bold' };
      case 'comment':
        return {
          fontStyle: element.style?.style || 'italic',
          color: element.style?.color || '#666666',
        };
      default:
        return {};
    }
  }

  /**
   * Gets chord-specific styles
   */
  chordStyles(element: PositionedElement): Partial<CSSStyleDeclaration> {
    const { style } = element;
    const contentIsRhythm = element.content === '|' || element.content === '/';
    const chordStyles: Partial<CSSStyleDeclaration> = { color: style?.color || '#0066cc' };

    if (contentIsRhythm && style?.weight && style.weight > 500) {
      chordStyles.fontWeight = '500';
    }

    return chordStyles;
  }

  /**
   * Applies font styles to an HTML element
   */
  applyFontStyle(element: HTMLElement, style: FontConfiguration): void {
    const styles = {
      whiteSpace: 'pre',
      ...(style.name && { fontFamily: `${style.name}` }),
      ...(style.size && { fontSize: `${style.size}px` }),
      ...(style.weight && { fontWeight: style.weight }),
      ...(style.style && { fontStyle: style.style }),
      ...(style.color && { color: style.color }),
      ...(style.underline && { textDecoration: 'underline' }),
      ...(style.lineHeight && { lineHeight: `${style.lineHeight}` }),
    };

    Object.assign(element.style, styles);
  }

  /**
   * Applies ellipsis styling to an element
   */
  applyEllipsisStyle(element: HTMLElement, width: number): void {
    Object.assign(element.style, {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: `${width}px`,
    });
  }

  /**
   * Creates a class name string with the configured prefix
   */
  createClassName(...classes: (string | undefined)[]): string {
    return classes.filter((clazz) => clazz).join(' ');
  }

  /**
   * Gets the custom CSS class for an element type if configured
   */
  getCustomClass(elementType: string): string | undefined {
    return this.config.cssClasses?.[elementType];
  }
}

export default HtmlElementStyler;
