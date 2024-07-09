import JsPDF, { ImageCompression } from 'jspdf';
import Formatter from './formatter';
import { isChordLyricsPair, isComment, isTag, lineHasContents } from '../template_helpers';
import Song from '../chord_sheet/song';
import ChordProParser from '../parser/chord_pro_parser';
import TextFormatter from './text_formatter';
import Paragraph from '../chord_sheet/paragraph';
import Line from '../chord_sheet/line';
import { ChordLyricsPair, Comment, SoftLineBreak, Tag } from '../index';

type FontSection = 'title' | 'subtitle' | 'metadata' | 'text' | 'chord' | 'comment' | 'annotation';
type LayoutSection = 'header' | 'footer';
type Alignment = 'left' | 'center' | 'right';

interface FontConfiguration {
  name: string;
  style: string;
  size: number;
  color: string | number;
}

interface Position {
  x: Alignment,
  y: number,
}

interface Dimension {
  width: number,
  height: number,
}

interface ILayoutContentItem {
  type: string,
  position: Position,
}

interface LayoutContentItemWithText extends ILayoutContentItem {
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

interface LayoutContentItemWithImage extends ILayoutContentItem {
  type: 'image',
  src: string,
  position: Position,
  compression: ImageCompression,
  size: Dimension,
  alias?: string,
  rotation?: number,
}

type LayoutContentItem = LayoutContentItemWithValue | LayoutContentItemWithTemplate | LayoutContentItemWithImage;

type LayoutItem = {
  height: number,
  content: LayoutContentItem[],
};

type MeasuredItem = {
  item: ChordLyricsPair | Comment | SoftLineBreak,
  width: number,
  chordHeight?: number,
};

type PDFConfiguration = {
  fonts: Record<FontSection, FontConfiguration>,
  margintop: number,
  marginbottom: number,
  marginleft: number,
  marginright: number,
  lineHeight: number,
  chordLyricSpacing: number,
  linePadding: number,
  numberOfSpacesToAdd: number,
  columnCount: number,
  columnWidth: number,
  columnSpacing: number,
  layout: Record<LayoutSection, LayoutItem>,
};

const defaultConfiguration: PDFConfiguration = {
  // Font settings for various elements
  fonts: {
    title: {
      name: 'helvetica', style: 'bold', size: 24, color: 'black',
    },
    subtitle: {
      name: 'helvetica', style: 'normal', size: 10, color: 100,
    },
    metadata: {
      name: 'helvetica', style: 'normal', size: 10, color: 100,
    },
    text: {
      name: 'helvetica', style: 'normal', size: 10, color: 'black',
    },
    chord: {
      name: 'helvetica', style: 'bold', size: 10, color: 'black',
    },
    comment: {
      name: 'helvetica', style: 'bold', size: 10, color: 'black',
    },
    annotation: {
      name: 'helvetica', style: 'normal', size: 10, color: 'black',
    },
  },
  // Layout settings
  margintop: 25,
  marginbottom: 10,
  marginleft: 25,
  marginright: 25,
  lineHeight: 5,
  chordLyricSpacing: 0,
  linePadding: 8,
  numberOfSpacesToAdd: 2,
  columnCount: 2,
  columnWidth: 0,
  columnSpacing: 25,
  layout: {
    header: {
      height: 60,
      content: [
        {
          type: 'text',
          template: '%{title}',
          style: {
            name: 'helvetica', style: 'bold', size: 24, color: 'black',
          },
          position: { x: 'left', y: 15 },
        },
        {
          type: 'text',
          template: 'Key of %{key} - BPM %{tempo} - Time %{time}',
          style: {
            name: 'helvetica', style: 'normal', size: 12, color: 100,
          },
          position: { x: 'left', y: 28 },
        },
        {
          type: 'text',
          template: 'By %{artist} %{subtitle}',
          style: {
            name: 'helvetica', style: 'normal', size: 10, color: 100,
          },
          position: { x: 'left', y: 38 },
        },
      ],
    },
    footer: {
      height: 30,
      content: [
        {
          type: 'text',
          value: '©2024 My Music Publishing',
          style: {
            name: 'helvetica', style: 'normal', size: 10, color: 'black',
          },
          position: { x: 'left', y: 0 },
        },
      ],
    },
  },
};

class PdfFormatter extends Formatter {
  song: Song = new Song();

  y: number = 0;

  x: number = 0;

  doc: JsPDF = new JsPDF();

  startTime: number = 0;

  currentColumn: number = 1;

  columnWidth: number = 0;

  pdfConfiguration: PDFConfiguration = defaultConfiguration;

  fontConfiguration: FontConfiguration = defaultConfiguration.fonts.text;

  // Configuration settings for the PDF document
  // Main function to format and save the song as a PDF
  format(song: Song, configuration: PDFConfiguration = defaultConfiguration): void {
    this.startTime = performance.now();
    this.song = song;
    this.pdfConfiguration = configuration;
    this.doc = this.setupDoc();
    this.renderLayout(this.pdfConfiguration.layout.header, 'header');
    this.renderLayout(this.pdfConfiguration.layout.footer, 'footer');
    this.y = this.pdfConfiguration.margintop + this.pdfConfiguration.layout.header.height;
    this.x = this.pdfConfiguration.marginleft;
    this.formatParagraphs();
    this.recordFormattingTime();
  }

  // Save the formatted document as a PDF file
  save(): void {
    this.doc.save(`${this.song.title || 'untitled'}.pdf`);
  }

  // Generate the PDF as a Blob object
  async generatePDF(): Promise<Blob> {
    return new Promise((resolve): void => {
      const blob = this.doc.output('blob');
      resolve(blob);
    });
  }

  // Document setup configurations
  setupDoc(): JsPDF {
    const doc = new JsPDF('portrait', 'px');
    doc.setLineWidth(0);
    doc.setDrawColor(0, 0, 0, 0);
    const pageWidth = doc.internal.pageSize.getWidth();

    const {
      marginleft,
      marginright,
      columnCount,
      columnSpacing,
    } = this.pdfConfiguration;

    this.columnWidth = (pageWidth - marginleft - marginright - ((columnCount - 1) * columnSpacing)) / columnCount;
    return doc;
  }

  // Renders the layout for header and footer
  renderLayout(layoutConfig: LayoutItem, section: LayoutSection) {
    const { height } = layoutConfig;
    const { margintop, marginbottom } = this.pdfConfiguration;
    const pageHeight = this.doc.internal.pageSize.getHeight();
    const sectionY = section === 'header' ? margintop : pageHeight - height - marginbottom;

    layoutConfig.content.forEach((contentItem) => {
      if (contentItem.type === 'text') {
        this.renderTextItem(contentItem, sectionY);
      } else if (contentItem.type === 'image') {
        this.renderImage(contentItem, sectionY);
      }
    });
  }

  withFontConfiguration(fontConfiguration: FontConfiguration | null, callback: () => any): any {
    const previousFontConfiguration = this.fontConfiguration;
    if (fontConfiguration) this.setFontStyle(fontConfiguration);
    const returnValue = callback();
    this.setFontStyle(previousFontConfiguration);
    return returnValue;
  }

  // Renders individual text items
  renderTextItem(textItem: LayoutContentItemWithText, sectionY: number) {
    const {
      value,
      template,
      style,
      position,
    } = textItem;

    const textValue = template
      ? this.interpolateMetadata(template, this.song)
      : value as string;

    this.setFontStyle(style);
    const x = this.calculateX(position.x);
    const y = sectionY + position.y;
    this.doc.text(textValue, x, y);
  }

  // Renders individual image items
  renderImage(imageItem: LayoutContentItemWithImage, sectionY: number) {
    const {
      src,
      position,
      size,
      alias,
      compression,
      rotation,
    } = imageItem;

    // Determine the x position based on the alignment
    const x = this.calculateX(position.x, size.width);

    // Adjust y position based on sectionY and the provided y offset
    const y = sectionY + position.y;

    // Determine the format of the image based on the file extension or provided format
    const format = src.split('.').pop()?.toUpperCase() as string; // Assumes src is a filename with extension

    // Add the image to the PDF
    // imageData can be a base64 string, an HTMLImageElement, HTMLCanvasElement, Uint8Array, or RGBAData
    this.doc.addImage(src, format, x, y, size.width, size.height, alias, compression, rotation);
  }

  // Helper method to interpolate metadata
  interpolateMetadata(template: string, song: Song): string {
    const parsedTemplate = new ChordProParser().parse(template);
    return new TextFormatter().format(parsedTemplate, song.metadata);
  }

  // Helper method to calculate x position based on alignment
  calculateX(alignment: Alignment, width: number = 0): number {
    switch (alignment) {
      case 'center':
        return (this.doc.internal.pageSize.getWidth() / 2) - (width / 2);
      case 'right':
        return this.doc.internal.pageSize.getWidth() - this.pdfConfiguration.marginright - width;
      case 'left':
      default:
        return this.pdfConfiguration.marginleft;
    }
  }

  formatParagraphs() {
    const pageHeight = this.doc.internal.pageSize.getHeight();
    const { margintop, marginbottom } = this.pdfConfiguration;
    const footerHeight = this.pdfConfiguration.layout.footer.height;
    const columnHeight = pageHeight - margintop - marginbottom - footerHeight;
    const { bodyParagraphs } = this.song;

    bodyParagraphs.forEach((paragraph) => {
      this.formatParagraph(paragraph, columnHeight);
    });
  }

  formatParagraph(paragraph: Paragraph, columnHeight: number) {
    const { lineHeight } = this.pdfConfiguration;

    paragraph.lines.forEach((line) => {
      if (lineHasContents(line)) {
        if (this.y + lineHeight > columnHeight) {
          this.moveToNextColumn(columnHeight);
        }
        this.formatLine(line);
        this.y += this.pdfConfiguration.lineHeight;
      }
    });
  }

  formatLine(line: Line) {
    const chordFont = this.getFontConfiguration('chord');
    const lyricsFont: FontConfiguration = this.getFontConfiguration('text');
    const commentFont: FontConfiguration = this.getFontConfiguration('comment');

    const renderedLine = line.items.map((item) => {
      if (isChordLyricsPair(item)) {
        const chordLyricsPair = item as ChordLyricsPair;
        const { chords, lyrics } = chordLyricsPair;
        const chordWidth = this.getTextDimensions(chords, chordFont).w;
        const lyricWidth = this.getTextDimensions(lyrics, lyricsFont).w;
        const pairWidth = Math.max(chordWidth, lyricWidth);

        return {
          item: chordLyricsPair,
          width: pairWidth,
          chordHeight: this.getTextDimensions(chords, chordFont).h,
        };
      } else if (isTag(item) && isComment(item as Tag)) {
        const comment = item as Comment;
        const commentWidth = this.getTextDimensions(comment.content, commentFont).w;

        return {
          item: comment,
          width: commentWidth,
        };
      } else {
        return { item, width: 0 };
      }
    });

    this.renderLineItems(renderedLine);
  }

  renderLineItems(items: MeasuredItem[]) {
    const chordFont = this.getFontConfiguration('chord');
    const lyricsFont: FontConfiguration = this.getFontConfiguration('text');
    const spaceWidth = this.getSpaceWidth();
    const maxChordHeight = items.reduce((maxHeight, { chordHeight }) => Math.max(maxHeight, chordHeight || 0), 0);
    const [first, ...rest] = items;
    const { chordLyricSpacing, numberOfSpacesToAdd } = this.pdfConfiguration;

    if (!first) {
      this.carriageReturn();
      this.lineFeed(maxChordHeight);
      return;
    }

    const { item, width } = first;

    if (item instanceof ChordLyricsPair) {
      const { chords, lyrics } = item as ChordLyricsPair;

      if (this.x + width > this.maxX) {
        this.lineFeed(maxChordHeight);
        this.carriageReturn();
      }

      if (chords) {
        const chordBaseline = this.y + maxChordHeight - this.getTextDimensions(chords, chordFont).h;
        this.renderText(chords, this.x, chordBaseline, chordFont);
      }

      if (lyrics && lyrics.trim() !== '') {
        const lyricsY = this.y + maxChordHeight + chordLyricSpacing;
        this.renderText(lyrics, this.x, lyricsY, lyricsFont);
      }

      this.x += width + (numberOfSpacesToAdd || 0) * spaceWidth;
    } else if (item instanceof Comment) {
      this.formatComment((item as Comment).content);
    } else if (item instanceof SoftLineBreak) {
      const totalRemainingWidth = rest.reduce((totalWidth, { width: itemWidth }) => totalWidth + itemWidth, 0);

      if (this.x + totalRemainingWidth > this.columnWidth) {
        this.lineFeed(maxChordHeight);
        this.carriageReturn();
      }
    }

    this.renderLineItems(rest);
  }

  private lineFeed(maxChordHeight: number) {
    const {
      chordLyricSpacing,
      linePadding,
      lineHeight,
    } = this.pdfConfiguration;

    this.y += maxChordHeight + chordLyricSpacing + linePadding + lineHeight;
  }

  private carriageReturn() {
    const { columnSpacing, marginleft } = this.pdfConfiguration;

    if (this.currentColumn === 1) {
      this.x = marginleft;
    } else {
      this.x = (this.currentColumn - 1) * this.columnWidth + columnSpacing + marginleft;
    }
  }

  get maxX() {
    const { columnWidth, currentColumn } = this;
    const { columnSpacing } = this.pdfConfiguration;
    return (currentColumn * columnWidth ) + ((currentColumn - 1) * columnSpacing);
  }

  renderText(text: string, x: number, y: number, style: FontConfiguration | null = null): void {
    this.withFontConfiguration(style, () => this.doc.text(text, x, y));
  }

  formatComment(commentText: string): void {
    const style = this.getFontConfiguration('comment');
    this.setFontStyle(style);
    const textY = this.y;

    // Print comment text
    this.doc.text(commentText, this.x, textY);

    // Underline the comment
    const textWidth = this.getTextDimensions(commentText).w;
    this.doc.setDrawColor(0);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.x, textY + 1, this.x + textWidth, textY + 1);

    // Update y for next element
    this.y += this.getTextDimensions(commentText).h;
  }

  // Utility functions
  spacer(size: number) {
    this.y += size;
  }

  getFontConfiguration(objectType: string): FontConfiguration {
    return this.pdfConfiguration.fonts[objectType];
  }

  getTextDimensions(text: string | null, styleConfig: FontConfiguration | null = null): { w: number, h: number } {
    if (!text || text.length === 0) {
      return { w: 0, h: 0 };
    }

    return this.withFontConfiguration(styleConfig, () => this.doc.getTextDimensions(text));
  }

  // Sets the font style based on the configuration
  setFontStyle(styleConfig: FontConfiguration) {
    this.doc.setFont(styleConfig.name, styleConfig.style);
    this.doc.setFontSize(styleConfig.size);
    this.setTextColor(styleConfig.color);
  }

  setTextColor(color: string | number) {
    switch (typeof color) {
      case 'string':
        this.doc.setTextColor(color);
        break;
      case 'number':
        this.doc.setTextColor(color);
        break;
      default:
        break;
    }
  }

  recordFormattingTime(): void {
    const endTime = performance.now();
    const timeTaken = ((endTime - this.startTime) / 1000).toFixed(5);

    const style = this.getFontConfiguration('text');
    this.setFontStyle(style);
    this.doc.setTextColor(100);

    const pageWidth = this.doc.internal.pageSize.getWidth();
    const timeTextWidth = this.getTextDimensions(`${timeTaken}s`).w;
    const timeTextX = pageWidth - timeTextWidth - this.pdfConfiguration.marginright;
    const timeTextY = this.pdfConfiguration.margintop / 2;

    this.doc.text(`${timeTaken}s`, timeTextX, timeTextY);
  }

  moveToNextColumn(_columnHeight: number) {
    this.currentColumn += 1;

    const {
      columnCount,
      layout: {
        header,
        footer,
      },
    } = this.pdfConfiguration;

    if (this.currentColumn > columnCount) {
      this.doc.addPage();
      this.currentColumn = 1;
      this.renderLayout(header, 'header');
      this.renderLayout(footer, 'footer');
    }

    this.carriageReturn();
    this.y = this.pdfConfiguration.margintop + this.pdfConfiguration.layout.header.height;
  }

  getSpaceWidth(): number {
    return this.getTextDimensions(' ').w;
  }
}

export default PdfFormatter;
