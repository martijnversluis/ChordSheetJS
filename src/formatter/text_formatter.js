import ChordLyricsPair from '../chord_sheet/chord_lyrics_pair';
import Tag from '../chord_sheet/tag';
import { hasChordContents, hasTextContents, padLeft } from '../utilities';

/**
 * Formats a song into a plain text chord sheet
 */
class TextFormatter {
  /**
   * Formats a song into a plain text chord sheet
   * @param {Song} song The song to be formatted
   * @returns {string} the chord sheet
   */
  format(song) {
    return [
      this.formatHeader(song),
      this.formatParagraphs(song),
    ].join('');
  }

  formatHeader(song) {
    const { title, subtitle } = song;
    const separator = (title || subtitle) ? '\n' : '';

    return [
      this.formatTitle(title),
      this.formatSubTitle(subtitle),
      separator,
    ].join('');
  }

  formatParagraphs(song) {
    const { bodyParagraphs, metadata } = song;

    return bodyParagraphs
      .map((paragraph) => this.formatParagraph(paragraph, metadata))
      .join('\n\n');
  }

  formatParagraph(paragraph, metadata) {
    return paragraph.lines
      .filter((line) => line.hasRenderableItems())
      .map((line) => this.formatLine(line, metadata))
      .join('\n');
  }

  formatLine(line, metadata) {
    const parts = [
      this.formatLineTop(line),
      this.formatLineBottom(line, metadata),
    ];

    return parts
      .filter((i) => i !== null)
      .map((part) => part.trimRight())
      .join('\n');
  }

  formatTitle(title) {
    if (title) {
      return `${title.toUpperCase()}\n`;
    }

    return '';
  }

  formatSubTitle(subtitle) {
    if (subtitle) {
      return `${subtitle}\n`;
    }

    return '';
  }

  formatLineTop(line) {
    if (hasChordContents(line)) {
      return this.formatLineWithFormatter(line, this.formatItemTop);
    }

    return null;
  }

  chordLyricsPairLength(chordLyricsPair) {
    const { chords, lyrics } = chordLyricsPair;
    const chordsLength = (chords || '').length;
    const lyricsLength = (lyrics || '').length;

    if (chordsLength >= lyricsLength) {
      return chordsLength + 1;
    }

    return Math.max(chordsLength, lyricsLength);
  }

  formatItemTop(item) {
    if (item instanceof Tag && item.isRenderable()) {
      return padLeft('', item.value);
    }

    if (item instanceof ChordLyricsPair) {
      return padLeft(item.chords || '', this.chordLyricsPairLength(item));
    }

    return '';
  }

  formatLineBottom(line, metadata) {
    if (hasTextContents(line)) {
      return this.formatLineWithFormatter(line, this.formatItemBottom, metadata);
    }

    return null;
  }

  formatLineWithFormatter(line, formatter, metadata) {
    return line
      .items
      .map((item) => formatter.call(this, item, metadata))
      .join('');
  }

  formatItemBottom(item, metadata) {
    if (item instanceof Tag && item.isRenderable()) {
      return item.value;
    }

    if (item instanceof ChordLyricsPair) {
      return padLeft(item.lyrics, this.chordLyricsPairLength(item));
    }

    if (typeof item.evaluate === 'function') {
      return item.evaluate(metadata);
    }

    return '';
  }
}

export default TextFormatter;
