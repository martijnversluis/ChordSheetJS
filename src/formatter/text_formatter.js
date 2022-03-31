import Formatter from './formatter';
import ChordLyricsPair from '../chord_sheet/chord_lyrics_pair';
import Tag from '../chord_sheet/tag';
import { renderChord } from '../helpers';
import { hasTextContents } from '../template_helpers';
import Song from '../chord_sheet/song';

import {
  hasChordContents,
  padLeft,
} from '../utilities';

/**
 * Formats a song into a plain text chord sheet
 */
class TextFormatter extends Formatter {
  /**
   * Formats a song into a plain text chord sheet
   * @param {Song} song The song to be formatted
   * @returns {string} the chord sheet
   */
  format(song) {
    this.song = song;

    return [
      this.formatHeader(),
      this.formatParagraphs(),
    ].join('');
  }

  formatHeader() {
    const { title, subtitle } = this.song;
    const separator = (title || subtitle) ? '\n' : '';

    return [
      this.formatTitle(title),
      this.formatSubTitle(subtitle),
      separator,
    ].join('');
  }

  formatParagraphs() {
    const { bodyParagraphs, metadata } = this.song;

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

  chordLyricsPairLength(chordLyricsPair, line) {
    const chords = renderChord(chordLyricsPair.chords, line.key, line.transposeKey, this.song);
    const { lyrics } = chordLyricsPair;
    const chordsLength = (chords || '').length;
    const lyricsLength = (lyrics || '').length;

    if (chordsLength >= lyricsLength) {
      return chordsLength + 1;
    }

    return Math.max(chordsLength, lyricsLength);
  }

  formatItemTop(item, metadata, line) {
    if (item instanceof Tag && item.isRenderable()) {
      return padLeft('', item.value);
    }

    if (item instanceof ChordLyricsPair) {
      const chords = renderChord(item.chords, line.key, line.transposeKey, this.song);
      return padLeft(chords, this.chordLyricsPairLength(item, line));
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
      .map((item) => formatter.call(this, item, metadata, line))
      .join('');
  }

  formatItemBottom(item, metadata, line) {
    if (item instanceof Tag && item.isRenderable()) {
      return item.value;
    }

    if (item instanceof ChordLyricsPair) {
      return padLeft(item.lyrics, this.chordLyricsPairLength(item, line));
    }

    if (typeof item.evaluate === 'function') {
      return item.evaluate(metadata, this.configuration.get('metadata.separator'));
    }

    return '';
  }
}

export default TextFormatter;
