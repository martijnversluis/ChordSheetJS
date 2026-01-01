import { ImageCompression } from 'jspdf';

import ChordProParser from '../../parser/chord_pro_parser';
import Condition from '../../layout/engine/condition';
import Metadata from '../../chord_sheet/metadata';
import TextFormatter from '../../formatter/text_formatter';

import {
  Alignment,
  ConditionalRule,
  FontConfiguration,
  LayoutContentItem,
  LayoutContentItemWithImage,
  LayoutContentItemWithLine,
  LayoutContentItemWithText,
  LayoutItem,
  LayoutSection,
  Margins,
} from '../../formatter/configuration';

/**
 * Backend abstraction for layout rendering operations.
 * Both PDF and HTML renderers implement this interface.
 */
export interface LayoutRenderingBackend {
  pageSize: { width: number; height: number };
  currentPage: number;
  totalPages: number;

  // Text operations
  text(content: string, x: number, y: number): void;
  getTextWidth(text: string, font?: FontConfiguration): number;
  splitTextToSize(text: string, maxWidth: number, font?: FontConfiguration): string[];
  setFontStyle(style: FontConfiguration): void;

  // Element operations (HTML-specific, PDF uses text directly)
  addElement?(element: any, x: number, y: number): void;

  // Image operations
  addImage(
    src: string,
    format: string,
    x: number,
    y: number,
    width: number,
    height: number,
    alias?: string,
    compression?: ImageCompression,
    rotation?: number
  ): void;

  // Line operations
  line(x1: number, y1: number, x2: number, y2: number): void;
  setLineStyle(style: any): void;
  resetDash(): void;
  setDrawColor?(color: number): void;
  setLineWidth?(width: number): void;
}

/**
 * Context for rendering layout sections (headers/footers)
 */
export interface LayoutRenderingContext {
  metadata: Metadata;
  margins: Margins;
  extraMetadata: Record<string, string | string[]>;
}

/**
 * Renders layout sections (headers and footers) for both PDF and HTML backends.
 * This extracts the common layout rendering logic that was duplicated across renderers.
 */
export class LayoutSectionRenderer {
  private backend: LayoutRenderingBackend;

  private context: LayoutRenderingContext;

  constructor(backend: LayoutRenderingBackend, context: LayoutRenderingContext) {
    this.backend = backend;
    this.context = context;
  }

  /**
   * Renders a layout section (header or footer)
   */
  renderLayout(layoutConfig: LayoutItem, section: LayoutSection): void {
    const { height } = layoutConfig;
    const { height: pageHeight } = this.backend.pageSize;
    const sectionY = section === 'header' ?
      this.context.margins.top :
      pageHeight - height - this.context.margins.bottom;

    layoutConfig.content.forEach((contentItem) => {
      const item = contentItem as LayoutContentItem;

      if (this.shouldRenderContent(item)) {
        if (item.type === 'text') {
          this.renderTextItem(item as LayoutContentItemWithText, sectionY);
        } else if (item.type === 'image') {
          this.renderImage(item as LayoutContentItemWithImage, sectionY);
        } else if (item.type === 'line') {
          this.renderLine(item as LayoutContentItemWithLine, sectionY);
        }
      }
    });
  }

  /**
   * Determines if a content item should be rendered based on conditions
   */
  private shouldRenderContent(contentItem: LayoutContentItem): boolean {
    if (!contentItem.condition) {
      return true;
    }

    const metadata = {
      ...this.context.metadata.all(),
      ...this.context.extraMetadata,
    };
    return new Condition(contentItem.condition as ConditionalRule, metadata).evaluate();
  }

  /**
   * Renders a text item
   */
  private renderTextItem(textItem: LayoutContentItemWithText, sectionY: number): void {
    const {
      value, template = '', style, position,
    } = textItem;

    const mergedMetadata = this.context.metadata.merge(this.context.extraMetadata);
    const textValue = value || this.evaluateTemplate(template, mergedMetadata);

    if (!textValue) {
      return;
    }

    this.backend.setFontStyle(style);
    const availableWidth = position.width || this.getAvailableWidth();
    const y = sectionY + position.y;

    if (position.clip) {
      this.renderClippedText(textValue, position, availableWidth, y, style);
    } else {
      this.renderMultilineText(textValue, position, availableWidth, y, style);
    }
  }

  /**
   * Renders clipped text with optional ellipsis
   */
  private renderClippedText(
    textValue: string,
    position: any,
    availableWidth: number,
    y: number,
    style: FontConfiguration,
  ): void {
    const clippedText = position.ellipsis ?
      this.clipTextWithEllipsis(textValue, availableWidth, style) :
      this.clipText(textValue, availableWidth, style);
    const textWidth = this.backend.getTextWidth(clippedText, style);
    const x = this.calculateX(position.x, textWidth);
    this.backend.text(clippedText, x, y);
  }

  /**
   * Clips text with ellipsis if it exceeds the maximum width
   */
  private clipTextWithEllipsis(text: string, maxWidth: number, style: FontConfiguration): string {
    let clipped = text;
    while (this.backend.getTextWidth(`${clipped}...`, style) > maxWidth && clipped.length > 0) {
      clipped = clipped.slice(0, -1);
    }
    return clipped !== text ? `${clipped}...` : text;
  }

  /**
   * Clips text to fit within the maximum width
   */
  clipText(text: string, maxWidth: number, style?: FontConfiguration): string {
    let clipped = text;
    while (this.backend.getTextWidth(clipped, style) > maxWidth && clipped.length > 0) {
      clipped = clipped.slice(0, -1);
    }
    return clipped;
  }

  /**
   * Renders multiline text
   */
  private renderMultilineText(
    textValue: string,
    position: any,
    availableWidth: number,
    y: number,
    style: FontConfiguration,
  ): void {
    const lines = this.backend.splitTextToSize(textValue, availableWidth, style);
    let tempY = y;

    lines.forEach((line: string) => {
      const lineWidth = this.backend.getTextWidth(line, style);
      const x = this.calculateX(position.x, lineWidth);
      this.backend.text(line, x, tempY);
      tempY += style.size * (style.lineHeight ?? 1.2);
    });
  }

  /**
   * Renders an image
   */
  private renderImage(imageItem: LayoutContentItemWithImage, sectionY: number): void {
    const {
      src, position, size, alias, compression, rotation,
    } = imageItem;

    const x = this.calculateX(position.x, size.width);
    const y = sectionY + position.y;
    const format = src.split('.').pop()?.toUpperCase() as string;

    this.backend.addImage(src, format, x, y, size.width, size.height, alias, compression, rotation);
  }

  /**
   * Renders a line
   */
  private renderLine(lineItem: LayoutContentItemWithLine, sectionY: number): void {
    const { style, position } = lineItem;
    this.backend.setLineStyle(style);

    const x = this.context.margins.left + (position.x || 0);
    const y = sectionY + position.y;
    const lineWidth = position.width === 'auto' ? this.getAvailableWidth() : position.width;

    this.backend.line(x, y, x + lineWidth, y + (position.height || 0));
    this.backend.resetDash();
  }

  /**
   * Evaluates a template with metadata
   */
  private evaluateTemplate(template: string, metadata: Metadata): string {
    try {
      const parsed = new ChordProParser().parse(template);
      return new TextFormatter().format(parsed, metadata);
    } catch (e) {
      throw new Error(`Error evaluating template\n\n${template}\n\n: ${(e as Error).message}`);
    }
  }

  /**
   * Calculates the X position based on alignment
   */
  calculateX(alignment: Alignment | number, width = 0): number {
    switch (alignment) {
      case 'center':
        return this.backend.pageSize.width / 2 - width / 2;
      case 'right':
        return this.backend.pageSize.width - this.context.margins.right - width;
      case 'left':
      default:
        if (typeof alignment === 'number') {
          return this.context.margins.left + alignment;
        }
        return this.context.margins.left;
    }
  }

  /**
   * Gets the available width for content
   */
  private getAvailableWidth(): number {
    return this.backend.pageSize.width - this.context.margins.left - this.context.margins.right;
  }
}

export default LayoutSectionRenderer;
