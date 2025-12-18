import ChordLyricsPair from '../chord_sheet/chord_lyrics_pair';
import Formatter from './formatter';
import Item from '../chord_sheet/item';
import Line from '../chord_sheet/line';
import Metadata from '../chord_sheet/metadata';
import Paragraph from '../chord_sheet/paragraph';
import Song from '../chord_sheet/song';
import Tag from '../chord_sheet/tag';

import { renderChord } from '../helpers';
import { SoftLineBreak, Ternary } from '../index';
import { hasRemarkContents, isEmptyString, padLeft } from '../utilities';
import { hasTextContents, processMetadata, renderSection } from '../template_helpers';

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
    const orderedMetadata = processMetadata(this.song.metadata.all(), this.configuration.metadata);

    const metadata = orderedMetadata
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: ${value.join(',')}`;
        }
        if (typeof value === 'undefined' || value === null || value === '') {
          return `${key}:`;
        }
        return `${key}: ${value}`;
      })
      .join('\n');

    return metadata ? `${metadata}\n\n` : '';
  }

  formatParagraphs(): string {
    const { bodyParagraphs, bodyParagraphs: { length: count }, metadata } = this.song;

    const formattedParagraphs = bodyParagraphs.map((paragraph) => this.formatParagraph(paragraph, metadata));
    const combined = formattedParagraphs.join('\n\n');

    if (formattedParagraphs[count - 1].length === 0) {
      return combined.substring(0, combined.length - 1);
    }

    return combined;
  }

  formatParagraph(paragraph: Paragraph, metadata: Metadata): string {
    if (paragraph.isLiteral()) {
      return [paragraph.label, renderSection(paragraph, this.configuration)]
        .filter((part) => part)
        .join('\n');
    }

    return paragraph.lines
      .filter((line) => line.hasRenderableItems())
      .map((line) => this.formatLine(line, metadata))
      .join('\n');
  }

  formatLine(line: Line, metadata: Metadata): string {
    const parts = [
      this.formatLineTop(line, metadata),
      this.formatLineBottom(line, metadata),
    ];

    return parts
      .filter((p) => !isEmptyString(p))
      .map((part) => (part || '').trimRight())
      .join('\n');
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
    const lyricsLength = (lyrics || '').length;

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
      item.chords,
      line,
      this.song,
      {
        renderKey: this.configuration.key,
        normalizeChords: this.configuration.normalizeChords,
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
      return item.label;
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

  private formatEvaluatable(item: Ternary, metadata: Metadata) {
    return item.evaluate(metadata, this.configuration.metadata.separator);
  }

  private formatChordLyricsPair(item: ChordLyricsPair, line: Line) {
    return padLeft(item.lyrics || '', this.chordLyricsPairLength(item, line));
  }
}

export default ChordsOverWordsFormatter;
