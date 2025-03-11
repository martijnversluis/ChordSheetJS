import Formatter from './formatter';
import ChordLyricsPair from '../chord_sheet/chord_lyrics_pair';
import Tag from '../chord_sheet/tag';
import { renderChord } from '../helpers';
import { evaluate, hasTextContents, renderSection } from '../template_helpers';
import Song from '../chord_sheet/song';
import { hasRemarkContents, isEmptyString, padLeft } from '../utilities';
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
    const { bodyParagraphs, expandedBodyParagraphs, metadata } = this.song;
    const { expandChorusDirective } = this.configuration;

    return (expandChorusDirective ? expandedBodyParagraphs : bodyParagraphs)
      .map((paragraph: Paragraph) => this.formatParagraph(paragraph, metadata))
      .join('\n\n');
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
      .map((part) => (part || '').trimEnd())
      .join('\n');
  }

  formatTitle(title: string | null): string {
    if (title) {
      return `${title.toUpperCase()}\n`;
    }

    return '';
  }

  formatSubTitle(subtitle: string | null): string {
    if (subtitle) {
      return `${subtitle}\n`;
    }

    return '';
  }

  formatLineTop(line: Line, metadata: Metadata): string | null {
    if (hasRemarkContents(line)) {
      return this.formatLineWithFormatter(line, this.formatItemTop, metadata);
    }

    return null;
  }

  chordLyricsPairLength(chordLyricsPair: ChordLyricsPair, line: Line): number {
    const content = chordLyricsPair.annotation || this.renderChords(chordLyricsPair, line);
    const { lyrics } = chordLyricsPair;
    const contentLength = (content || '').length;
    const lyricsLength = (lyrics || '').length;

    if (contentLength >= lyricsLength) {
      return contentLength + 1;
    }

    return Math.max(contentLength, lyricsLength);
  }

  private renderChords(chordLyricsPair: ChordLyricsPair, line: Line) {
    const chords = renderChord(
      chordLyricsPair.chords,
      line,
      this.song,
      {
        renderKey: this.configuration.key,
        useUnicodeModifier: this.configuration.useUnicodeModifiers,
        normalizeChords: this.configuration.normalizeChords,
        decapo: this.configuration.decapo,
      },
    );
    return chords;
  }

  formatItemTop(item: Item, _metadata: Metadata, line: Line): string {
    if (item instanceof Tag && item.isRenderable()) {
      return item.label;
    }

    if (item instanceof ChordLyricsPair) {
      const content = item.annotation || this.renderChords(item, line);
      return padLeft(content, this.chordLyricsPairLength(item, line));
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
      return item.label;
    }

    if (item instanceof ChordLyricsPair) {
      return padLeft(item.lyrics || '', this.chordLyricsPairLength(item, line));
    }

    if ('evaluate' in item) {
      return evaluate(item, metadata, this.configuration);
    }

    return '';
  }
}

export default TextFormatter;
