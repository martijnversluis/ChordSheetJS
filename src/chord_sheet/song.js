import Line from './line';
import Tag, { META_TAGS } from './tag';
import Paragraph from './paragraph';
import { deprecate, pushNew } from '../utilities';
import Metadata from './metadata';

/**
 * Represents a song in a chord sheet. Currently a chord sheet can only have one song.
 */
class Song {
  /**
   * Creates a new {Song} instance
   * @param metadata {Object|Metadata} predefined metadata
   */
  constructor(metadata = {}) {
    /**
     * The {@link Line} items of which the song consists
     * @member
     * @type {Array<Line>}
     */
    this.lines = [];

    /**
     * The {@link Paragraph} items of which the song consists
     * @member
     * @type {Array<Line>}
     */
    this.paragraphs = [];

    this.currentLine = null;
    this.currentParagraph = null;

    /**
     * The song's metadata. When there is only one value for an entry, the value is a string. Else, the value is
     * an array containing all unique values for the entry.
     * @type {Metadata}
     */
    this.metadata = new Metadata(metadata);
  }

  get previousLine() {
    const count = this.lines.length;

    if (count >= 2) {
      return this.lines[count - 2];
    }

    return null;
  }

  /**
   * Returns the song lines, skipping the leading empty lines (empty as in not rendering any content). This is useful
   * if you want to skip the "header lines": the lines that only contain meta data.
   * @returns {Array<Line>} The song body lines
   */
  get bodyLines() {
    if (this._bodyLines === undefined) {
      this._bodyLines = [...this.lines];

      while (!this._bodyLines[0].hasRenderableItems()) {
        this._bodyLines.shift();
      }
    }

    return this._bodyLines;
  }

  chords(chr) {
    this.currentLine.chords(chr);
  }

  lyrics(chr) {
    this.ensureLine();
    this.currentLine.lyrics(chr);
  }

  addLine() {
    this.ensureParagraph();
    this.flushLine();
    this.currentLine = pushNew(this.lines, Line);
    return this.currentLine;
  }

  setCurrentLineType(type) {
    if (this.currentLine) {
      this.currentLine.type = type;
    }
  }

  flushLine() {
    if (this.currentLine !== null) {
      if (this.currentLine.isEmpty()) {
        this.addParagraph();
      } else if (this.currentLine.hasRenderableItems()) {
        this.currentParagraph.addLine(this.currentLine);
      }
    }
  }

  finish() {
    this.flushLine();
  }

  addChordLyricsPair() {
    this.ensureLine();
    return this.currentLine.addChordLyricsPair();
  }

  ensureLine() {
    if (this.currentLine === null) {
      this.addLine();
    }
  }

  addParagraph() {
    this.currentParagraph = pushNew(this.paragraphs, Paragraph);
    return this.currentParagraph;
  }

  ensureParagraph() {
    if (this.currentParagraph === null) {
      this.addParagraph();
    }
  }

  addTag(tagContents) {
    const tag = Tag.parse(tagContents);

    if (tag.isMetaTag()) {
      this.setMetaData(tag.name, tag.value);
    }

    this.ensureLine();
    this.currentLine.addTag(tag);

    return tag;
  }

  /**
   * Returns a deep clone of the song
   * @returns {Song} The cloned song
   */
  clone() {
    const clonedSong = new Song();
    clonedSong.lines = this.lines.map(line => line.clone());
    clonedSong.metadata = this.metadata.clone();
    return clonedSong;
  }

  setMetaData(name, value) {
    this.metadata.add(name, value);
  }

  /**
   * The song's metadata. Please use {@link metadata} instead.
   * @deprecated
   * @returns {@link Metadata} The metadata
   */
  get metaData() {
    deprecate('metaData has been deprecated, please use metadata instead (notice the lowercase "d")');
    return this.metadata;
  }

  getMetaData(name) {
    return this.metadata[name] || null;
  }
}

const defineProperty = Object.defineProperty;
const songPrototype = Song.prototype;

META_TAGS.forEach((tagName) => {
  defineProperty(songPrototype, tagName, {
    get() {
      return this.getMetaData(tagName);
    },
  });
});

export default Song;
