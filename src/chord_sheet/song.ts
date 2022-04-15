import Line from './line';
import Paragraph from './paragraph';
import Key from '../key';
import ChordLyricsPair from './chord_lyrics_pair';
import { deprecate, pushNew } from '../utilities';
import Metadata from './metadata';
import ParserWarning from '../parser/parser_warning';
import MetadataAccessors from './metadata_accessors';

import {
  CHORUS, NONE, TAB, VERSE,
} from '../constants';

import Tag, {
  END_OF_CHORUS,
  END_OF_TAB,
  END_OF_VERSE,
  START_OF_CHORUS,
  START_OF_TAB,
  START_OF_VERSE,
  TRANSPOSE,
  NEW_KEY,
  CAPO,
  KEY,
} from './tag';

/**
 * Represents a song in a chord sheet. Currently a chord sheet can only have one song.
 */
class Song extends MetadataAccessors {
  /**
   * The {@link Line} items of which the song consists
   * @member {Line[]}
   */
  lines: Line[] = [];

  /**
   * The {@link Paragraph} items of which the song consists
   * @member {Paragraph[]}
   */
  paragraphs: Paragraph[] = [];

  /**
   * The song's metadata. When there is only one value for an entry, the value is a string. Else, the value is
   * an array containing all unique values for the entry.
   * @type {Metadata}
   */
  metadata: Metadata;

  currentLine?: Line = null;

  currentParagraph?: Paragraph = null;

  warnings: ParserWarning[] = [];

  sectionType: string = NONE;

  currentKey?: string = null;

  transposeKey?: string = null;

  /**
   * Creates a new {Song} instance
   * @param metadata {Object|Metadata} predefined metadata
   */
  constructor(metadata = {}) {
    super();
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
    this.currentLine.transposeKey = this.transposeKey ?? this.currentKey;
    this.currentLine.key = this.currentKey || this.metadata.getSingle(KEY);
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
      this.setMetadata(tag.name, tag.value);
    } else if (tag.name === TRANSPOSE) {
      this.transposeKey = tag.value;
    } else if (tag.name === NEW_KEY) {
      this.currentKey = tag.value;
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
    return this.mapItems(null);
  }

  setMetadata(name, value) {
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

  getMetadata(name) {
    return this.metadata[name] || null;
  }

  /**
   * Returns a copy of the song with the capo value set to the specified capo. It changes:
   * - the value for `capo` in the `metadata` set
   * - any existing `capo` directive)
   * @param {number|null} capo the capo. Passing `null` will:
   * - remove the current key from `metadata`
   * - remove any `capo` directive
   * @returns {Song} The changed song
   */
  setCapo(capo) {
    let updatedSong;

    if (capo === null) {
      updatedSong = this.removeItem((item) => item instanceof Tag && item.name === CAPO);
    } else {
      updatedSong = this.updateItem(
        (item) => item instanceof Tag && item.name === CAPO,
        (item) => item.set({ value: capo }),
        (song) => song.insertDirective(CAPO, capo),
      );
    }

    updatedSong.metadata.set('capo', capo);
    return updatedSong;
  }

  /**
   * Returns a copy of the song with the key set to the specified key. It changes:
   * - the value for `key` in the `metadata` set
   * - any existing `key` directive
   * - all chords, those are transposed according to the distance between the current and the new key
   * @param {string} key The new key.
   * @returns {Song} The changed song
   */
  setKey(key) {
    const transpose = Key.distance(this.key, key);

    const updatedSong = this.mapItems((item) => {
      if (item instanceof Tag && item.name === KEY) {
        return item.set({ value: key });
      }

      if (item instanceof ChordLyricsPair) {
        return item.transpose(transpose, key);
      }

      return item;
    });

    updatedSong.metadata.set('key', key);
    return updatedSong;
  }

  private insertDirective(name, value, { after = null } = {}) {
    const insertIndex = this.lines.findIndex((line) => (
      line.items.some((item) => (
        !(item instanceof Tag) || (after && item instanceof Tag && item.name === after)
      ))
    ));

    const newLine = new Line();
    newLine.addTag(name, value);

    const clonedSong = this.clone();
    const { lines } = clonedSong;
    clonedSong.lines = [...lines.slice(0, insertIndex), newLine, ...lines.slice(insertIndex)];

    return clonedSong;
  }

  private mapItems(func) {
    const clonedSong = new Song();
    clonedSong.lines = this.lines.map((line) => line.mapItems(func));
    clonedSong.metadata = this.metadata.clone();
    return clonedSong;
  }

  private mapLines(func) {
    const clonedSong = new Song();
    clonedSong.lines = this.lines
      .map((line) => func(line.clone()))
      .filter((line) => line);
    clonedSong.metadata = this.metadata.clone();
    return clonedSong;
  }

  private updateItem(findCallback, updateCallback, notFoundCallback) {
    let found = false;

    const updatedSong = this.mapItems((item) => {
      if (findCallback(item)) {
        found = true;
        return updateCallback(item);
      }

      return item;
    });

    if (!found) {
      return notFoundCallback(updatedSong);
    }

    return updatedSong;
  }

  private removeItem(callback) {
    return this.mapLines((line) => {
      const { items } = line;
      const index = items.findIndex(callback);

      if (index === -1) {
        return line;
      }

      if (items.length === 1) {
        return null;
      }

      return line.set({
        items: [...items.slice(0, index), ...items.slice(index + 1)],
      });
    });
  }
}

export default Song;
