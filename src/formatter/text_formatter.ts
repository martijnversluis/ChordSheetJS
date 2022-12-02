import Formatter from './formatter';
import ChordLyricsPair from '../chord_sheet/chord_lyrics_pair';
import Tag from '../chord_sheet/tag';
import { renderChord } from '../helpers';
import { hasTextContents } from '../template_helpers';
import Song from '../chord_sheet/song';
import { hasChordContents, isEmptyString, padLeft } from '../utilities';
import Paragraph from '../chord_sheet/paragraph';
import Metadata from '../chord_sheet/metadata';
import Line from '../chord_sheet/line';
import Item from '../chord_sheet/item';

/**
 * Formats a song into a plain text chord sheet
 */
class TextFormatter extends Formatter {
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
    const { title, subtitle } = this.song;
    const separator = (title || subtitle) ? '\n' : '';

    return [
      this.formatTitle(title),
      this.formatSubTitle(subtitle),
      separator,
    ].join('');
  }

  formatParagraphs(): string {
    const { bodyParagraphs, metadata } = this.song;

    return bodyParagraphs
      .map((paragraph: Paragraph) => this.formatParagraph(paragraph, metadata))
      .join('\n\n');
  }

  formatParagraph(paragraph: Paragraph, metadata: Metadata): string {
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

  formatTitle(title: string): string {
    if (title) {
      return `${title.toUpperCase()}\n`;
    }

    return '';
  }

  formatSubTitle(subtitle: string): string {
    if (subtitle) {
      return `${subtitle}\n`;
    }

    return '';
  }

  formatLineTop(line: Line, metadata: Metadata): string | null {
    if (hasChordContents(line)) {
      return this.formatLineWithFormatter(line, this.formatItemTop, metadata);
    }

    return null;
  }

  chordLyricsPairLength(chordLyricsPair: ChordLyricsPair, line: Line): number {
    const chords = renderChord(chordLyricsPair.chords, line, this.song, this.configuration.key);
    const { lyrics } = chordLyricsPair;
    const chordsLength = (chords || '').length;
    const lyricsLength = (lyrics || '').length;

    if (chordsLength >= lyricsLength) {
      return chordsLength + 1;
    }

    return Math.max(chordsLength, lyricsLength);
  }

  formatItemTop(item: Item, _metadata: Metadata, line: Line): string {
    if (item instanceof Tag && item.isRenderable()) {
      return item.value || '';
    }

    if (item instanceof ChordLyricsPair) {
      const chords = renderChord(item.chords, line, this.song, this.configuration.key);
      return padLeft(chords, this.chordLyricsPairLength(item, line));
    }

    return '';
  }

  formatLineBottom(line: Line, metadata: Metadata): string {
    if (hasTextContents(line)) {
      return this.formatLineWithFormatter(line, this.formatItemBottom, metadata);
    }

    return '';
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
    if (item instanceof Tag && item.isRenderable()) {
      return item.value || '';
    }

    if (item instanceof ChordLyricsPair) {
      return padLeft(item.lyrics || '', this.chordLyricsPairLength(item, line));
    }

    if ('evaluate' in item) {
      return item.evaluate(metadata, this.configuration.get('metadata.separator'));
    }

    return '';
  }
}

export default TextFormatter;
