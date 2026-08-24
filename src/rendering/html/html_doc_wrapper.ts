import { DomMeasurer } from '../../layout/measurement';
import { FontConfiguration } from '../../formatter/configuration';

declare const document: any;
declare type HTMLElement = any;

export interface HtmlContentFrame {
  left: number;
  sourceLeft: number;
  width: number;
}

/**
 * HtmlWrapper is responsible for managing the DOM elements for the chord sheet
 */
class HtmlDocWrapper {
  container: HTMLElement;

  pages: HTMLElement[] = [];

  contentFrames: HTMLElement[] = [];

  private contentFrame: HtmlContentFrame | null = null;

  currentPage = 1;

  totalPages = 1;

  pageSize: { width: number; height: number };

  measurer: DomMeasurer;

  constructor(container: HTMLElement, pageSize: { width: number; height: number }) {
    this.container = container;
    this.container.style.width = '100%';
    this.container.style.margin = '0 auto';
    this.pageSize = pageSize;
    this.measurer = new DomMeasurer();

    // Create the first page
    this.createPage();
  }

  /**
   * Creates a new page in the container
   */
  createPage(): HTMLElement {
    const page = document.createElement('div');
    page.className = 'chord-sheet-page';
    page.style.position = 'relative';

    Object.entries(this.pageStyles).forEach(([key, value]) => {
      page.style[key] = value;
    });

    this.container.appendChild(page);
    this.pages.push(page);
    this.totalPages = this.pages.length;

    if (this.contentFrame) {
      this.createContentFrame(page);
    }

    return page;
  }

  get pageStyles(): Record<string, string> {
    return {
      width: `${this.pageSize.width}px`,
      height: `${this.pageSize.height}px`,
      overflow: 'hidden',
      boxSizing: 'border-box',
      backgroundColor: 'var(--studio-display-background-color)',
    };
  }

  /**
   * Creates a new page and advances to it
   */
  newPage(): void {
    this.currentPage += 1;
    if (this.currentPage > this.pages.length) {
      this.createPage();
    }
  }

  /**
   * Sets the current page
   */
  setPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    while (this.pages.length < pageNumber) {
      this.createPage();
    }
  }

  /**
   * Gets the current page element
   */
  getCurrentPage(): HTMLElement {
    return this.pages[this.currentPage - 1];
  }

  setContentFrame(frame: HtmlContentFrame | null): void {
    this.contentFrame = frame;

    if (!frame) {
      this.contentFrames.forEach((contentFrame) => contentFrame.parentNode?.removeChild(contentFrame));
      this.contentFrames = [];
      return;
    }

    this.pages.forEach((page, index) => {
      const contentFrame = this.contentFrames[index] || this.createContentFrame(page);
      this.applyContentFrameStyles(contentFrame);
    });
  }

  private createContentFrame(page: HTMLElement): HTMLElement {
    const contentFrame = document.createElement('div');
    contentFrame.className = 'chord-sheet-content';
    this.applyContentFrameStyles(contentFrame);
    page.appendChild(contentFrame);
    this.contentFrames.push(contentFrame);
    return contentFrame;
  }

  private applyContentFrameStyles(contentFrame: HTMLElement): void {
    if (!this.contentFrame) {
      return;
    }

    Object.assign(contentFrame.style, {
      position: 'absolute',
      left: `${this.contentFrame.left}px`,
      top: '0',
      width: `${this.contentFrame.width}px`,
      height: '100%',
    });
  }

  /**
   * Adds an element to the current page at the specified position
   */
  addElement(element: HTMLElement, x: number, y: number): void {
    const pageIndex = this.currentPage - 1;
    const parent = this.contentFrame ? this.contentFrames[pageIndex] : this.getCurrentPage();
    const relativeX = this.contentFrame ? x - this.contentFrame.sourceLeft : x;

    // Apply positioning styles in one operation
    Object.assign(element.style, {
      position: 'absolute',
      left: `${relativeX}px`,
      top: `${y}px`,
    });

    parent.appendChild(element);
  }

  /**
   * Gets text dimensions using the DOM measurer
   */
  getTextDimensions(text: string, font: FontConfiguration): { w: number; h: number } {
    const { width, height } = this.measurer.measureText(text, font);
    return { w: width, h: height };
  }

  /**
   * Gets text width using the DOM measurer
   */
  getTextWidth(text: string, font: FontConfiguration): number {
    const { width } = this.measurer.measureText(text, font);
    return width;
  }

  /**
   * Splits text to fit within a maximum width
   */
  splitTextToSize(text: string, maxWidth: number, font: FontConfiguration): string[] {
    return this.measurer.splitTextToSize(text, maxWidth, font);
  }

  /**
   * Sets the font style (no-op in HTML renderer)
   */
  setFontStyle(_font: FontConfiguration): void {
    // No-op for HTML, styles are applied directly to elements
  }

  /**
   * Sets line style for drawing (no-op in HTML renderer)
   */
  setLineStyle(_style: any): void {
    // No-op for HTML, styles are applied directly to elements
  }

  /**
   * Resets line dash style (no-op in HTML renderer)
   */
  resetDash(): void {
    // No-op for HTML
  }

  /**
   * Executes a callback for each page
   */
  eachPage(callback: (page: HTMLElement, index: number) => void): void {
    this.pages.forEach((page, index) => {
      this.currentPage = index + 1;
      callback(page, index);
    });
  }

  /**
   * Gets the container element
   */
  getContainer(): HTMLElement {
    return this.container;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.measurer) {
      this.measurer.dispose();
    }
  }
}
export default HtmlDocWrapper;
