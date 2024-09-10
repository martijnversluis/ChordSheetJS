import JsPDF, { jsPDFOptions } from 'jspdf';
import Formatter from './formatter';
import { isChordLyricsPair, isComment, isTag, lineHasContents } from '../template_helpers';
import Song from '../chord_sheet/song';
import ChordProParser from '../parser/chord_pro_parser';
import TextFormatter from './text_formatter';
import Paragraph from '../chord_sheet/paragraph';
import Line from '../chord_sheet/line';
import { ChordLyricsPair, SoftLineBreak, Tag } from '../index';
import Item from '../chord_sheet/item';
import { stringSplitReplace } from '../helpers';
import jsPDF from 'jspdf';
import defaultConfiguration from './pdf_formatter/default_configuration';

import {
  Alignment,
  FontConfiguration, LayoutContentItemWithImage, LayoutContentItemWithText,
  LayoutItem,
  LayoutSection, MeasuredItem,
  PDFConfiguration,
  PdfConstructor,
  PdfDoc,
} from './pdf_formatter/types';

class PdfFormatter extends Formatter {
  song: Song = new Song();

  y: number = 0;

  x: number = 0;

  doc: any = new JsPDF();

  startTime: number = 0;

  currentColumn: number = 1;

  columnWidth: number = 0;

  pdfConfiguration: PDFConfiguration = defaultConfiguration;

  fontConfiguration: FontConfiguration = defaultConfiguration.fonts.text;

  // Configuration settings for the PDF document
  // Main function to format and save the song as a PDF
  format(
    song: Song,
    configuration: PDFConfiguration = defaultConfiguration,
    docConstructor: PdfConstructor = jsPDF,
  ): void {
    this.startTime = performance.now();
    this.song = song;
    this.pdfConfiguration = configuration;
    this.doc = this.setupDoc(docConstructor);
    this.renderLayout(this.pdfConfiguration.layout.header, 'header');
    this.renderLayout(this.pdfConfiguration.layout.footer, 'footer');
    this.y = this.pdfConfiguration.margintop + this.pdfConfiguration.layout.header.height;
    this.x = this.pdfConfiguration.marginleft;
    this.currentColumn = 1;
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
  setupDoc(docConstructor: PdfConstructor): PdfDoc {
    const constructorOptions: jsPDFOptions = {
      orientation: 'p',
      unit: 'px',
      format: 'letter',
      compress: true,
    };

    const doc = new docConstructor(constructorOptions);
    doc.setLineWidth(0);
    doc.setDrawColor(0, 0, 0, 0);

    const pageWidth = doc.internal.pageSize.getWidth();
    console.log('page width:', pageWidth);

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
      this.y += this.pdfConfiguration.lineHeight;
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
      }
    });
  }

  formatLine(line: Line) {
    const chordFont = this.getFontConfiguration('chord');
    const lyricsFont: FontConfiguration = this.getFontConfiguration('text');
    const commentFont: FontConfiguration = this.getFontConfiguration('comment');

    const measuredItems: MeasuredItem[] = line.items.flatMap((item: Item): MeasuredItem[] => {
      if (isChordLyricsPair(item)) {
        const items: Array<ChordLyricsPair | SoftLineBreak> =
          this.addSoftLineBreaksToChordLyricsPair(item as ChordLyricsPair);

        return items.flatMap((i): MeasuredItem[] => (
          this.measureItem(i, chordFont, lyricsFont, commentFont)
        ));
      } else if (isTag(item) && isComment(item as Tag)) {
        return this.measureTag(item as Tag, commentFont);
      } else {
        return [{ item, width: 0 }];
      }
    });

    this.renderLineItems(measuredItems);
  }

  measureItem(
    item: ChordLyricsPair | SoftLineBreak,
    chordFont: FontConfiguration,
    lyricFont: FontConfiguration,
    commentFont: FontConfiguration,
  ): MeasuredItem[] {
    if (item instanceof ChordLyricsPair) {
      return this.measureChordLyricsPair(item, chordFont, lyricFont);
    }

    if (item instanceof Tag && isComment(item)) {
      return this.measureTag(item, commentFont);
    }

    return [];
  }

  addSoftLineBreaksToChordLyricsPair(chordLyricsPair: ChordLyricsPair): Array<ChordLyricsPair | SoftLineBreak> {
    const { annotation, chords, lyrics } = chordLyricsPair;

    const items: Array<ChordLyricsPair | SoftLineBreak> = stringSplitReplace(
      lyrics || '',
      /,\s*/,
      (content) => [new SoftLineBreak(), new ChordLyricsPair('', content)],
      (lyric) => new ChordLyricsPair('', lyric),
    ).flat();

    let [first, ...rest] = items;
    let addedLeadingPair: ChordLyricsPair | null = null;

    if (chords !== '' || annotation !== '') {
      if (!first || first instanceof SoftLineBreak) {
        addedLeadingPair = new ChordLyricsPair(chords, lyrics, annotation);
      } else {
        first = new ChordLyricsPair(chords, first.lyrics, annotation);
      }
    }

    return [addedLeadingPair, first, ...rest].filter((item) => item !== null);
  }

  measureChordLyricsPair(
    item: ChordLyricsPair,
    chordFont: FontConfiguration,
    lyricsFont: FontConfiguration,
  ): MeasuredItem[] {
    const { chords, lyrics } = item;
    const chordWidth = this.getTextDimensions(chords, chordFont).w;
    const lyricWidth = this.getTextDimensions(lyrics, lyricsFont).w;

    const pairWidth = (chordWidth > lyricWidth)
      ? this.getTextDimensions(`${chords}${this.spaces}`, chordFont).w
      : lyricWidth;

    return [{
      item,
      width: pairWidth,
      chordHeight: this.getTextDimensions(chords, chordFont).h,
    }];
  }

  measureTag(item: Tag, font: FontConfiguration): MeasuredItem[] {
    const tagWidth = this.getTextDimensions(item.value, font).w;
    return [{ item, width: tagWidth }];
  }

  get spaces() {
    let str = '';

    for (let i = 0; i < this.pdfConfiguration.numberOfSpacesToAdd; i++) {
      str += ' ';
    }

    return str;
  }

  renderLineItems(items: MeasuredItem[]) {
    const chordFont = this.getFontConfiguration('chord');
    const lyricsFont: FontConfiguration = this.getFontConfiguration('text');
    const maxChordHeight = items.reduce((maxHeight, { chordHeight }) => Math.max(maxHeight, chordHeight || 0), 0);
    const [first, ...rest] = items;
    const { chordLyricSpacing } = this.pdfConfiguration;

    if (!first) {
      this.carriageReturn();
      this.lineFeed(Math.max(maxChordHeight, this.pdfConfiguration.lineHeight));
      return;
    }

    const { item, width } = first;

    if (item instanceof ChordLyricsPair) {
      const { chords, lyrics } = item as ChordLyricsPair;
      let capitalizeFirstWord = false;

      if (this.x + width > this.maxX) {
        this.lineFeed(Math.max(maxChordHeight, this.pdfConfiguration.lineHeight));
        this.carriageReturn();
        capitalizeFirstWord = true;
      }

      if (chords) {
        const chordBaseline = this.y + maxChordHeight - this.getTextDimensions(chords, chordFont).h;
        this.renderText(chords, this.x, chordBaseline, chordFont);
      }

      if (lyrics && lyrics.trim() !== '') {
        const lyricsY = this.y + maxChordHeight + chordLyricSpacing;
        const lyricsText = capitalizeFirstWord ? this.capitalize(lyrics) : lyrics;
        this.renderText(lyricsText, this.x, lyricsY, lyricsFont);
      }

      this.x += width;
    } else if (item instanceof Tag) {
      this.formatComment((item as Tag).value);
    } else if (item instanceof SoftLineBreak) {
      const totalRemainingWidth = rest.reduce((totalWidth, { width: itemWidth }) => totalWidth + itemWidth, 0);

      if (this.x + totalRemainingWidth > this.columnWidth) {
        this.lineFeed(maxChordHeight);
        this.carriageReturn();
      }
    }

    this.renderLineItems(rest);
  }

  capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
    const { columnSpacing, marginleft } = this.pdfConfiguration;
    return (currentColumn * columnWidth ) + ((currentColumn - 1) * columnSpacing) + marginleft;
  }

  renderText(text: string, x: number, y: number, style: FontConfiguration | null = null): void {
    this.withFontConfiguration(style, () => this.doc.text(text, x, y));
  }

  formatComment(commentText: string): void {
    const style = this.getFontConfiguration('comment');
    this.withFontConfiguration(style, () => this.doc.text(commentText, this.x, this.y));
    const { w: textWidth } = this.getTextDimensions(commentText, style);
    this.doc.setDrawColor(0);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.x, this.y + 1, this.x + textWidth, this.y + 1);
  }

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
