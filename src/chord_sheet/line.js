import ChordLyricsPair from './chord_lyrics_pair';
import Tag from './tag';
import { CHORUS, NONE, VERSE } from '../constants';

/**
 * Represents a line in a chord sheet, consisting of items of type ChordLyricsPair or Tag
 */
class Line {
  constructor() {
    /**
     * The items ({@link ChordLyricsPair} or {@link Tag}) of which the line consists
     * @member
     * @type {Array.<(ChordLyricsPair|Tag)>}
     */
    this.items = [];

    /**
     * The line type, This is set by the ChordProParser when it read tags like {start_of_chorus} or {start_of_verse}
     * Values can be {@link VERSE}, {@link CHORUS} or {@link NONE}
     * @member
     * @type {string}
     */
    this.type = NONE;

    this.currentChordLyricsPair = null;
  }

  /**
   * Indicates whether the line contains any items
   * @returns {boolean}
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Adds an item ({@link ChordLyricsPair} or {@link Tag}) to the line
   * @param {ChordLyricsPair|Tag} item The item to be added
   */
  addItem(item) {
    if (item instanceof Tag) {
      this.addTag(item);
    } else if (item instanceof ChordLyricsPair) {
      this.addChordLyricsPair(item);
    }
  }

  /**
   * Indicates whether the line contains items that are renderable
   * @returns {boolean}
   */
  hasRenderableItems() {
    return this.items.some(item => item.isRenderable());
  }

  /**
   * Returns a deep copy of the line and all of its items
   * @returns {Line}
   */
  clone() {
    const clonedLine = new Line();
    clonedLine.items = this.items.map(item => item.clone());
    clonedLine.type = this.type;
    return clonedLine;
  }

  /**
   * Indicates whether the line type is {@link VERSE}
   * @returns {boolean}
   */
  isVerse() {
    return this.type === VERSE;
  }

  /**
   * Indicates whether the line type is {@link CHORUS}
   * @returns {boolean}
   */
  isChorus() {
    return this.type === CHORUS;
  }

  /**
   * Indicates whether the line contains items that are renderable. Please use {@link hasRenderableItems}
   * @deprecated
   * @returns {boolean}
   */
  hasContent() {
    return this.hasRenderableItems();
  }

  addChordLyricsPair(chords, lyrics) {
    if (chords instanceof ChordLyricsPair) {
      this.currentChordLyricsPair = chords;
    } else {
      this.currentChordLyricsPair = new ChordLyricsPair(chords, lyrics);
    }

    this.items.push(this.currentChordLyricsPair);
    return this.currentChordLyricsPair;
  }

  ensureChordLyricsPair() {
    if (!this.currentChordLyricsPair) {
      this.addChordLyricsPair();
    }
  }

  chords(chr) {
    this.ensureChordLyricsPair();
    this.currentChordLyricsPair.chords += chr;
  }

  lyrics(chr) {
    this.ensureChordLyricsPair();
    this.currentChordLyricsPair.lyrics += chr;
  }

  addTag(name, value) {
    const tag = (name instanceof Tag) ? name : new Tag(name, value);
    this.items.push(tag);
    return tag;
  }
}

export default Line;
