import ChordLyricsPair from '../chord_sheet/chord_lyrics_pair';
import Tag from '../chord_sheet/tag';
import { hasChordContents, hasTextContents, padLeft } from '../utilities';

/**
 * Formats a sonf into a plain text chord sheet
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
    return song.paragraphs.map(paragraph => this.formatParagraph(paragraph)).join('\n\n');
  }

  formatParagraph(paragraph) {
    const renderableLines = paragraph.lines.filter(line => line.hasRenderableItems());
    const formattedLines = renderableLines.map(line => this.formatLine(line));
    return formattedLines.join('\n');
  }

  formatLine(line) {
    const parts = [
      this.formatLineTop(line),
      this.formatLineBottom(line),
    ];

    return parts
      .filter(i => i !== null)
      .map(part => part.trimRight())
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
    const chords = chordLyricsPair.chords;
    const chordsLength = chords.length;
    const lyricsLength = chordLyricsPair.lyrics.length;

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
      return padLeft(item.chords, this.chordLyricsPairLength(item));
    }

    return '';
  }

  formatLineBottom(line) {
    if (hasTextContents(line)) {
      return this.formatLineWithFormatter(line, this.formatItemBottom);
    }

    return null;
  }

  formatLineWithFormatter(line, formatter) {
    return line
      .items
      .map(item => formatter.call(this, item))
      .join('');
  }

  formatItemBottom(item) {
    if (item instanceof Tag && item.isRenderable()) {
      return item.value;
    }

    if (item instanceof ChordLyricsPair) {
      return padLeft(item.lyrics, this.chordLyricsPairLength(item));
    }

    return '';
  }
}

export default TextFormatter;
