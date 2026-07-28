import ChordLyricsPair from '../chord_sheet/chord_lyrics_pair';
import Formatter from './formatter';
import Item from '../chord_sheet/item';
import Line from '../chord_sheet/line';
import Metadata from '../chord_sheet/metadata';
import Paragraph from '../chord_sheet/paragraph';
import Song from '../chord_sheet/song';
import Tag from '../chord_sheet/tag';
import { renderChord } from '../helpers';
import { stripPangoMarkup } from '../pango/pango_helpers';
import { SoftLineBreak, Ternary } from '../index';
import { hasRemarkContents, isEmptyString, padLeft } from '../utilities';
import { hasTextContents, processMetadata, renderSection } from '../template_helpers';
import { longTagName, shortTagName } from '../chord_sheet/tag';

const DIRECTION_KEYWORDS = [
  'verse',
  'chorus',
  'bridge',
  'tag',
  'interlude',
  'instrumental',
  'intro',
];

const STANDALONE_BODY_DIRECTIVES = ['new_key'];

/**
 * Formats a song into a plain text chord sheet
 */
class ChordsOverWordsFormatter extends Formatter {
  song: Song = new Song();

  /**
   * Formats a song into a plain text chord sheet
   * @param {Song} song The song to be formatted
   * @returns {string} the chord sheet
   */
  format(song: Song): string {
    this.song = song;

    const header = this.formatHeader();
    const paragraphs = this.formatParagraphs();

    // Only add separator if both header and paragraphs exist and first paragraph isn't empty
    if (header && paragraphs) {
      // Check if first paragraph has content
      const firstParagraph = this.song.bodyParagraphs[0];
      const firstLine = firstParagraph?.lines[0];
      const shouldReduceNewlines = firstLine && firstLine.isEmpty();

      if (shouldReduceNewlines) {
        // Remove one newline from header to avoid triple newlines
        const trimmedHeader = header.replace(/\n\n$/, '\n');
        return trimmedHeader + paragraphs;
      }
    }

    return header + paragraphs;
  }

  formatHeader(): string {
    // Process metadata according to configuration
    const songMetadata = this.song.getMetadata(this.configuration);
    const orderedMetadata = processMetadata(songMetadata.ownMetadata(), this.configuration.metadata);

    const metadata = orderedMetadata
      .map(([key, value]) => {
        const directiveName = this.formatMetadataName(key);

        if (Array.isArray(value)) {
          return `${directiveName}: ${value.join(',')}`;
        }
        if (typeof value === 'undefined' || value === null || value === '') {
          return `${directiveName}:`;
        }
        return `${directiveName}: ${value}`;
      })
      .join('\n');

    return metadata ? `${metadata}\n\n` : '';
  }

  formatParagraphs(): string {
    const metadata = this.song.getMetadata(this.configuration);
    const paragraphs = this.song.filterParagraphs(this.bodyParagraphs(), this.configuration);
    const count = paragraphs.length;

    const formattedParagraphs = paragraphs.map((paragraph) => this.formatParagraph(paragraph, metadata));
    const combined = formattedParagraphs.join('\n\n');

    if (count > 0 && formattedParagraphs[count - 1].length === 0) {
      return combined.substring(0, combined.length - 1);
    }

    return combined;
  }

  private bodyParagraphs(): Paragraph[] {
    const bodyLines = [...this.song.lines];
    while (bodyLines.length && !this.shouldFormatBodyLine(bodyLines[0])) {
      bodyLines.shift();
    }

    return this.linesToParagraphs(bodyLines);
  }

  private linesToParagraphs(lines: Line[]): Paragraph[] {
    let currentParagraph = new Paragraph();
    const paragraphs = [currentParagraph];

    lines.forEach((line, index) => {
      const nextLine: Line | null = lines[index + 1] || null;
      if (line.isEmpty() || (line.isSectionEnd() && nextLine && !nextLine.isEmpty())) {
        currentParagraph = new Paragraph();
        paragraphs.push(currentParagraph);
      } else if (this.shouldFormatBodyLine(line)) {
        currentParagraph.addLine(line);
      }
    });

    return paragraphs.filter((paragraph) => paragraph.hasRenderableItems() ||
      paragraph.lines.some((line) => this.hasStandaloneBodyDirective(line)));
  }

  private shouldFormatBodyLine(line: Line): boolean {
    return line.hasRenderableItems() || this.hasStandaloneBodyDirective(line);
  }

  formatParagraph(paragraph: Paragraph, metadata: Metadata): string {
    if (paragraph.isLiteral()) {
      return [paragraph.label, renderSection(paragraph, this.configuration)]
        .filter((part) => part)
        .join('\n');
    }

    return paragraph.lines
      .filter((line) => this.shouldFormatBodyLine(line))
      .map((line) => this.formatLine(line, metadata))
      .join('\n');
  }

  formatLine(line: Line, metadata: Metadata): string {
    const standaloneBodyDirective = this.formatStandaloneBodyDirective(line);
    if (standaloneBodyDirective !== null) {
      return standaloneBodyDirective;
    }

    const parts = [
      this.formatLineTop(line, metadata),
      this.formatLineBottom(line, metadata),
    ];

    return parts
      .filter((p) => !isEmptyString(p))
      .map((part) => (part || '').trimRight())
      .join('\n');
  }

  private hasStandaloneBodyDirective(line: Line): boolean {
    return this.standaloneBodyDirective(line) !== null;
  }

  private formatStandaloneBodyDirective(line: Line): string | null {
    const item = this.standaloneBodyDirective(line);
    if (!item) {
      return null;
    }

    const directiveName = this.formatDirectiveName(item);
    return item.hasValue() ? `${directiveName}: ${item.value}` : directiveName;
  }

  private standaloneBodyDirective(line: Line): Tag | null {
    if (line.items.length !== 1 || !(line.items[0] instanceof Tag)) {
      return null;
    }

    const item = line.items[0];
    return STANDALONE_BODY_DIRECTIVES.includes(item.name) ? item : null;
  }

  formatLineTop(line: Line, metadata: Metadata): string | null {
    if (hasRemarkContents(line)) {
      return this.formatLineWithFormatter(line, this.formatItemTop, metadata);
    }

    return null;
  }

  chordLyricsPairLength(chordLyricsPair: ChordLyricsPair, line: Line): number {
    const content = chordLyricsPair.annotation || this.renderChord(chordLyricsPair, line);
    const { lyrics } = chordLyricsPair;
    const contentLength = (content || '').length;
    const lyricsLength = stripPangoMarkup(lyrics || '').length;

    if (contentLength >= lyricsLength) {
      return contentLength + 1;
    }

    return Math.max(contentLength, lyricsLength);
  }

  formatItemTop(item: Item, _metadata: Metadata, line: Line): string {
    if (item instanceof Tag && item.isRenderable()) {
      return item.label;
    }

    if (item instanceof ChordLyricsPair) {
      const content = item.annotation || this.renderChord(item, line);
      return padLeft(content, this.chordLyricsPairLength(item, line));
    }

    if (item instanceof SoftLineBreak) {
      return '  ';
    }

    return '';
  }

  renderChord(item: ChordLyricsPair, line: Line) {
    return renderChord(
      item.chord ?? item.chords,
      line,
      this.song,
      {
        renderKey: this.configuration.key,
        normalizeChords: this.configuration.normalizeChords,
        normalizeChordSuffix: this.configuration.normalizeChordSuffix,
        decapo: this.configuration.decapo,
      },
    );
  }

  formatLineBottom(line, metadata) {
    if (hasTextContents(line)) {
      return this.formatLineWithFormatter(line, this.formatItemBottom, metadata);
    }

    return null;
  }

  formatLineWithFormatter(
    line: Line,
    formatter: (_item: Item, _metadata: Metadata, _line: Line) => string,
    metadata: Metadata,
  ): string {
    return line
      .items
      .map((item) => formatter.call(this, item, metadata, line))
      .join('');
  }

  formatItemBottom(item: Item, metadata: Metadata, line: Line): string {
    if (typeof item === 'string') {
      return item;
    }

    if (item instanceof Tag && item.isRenderable()) {
      return this.formatTag(item);
    }

    if (item instanceof ChordLyricsPair) {
      return this.formatChordLyricsPair(item, line);
    }

    if ('evaluate' in item) {
      return this.formatEvaluatable(item as Ternary, metadata);
    }

    if (item instanceof SoftLineBreak) {
      return '\\ ';
    }

    return '';
  }

  private formatTag(item: Tag): string {
    if (item.isComment() && this.shouldFormatExplicitComment(item)) {
      return `${this.formatDirectiveName(item)}: ${item.label}`;
    }

    return item.label;
  }

  private shouldFormatExplicitComment(item: Tag): boolean {
    return !this.isBareCommentLabel(item.label);
  }

  private formatDirectiveName(tag: Tag): string {
    return this.formatTagName(tag.name, tag.originalName);
  }

  private formatMetadataName(name: string): string {
    return this.formatTagName(name, this.findOriginalMetadataName(name));
  }

  private formatTagName(name: string, originalName: string): string {
    switch (this.directiveNameNormalizationFor(name)) {
      case 'prefer-long':
        return longTagName(name);
      case 'prefer-short':
        return shortTagName(name);
      case 'none':
      default:
        return originalName;
    }
  }

  private directiveNameNormalizationFor(name: string) {
    const { directiveNameNormalization } = this.configuration;

    if (typeof directiveNameNormalization === 'string') {
      return directiveNameNormalization;
    }

    return directiveNameNormalization[longTagName(name)] || directiveNameNormalization[name] ||
      directiveNameNormalization.default || 'none';
  }

  private findOriginalMetadataName(name: string): string {
    const additionalMetadataDirectives = this.configuration.metadata.additionalMetadataDirectives ?? [];
    const item = this.song.lines
      .flatMap((line) => line.items)
      .find((lineItem) => lineItem instanceof Tag &&
        lineItem.isMetaTag(additionalMetadataDirectives) &&
        lineItem.name === name);

    return item instanceof Tag ? item.originalName : name;
  }

  private isBareCommentLabel(label: string): boolean {
    return DIRECTION_KEYWORDS.some((keyword) => label.trim().toLowerCase().startsWith(keyword));
  }

  private formatEvaluatable(item: Ternary, metadata: Metadata) {
    return item.evaluate(metadata, this.configuration.metadata.separator);
  }

  private formatChordLyricsPair(item: ChordLyricsPair, line: Line) {
    return padLeft(stripPangoMarkup(item.lyrics || ''), this.chordLyricsPairLength(item, line));
  }
}

export default ChordsOverWordsFormatter;
