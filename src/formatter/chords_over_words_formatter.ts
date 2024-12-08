import Formatter from './formatter';
import ChordLyricsPair from '../chord_sheet/chord_lyrics_pair';
import Tag from '../chord_sheet/tag';
import { renderChord } from '../helpers';
import { hasTextContents, renderSection } from '../template_helpers';
import Song from '../chord_sheet/song';
import { hasRemarkContents, isEmptyString, padLeft } from '../utilities';
import Paragraph from '../chord_sheet/paragraph';
import Metadata from '../chord_sheet/metadata';
import Line from '../chord_sheet/line';
import Item from '../chord_sheet/item';
import { Ternary } from '../index';

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

    return [
      this.formatHeader(),
      this.formatParagraphs(),
    ].join('');
  }

  formatHeader(): string {
    const metadata = Object.keys(this.song.metadata.metadata)
      .map((key) => `${key}: ${this.song.metadata[key]}`)
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

    return '';
  }

  private formatEvaluatable(item: Ternary, metadata: Metadata) {
    return item.evaluate(metadata, this.configuration.separator);
  }

  private formatChordLyricsPair(item: ChordLyricsPair, line: Line) {
    return padLeft(item.lyrics || '', this.chordLyricsPairLength(item, line));
  }
}

export default ChordsOverWordsFormatter;
