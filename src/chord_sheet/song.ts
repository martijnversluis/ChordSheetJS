import Line, { LineType } from './line';
import Paragraph from './paragraph';
import Key from '../key';
import ChordLyricsPair from './chord_lyrics_pair';
import { deprecate } from '../utilities';
import Metadata from './metadata';
import ParserWarning from '../parser/parser_warning';
import MetadataAccessors from './metadata_accessors';
import Item from './item';
import TraceInfo from './trace_info';
import FontStack from './font_stack';

import {
  CHORUS, NONE, ParagraphType, TAB, VERSE,
} from '../constants';

import Tag, {
  CAPO,
  END_OF_CHORUS,
  END_OF_TAB,
  END_OF_VERSE,
  KEY,
  NEW_KEY,
  START_OF_CHORUS,
  START_OF_TAB,
  START_OF_VERSE,
  TRANSPOSE,
  CHORUS as CHORUS_TAG,
} from './tag';

interface MapItemsCallback {
  (_item: Item): Item | null;
}

interface MapLinesCallback {
  (_line: Line): Line | null;
}

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
   * The song's metadata. When there is only one value for an entry, the value is a string. Else, the value is
   * an array containing all unique values for the entry.
   * @type {Metadata}
   */
  metadata: Metadata;

  currentLine: Line | null = null;

  warnings: ParserWarning[] = [];

  sectionType: ParagraphType = NONE;

  fontStack: FontStack = new FontStack();

  currentKey: string | null = null;

  transposeKey: string | null = null;

  _bodyParagraphs: Paragraph[] | null = null;

  _bodyLines: Line[] | null = null;

  /**
   * Creates a new {Song} instance
   * @param metadata {Object|Metadata} predefined metadata
   */
  constructor(metadata = {}) {
    super();
    this.metadata = new Metadata(metadata);
  }

  get previousLine(): Line | null {
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
  get bodyLines(): Line[] {
    if (!this._bodyLines) {
      this._bodyLines = this.selectRenderableItems(this.lines) as Line[];
    }

    return this._bodyLines;
  }

  /**
   * Returns the song paragraphs, skipping the paragraphs that only contain empty lines
   * (empty as in not rendering any content)
   * @see {@link bodyLines}
   * @returns {Paragraph[]}
   */
  get bodyParagraphs(): Paragraph[] {
    if (!this._bodyParagraphs) {
      this._bodyParagraphs = this.selectRenderableItems(this.paragraphs) as Paragraph[];
    }

    return this._bodyParagraphs;
  }

  selectRenderableItems(items: Array<Line | Paragraph>): Array<Line | Paragraph> {
    const copy = [...items];

    while (copy.length && !copy[0].hasRenderableItems()) {
      copy.shift();
    }

    return copy;
  }

  chords(chr: string): void {
    if (!this.currentLine) throw new Error('Expected this.currentLine to be present');
    this.currentLine.chords(chr);
  }

  lyrics(chr: string): void {
    this.ensureLine();
    if (!this.currentLine) throw new Error('Expected this.currentLine to be present');
    this.currentLine.lyrics(chr);
  }

  addLine(line?: Line): Line {
    if (line) {
      this.currentLine = line;
    } else {
      this.currentLine = new Line();
      this.lines.push(this.currentLine);
    }

    this.setCurrentProperties(this.sectionType);
    this.currentLine.transposeKey = this.transposeKey ?? this.currentKey;
    this.currentLine.key = this.currentKey || this.metadata.getSingle(KEY);
    this.currentLine.lineNumber = this.lines.length - 1;
    return this.currentLine;
  }

  private expandLine(line: Line): Line[] {
    const expandedLines = line.items.flatMap((item: Item) => {
      if (item instanceof Tag && item.name === CHORUS_TAG) {
        return this.getLastChorusBefore(line.lineNumber);
      }

      return [];
    });

    return [line, ...expandedLines];
  }

  private getLastChorusBefore(lineNumber: number | null): Line[] {
    const lines: Line[] = [];

    if (!lineNumber) {
      return lines;
    }

    for (let i = lineNumber - 1; i >= 0; i -= 1) {
      const line = this.lines[i];

      if (line.type === CHORUS) {
        const filteredLine = this.filterChorusStartEndDirectives(line);

        if (!(line.isNotEmpty() && filteredLine.isEmpty())) {
          lines.unshift(line);
        }
      } else if (lines.length > 0) {
        break;
      }
    }

    return lines;
  }

  private filterChorusStartEndDirectives(line: Line) {
    return line.mapItems((item: Item) => {
      if (item instanceof Tag) {
        if (item.name === START_OF_CHORUS || item.name === END_OF_CHORUS) {
          return null;
        }
      }

      return item;
    });
  }

  /**
   * The {@link Paragraph} items of which the song consists
   * @member {Paragraph[]}
   */
  get paragraphs(): Paragraph[] {
    return this.linesToParagraphs(this.lines);
  }

  /**
   * The body paragraphs of the song, with any `{chorus}` tag expanded into the targetted chorus
   * @type {Paragraph[]}
   */
  get expandedBodyParagraphs(): Paragraph[] {
    return this.selectRenderableItems(
      this.linesToParagraphs(
        this.lines.flatMap((line: Line) => this.expandLine(line)),
      ),
    ) as Paragraph[];
  }

  linesToParagraphs(lines: Line[]) {
    let currentParagraph = new Paragraph();
    const paragraphs = [currentParagraph];

    lines.forEach((line) => {
      if (line.isEmpty()) {
        currentParagraph = new Paragraph();
        paragraphs.push(currentParagraph);
      } else if (line.hasRenderableItems()) {
        currentParagraph.addLine(line);
      }
    });

    return paragraphs;
  }

  setCurrentProperties(sectionType: ParagraphType): void {
    if (!this.currentLine) throw new Error('Expected this.currentLine to be present');

    this.currentLine.type = sectionType as LineType;
    this.currentLine.textFont = this.fontStack.textFont.clone();
    this.currentLine.chordFont = this.fontStack.chordFont.clone();
  }

  ensureLine(): void {
    if (this.currentLine === null) {
      this.addLine();
    }
  }

  addTag(tagContents: string | Tag): Tag {
    const tag = Tag.parseOrFail(tagContents);
    this.applyTagOnSong(tag);
    this.applyTagOnLine(tag);
    return tag;
  }

  private applyTagOnLine(tag: Tag) {
    this.ensureLine();
    if (!this.currentLine) throw new Error('Expected this.currentLine to be present');
    this.currentLine.addTag(tag);
  }

  private applyTagOnSong(tag: Tag) {
    if (tag.isMetaTag()) {
      this.setMetadata(tag.name, tag.value || '');
    } else if (tag.name === TRANSPOSE) {
      this.transposeKey = tag.value;
    } else if (tag.name === NEW_KEY) {
      this.currentKey = tag.value;
    } else if (tag.isSectionDelimiter()) {
      this.setSectionTypeFromTag(tag);
    } else if (tag.isInlineFontTag()) {
      this.fontStack.applyTag(tag);
    }
  }

  setSectionTypeFromTag(tag: Tag): void {
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

  startSection(sectionType: ParagraphType, tag: Tag): void {
    this.checkCurrentSectionType(NONE, tag);
    this.sectionType = sectionType;
    this.setCurrentProperties(sectionType);
  }

  endSection(sectionType: ParagraphType, tag: Tag): void {
    this.checkCurrentSectionType(sectionType, tag);
    this.sectionType = NONE;
  }

  checkCurrentSectionType(sectionType: ParagraphType, tag: Tag): void {
    if (this.sectionType !== sectionType) {
      this.addWarning(`Unexpected tag {${tag.originalName}, current section is: ${this.sectionType}`, tag);
    }
  }

  addWarning(message: string, { line, column }: TraceInfo): void {
    const warning = new ParserWarning(message, line || null, column || null);
    this.warnings.push(warning);
  }

  addItem(item: Item): void {
    if (item instanceof Tag) {
      this.addTag(item);
    } else {
      this.ensureLine();
      if (!this.currentLine) throw new Error('Expected this.currentLine to be present');
      this.currentLine.addItem(item);
    }
  }

  /**
   * Returns a deep clone of the song
   * @returns {Song} The cloned song
   */
  clone(): Song {
    return this.mapItems((item) => item);
  }

  setMetadata(name: string, value: string): void {
    this.metadata.add(name, value);
  }

  /**
   * The song's metadata. Please use {@link metadata} instead.
   * @deprecated
   * @returns {@link Metadata} The metadata
   */
  get metaData(): Metadata {
    deprecate('metaData has been deprecated, please use metadata instead (notice the lowercase "d")');
    return this.metadata;
  }

  getMetadata(name: string): string | string[] | undefined {
    return this.metadata.getMetadata(name);
  }

  getSingleMetadata(name: string): string {
    return this.metadata.getSingleMetadata(name);
  }

  /**
   * Returns a copy of the song with the key value set to the specified key. It changes:
   * - the value for `key` in the {@link metadata} set
   * - any existing `key` directive
   * @param {number|null} key the key. Passing `null` will:
   * - remove the current key from {@link metadata}
   * - remove any `key` directive
   * @returns {Song} The changed song
   */
  setKey(key: string | number | null): Song {
    const strKey = key ? key.toString() : null;
    return this.changeMetadata(KEY, strKey);
  }

  /**
   * Returns a copy of the song with the key value set to the specified capo. It changes:
   * - the value for `capo` in the {@link metadata} set
   * - any existing `capo` directive
   * @param {number|null} capo the capo. Passing `null` will:
   * - remove the current key from {@link metadata}
   * - remove any `capo` directive
   * @returns {Song} The changed song
   */
  setCapo(capo: number | null): Song {
    const strCapo = capo ? capo.toString() : null;
    return this.changeMetadata(CAPO, strCapo);
  }

  private setDirective(name: string, value: string | null): Song {
    if (value === null) {
      return this.removeItem((item: Item) => item instanceof Tag && item.name === name);
    }

    return this.updateItem(
      (item: Item) => item instanceof Tag && item.name === name,
      (item: Item) => (('set' in item) ? item.set({ value }) : item),
      (song: Song) => song.insertDirective(name, value),
    );
  }

  /**
   * Transposes the song by the specified delta. It will:
   * - transpose all chords, see: {@link Chord#transpose}
   * - transpose the song key in {@link metadata}
   * - update any existing `key` directive
   * @param {number} delta The number of semitones (positive or negative) to transpose with
   * @param {Object} [options={}] options
   * @param {boolean} [options.normalizeChordSuffix=false] whether to normalize the chord suffixes after transposing
   * @returns {Song} The transposed song
   */
  transpose(delta: number, { normalizeChordSuffix = false } = {}): Song {
    const wrappedKey = Key.wrap(this.key);
    let transposedKey: Key | null = null;
    let song = (this as Song);

    if (wrappedKey) {
      transposedKey = wrappedKey.transpose(delta);
      song = song.setKey(transposedKey.toString());
    }

    return song.mapItems((item) => {
      if (item instanceof ChordLyricsPair) {
        return (item as ChordLyricsPair).transpose(delta, transposedKey, { normalizeChordSuffix });
      }

      return item;
    });
  }

  /**
   * Transposes the song up by one semitone. It will:
   * - transpose all chords, see: {@link Chord#transpose}
   * - transpose the song key in {@link metadata}
   * - update any existing `key` directive
   * @param {Object} [options={}] options
   * @param {boolean} [options.normalizeChordSuffix=false] whether to normalize the chord suffixes after transposing
   * @returns {Song} The transposed song
   */
  transposeUp({ normalizeChordSuffix = false } = {}): Song {
    return this.transpose(1, { normalizeChordSuffix });
  }

  /**
   * Transposes the song down by one semitone. It will:
   * - transpose all chords, see: {@link Chord#transpose}
   * - transpose the song key in {@link metadata}
   * - update any existing `key` directive
   * @param {Object} [options={}] options
   * @param {boolean} [options.normalizeChordSuffix=false] whether to normalize the chord suffixes after transposing
   * @returns {Song} The transposed song
   */
  transposeDown({ normalizeChordSuffix = false } = {}): Song {
    return this.transpose(-1, { normalizeChordSuffix });
  }

  /**
   * Returns a copy of the song with the key set to the specified key. It changes:
   * - the value for `key` in the {@link metadata} set
   * - any existing `key` directive
   * - all chords, those are transposed according to the distance between the current and the new key
   * @param {string} newKey The new key.
   * @returns {Song} The changed song
   */
  changeKey(newKey: string | Key): Song {
    const transpose = this.getTransposeDistance(newKey);

    const updatedSong = this.mapItems((item) => {
      if (item instanceof Tag && item.name === KEY) {
        return item.set({ value: newKey.toString() });
      }

      if (item instanceof ChordLyricsPair) {
        return item.transpose(transpose, newKey);
      }

      return item;
    });

    this.setKey(newKey.toString());
    return updatedSong;
  }

  getTransposeDistance(newKey: string | Key): number {
    const wrappedKey = Key.wrap(this.key);

    if (!wrappedKey) {
      throw new Error(`
Cannot change song key, the original key is unknown.

Either ensure a key directive is present in the song (when using chordpro):
  \`{key: C}\`

Or set the song key before changing key:
  \`song.setKey('C');\``.substring(1));
    }

    return wrappedKey.distanceTo(newKey);
  }

  /**
   * Returns a copy of the song with the directive value set to the specified value.
   * - when there is a matching directive in the song, it will update the directive
   * - when there is no matching directive, it will be inserted
   * If `value` is `null` it will act as a delete, any directive matching `name` will be removed.
   * @param {string} name The directive name
   * @param {string | null} value The value to set, or `null` to remove the directive
   */
  changeMetadata(name: string, value: string | null): Song {
    const updatedSong = this.setDirective(name, value);
    updatedSong.metadata.set(name, value);
    return updatedSong;
  }

  private insertDirective(name: string, value: string, { after = null } = {}): Song {
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

  /**
   * Change the song contents inline. Return a new {@link Item} to replace it. Return `null` to remove it.
   * @example
   * // transpose all chords:
   * song.mapItems((item) => {
   *   if (item instanceof ChordLyricsPair) {
   *     return item.transpose(2, 'D');
   *   }
   *
   *   return item;
   * });
   * @param {MapItemsCallback} func the callback function
   * @returns {Song} the changed song
   */
  mapItems(func: MapItemsCallback): Song {
    const clonedSong = new Song();

    this.lines.forEach((line) => {
      clonedSong.addLine();

      line.items.forEach((item) => {
        const changedItem = func(item);

        if (changedItem) {
          clonedSong.addItem(changedItem);
        }
      });
    });

    return clonedSong;
  }

  /**
   * Change the song contents inline. Return a new {@link Line} to replace it. Return `null` to remove it.
   * @example
   * // remove lines with only Tags:
   * song.mapLines((line) => {
   *   if (line.items.every(item => item instanceof Tag)) {
   *     return null;
   *   }
   *
   *   return line;
   * });
   * @param {MapLinesCallback} func the callback function
   * @returns {Song} the changed song
   */
  mapLines(func: MapLinesCallback): Song {
    const clonedSong = new Song();

    this.lines.forEach((line) => {
      const changedLine = func(line);

      if (changedLine) {
        clonedSong.addLine();
        changedLine.items.forEach((item) => clonedSong.addItem(item));
      }
    });

    return clonedSong;
  }

  private updateItem(
    findCallback: (_item: Item) => boolean,
    updateCallback: (_item: Item) => Item,
    notFoundCallback: (_song: Song) => Song,
  ): Song {
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

  private removeItem(callback: (_item: Item) => boolean): Song {
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
