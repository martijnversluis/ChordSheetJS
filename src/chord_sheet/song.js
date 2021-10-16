import Line from './line';
import Tag, {
  END_OF_CHORUS, END_OF_TAB, END_OF_VERSE, META_TAGS, START_OF_CHORUS, START_OF_TAB, START_OF_VERSE,
} from './tag';
import Paragraph from './paragraph';
import { deprecate, pushNew } from '../utilities';
import Metadata from './metadata';
import { CHORUS, NONE, TAB, VERSE } from '../constants';
import ParserWarning from '../parser/parser_warning';

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
     * @type {Paragraph[]}
     */
    this.paragraphs = [];

    /**
     * The song's metadata. When there is only one value for an entry, the value is a string. Else, the value is
     * an array containing all unique values for the entry.
     * @type {Metadata}
     */
    this.metadata = new Metadata(metadata);

    this.currentLine = null;
    this.currentParagraph = null;
    this.warnings = [];
    this.sectionType = NONE;
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
   * @returns {Line[]} The song body lines
   */
  get bodyLines() {
    return this.selectRenderableItems('_bodyLines', 'lines');
  }

  /**
   * Returns the song paragraphs, skipping the paragraphs that only contain empty lines
   * (empty as in not rendering any content)
   * @see {@link bodyLines}
   * @returns {Paragraph[]}
   */
  get bodyParagraphs() {
    return this.selectRenderableItems('_bodyParagraphs', 'paragraphs');
  }

  selectRenderableItems(targetProp, sourceProp) {
    if (this[targetProp] === undefined) {
      this[targetProp] = [...this[sourceProp]];
      const collection = this[targetProp];

      while (collection.length > 0 && !collection[0].hasRenderableItems()) {
        this[targetProp].shift();
      }
    }

    return this[targetProp];
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
    this.setCurrentLineType(this.sectionType);
    return this.currentLine;
  }

  setCurrentLineType(sectionType) {
    this.currentLine.type = sectionType;
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

  addChordLyricsPair(chords = '', lyrics = '') {
    this.ensureLine();
    return this.currentLine.addChordLyricsPair(chords, lyrics);
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
    } else {
      this.setSectionTypeFromTag(tag);
    }

    this.ensureLine();
    this.currentLine.addTag(tag);

    return tag;
  }

  setSectionTypeFromTag(tag) {
    switch (tag.name) {
      case START_OF_CHORUS:
        this.startSection(CHORUS, tag);
        break;

      case END_OF_CHORUS:
        this.endSection(CHORUS, tag);
        break;

      case START_OF_TAB:
        this.startSection(TAB, tag);
        break;

      case END_OF_TAB:
        this.endSection(TAB, tag);
        break;

      case START_OF_VERSE:
        this.startSection(VERSE, tag);
        break;

      case END_OF_VERSE:
        this.endSection(VERSE, tag);
        break;

      default:
        break;
    }
  }

  startSection(sectionType, tag) {
    this.checkCurrentSectionType(NONE, tag);
    this.sectionType = sectionType;
    this.setCurrentLineType(sectionType);
  }

  endSection(sectionType, tag) {
    this.checkCurrentSectionType(sectionType, tag);
    this.sectionType = NONE;
  }

  checkCurrentSectionType(sectionType, tag) {
    if (this.sectionType !== sectionType) {
      this.addWarning(`Unexpected tag {${tag.originalName}, current section is: ${this.sectionType}`, tag);
    }
  }

  addWarning(message, { line, column }) {
    const warning = new ParserWarning(message, line, column);
    this.warnings.push(warning);
  }

  addComment(comment) {
    this.ensureLine();
    this.currentLine.addComment(comment);
  }

  addItem(item) {
    if (item instanceof Tag) {
      this.addTag(item);
    } else {
      this.ensureLine();
      this.currentLine.addItem(item);
    }
  }

  /**
   * Returns a deep clone of the song
   * @returns {Song} The cloned song
   */
  clone() {
    const clonedSong = new Song();
    clonedSong.lines = this.lines.map((line) => line.clone());
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

const { defineProperty } = Object;
const songPrototype = Song.prototype;

META_TAGS.forEach((tagName) => {
  defineProperty(songPrototype, tagName, {
    get() {
      return this.getMetaData(tagName);
    },
  });
});

export default Song;
