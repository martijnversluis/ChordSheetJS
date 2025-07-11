import Chord from '../chord';
import ChordDefinition from '../chord_definition/chord_definition';
import ChordDefinitionSet from '../chord_definition/chord_definition_set';
import ChordLyricsPair from './chord_lyrics_pair';
import Configuration from '../formatter/configuration';
import FormattingContext from '../formatter/formatting_context';
import Item from './item';
import Key from '../key';
import Line from './line';
import LineExpander from './line_expander';
import Metadata from './metadata';
import MetadataAccessors from './metadata_accessors';
import Paragraph from './paragraph';
import ParserWarning from '../parser/parser_warning';
import SongBuilder from '../song_builder';
import SongMapper from './song_mapper';
import Tag from './tag';

import { Modifier } from '../constants';
import { filterObject } from '../utilities';
import { testSelector } from '../helpers';
import { CAPO, KEY } from './tags';

type MapItemsCallback = (_item: Item) => Item | Item[] | null;

/**
 * Represents a song in a chord sheet. Currently a chord sheet can only have one song.
 */
class Song extends MetadataAccessors {
  /**
   * The {@link Line} items of which the song consists
   * @member {Line[]}
   */
  lines: Line[] = [];

  _bodyLines: Line[] | null = null;

  _bodyParagraphs: Paragraph[] | null = null;

  warnings: ParserWarning[] = [];

  _metadata: Metadata | null = null;

  /**
   * Creates a new {Song} instance
   * @param metadata {Record<string, string | string[]>|Metadata} predefined metadata
   */
  constructor(metadata: Record<string, string | string[]> | Metadata | null = null) {
    super();

    if (metadata) {
      this._metadata = new Metadata(metadata);
    }
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

  selectRenderableItems(items: (Line | Paragraph)[]): (Line | Paragraph)[] {
    const copy = [...items];

    while (copy.length && !copy[0].hasRenderableItems()) {
      copy.shift();
    }

    return copy;
  }

  /**
   * The {@link Paragraph} items of which the song consists
   * @member {Paragraph[]}
   */
  get paragraphs(): Paragraph[] {
    return this.linesToParagraphs(this.lines);
  }

  /**
   * The body paragraphs of the song, with any `{chorus}` tag expanded into the targeted chorus
   * @type {Paragraph[]}
   */
  get expandedBodyParagraphs(): Paragraph[] {
    return this.selectRenderableItems(
      this.linesToParagraphs(
        this.lines.flatMap((line: Line) => LineExpander.expand(line, this)),
      ),
    ) as Paragraph[];
  }

  linesToParagraphs(lines: Line[]): Paragraph[] {
    let currentParagraph = new Paragraph();
    const paragraphs = [currentParagraph];

    lines.forEach((line, index) => {
      const nextLine: Line | null = lines[index + 1] || null;

      if (line.isEmpty() || (line.isSectionEnd() && nextLine && !nextLine.isEmpty())) {
        currentParagraph = new Paragraph();
        paragraphs.push(currentParagraph);
      } else if (line.hasRenderableItems()) {
        currentParagraph.addLine(line);
      }
    });

    return paragraphs;
  }

  /**
   * Returns a deep clone of the song
   * @returns {Song} The cloned song
   */
  clone(): Song {
    const clone = new Song();
    clone.warnings = [...this.warnings];
    clone.lines = this.lines.map((line) => line.clone());
    return clone;
  }

  getMetadataValue(name: string): string | string[] | null {
    return this.metadata.getMetadataValue(name);
  }

  getSingleMetadataValue(name: string): string | null {
    return this.metadata.getSingleMetadataValue(name);
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

  private updateDirectives(metadata: Record<string, string | string[] | null>): Song {
    const updates = { ...metadata };

    const newMetadata: Record<string, string | string[] | null> =
      filterObject<string | string[] | null>(updates, (key, value) => (
        value !== null && !this.metadata.contains(key)
      ));

    const updatedSong = this.changeOrDeleteDirectives(updates);
    updatedSong.insertDirectives(newMetadata);
    return updatedSong;
  }

  private changeOrDeleteDirectives(updates: Record<string, string | string[] | null>) {
    const pendingUpdates = { ...updates };

    return this.mapItems((item: Item) => {
      if (!(item instanceof Tag)) {
        return item;
      }

      const tag = item as Tag;

      if (!(tag.name in pendingUpdates && tag.isMetaTag())) {
        return item;
      }

      const replacementValue = pendingUpdates[tag.name];

      if (replacementValue === null) {
        return null;
      }

      pendingUpdates[tag.name] = null;

      return [replacementValue].flat().map((value) => new Tag(tag.name, value));
    });
  }

  private insertDirectives(metadata: Record<string, string | string[] | null>, { after = null } = {}): void {
    const insertIndex = this.lines.findIndex((line) => (
      line.items.some((item) => (
        !(item instanceof Tag) || (after && item.name === after)
      ))
    ));

    const newLines = Object.keys(metadata).flatMap((name) => {
      const values = [metadata[name]].flat();

      return values.flatMap((value) => {
        const line = new Line();
        line.addTag(name, value);
        return line;
      });
    });

    const { lines } = this;
    this.lines = [...lines.slice(0, insertIndex), ...newLines, ...lines.slice(insertIndex)];
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
  transpose(
    delta: number,
    { modifier, normalizeChordSuffix = false }:
      { modifier?: Modifier | null, normalizeChordSuffix?: boolean } = {},
  ): Song {
    let transposedKey: Key | null = null;
    const song = (this as Song);

    return song.mapItems((item) => {
      if (item instanceof Tag && item.name === KEY) {
        transposedKey = Key.wrapOrFail(item.value).transpose(delta);
        if (modifier) transposedKey = transposedKey.useModifier(modifier);
        return item.set({ value: transposedKey.toString() });
      }

      if (item instanceof ChordLyricsPair) {
        return Song.transposeChordLyricsPair({
          item,
          delta,
          transposedKey,
          normalizeChordSuffix,
          modifier: modifier || null,
        });
      }

      return item;
    });
  }

  private static transposeChordLyricsPair(
    {
      item,
      delta,
      transposedKey,
      normalizeChordSuffix,
      modifier,
    }:
    {
      item: ChordLyricsPair,
      delta: number,
      transposedKey: Key | null,
      normalizeChordSuffix: boolean,
      modifier: Modifier | null
    },
  ) {
    let chord = item.transpose(delta, transposedKey, { normalizeChordSuffix });

    if (modifier) {
      chord = chord.useModifier(modifier);
    }

    return chord;
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
  transposeUp({ normalizeChordSuffix = false }: { normalizeChordSuffix?: boolean; } = {}): Song {
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
  transposeDown({ normalizeChordSuffix = false }: { normalizeChordSuffix?: boolean; } = {}): Song {
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
    const currentKey = this.requireCurrentKey();
    const targetKey = Key.wrapOrFail(newKey);
    const delta = currentKey.distanceTo(targetKey);
    return this.transpose(delta, { modifier: targetKey.modifier });
  }

  /**
   * Returns a copy of the song with all chords changed to the specified modifier.
   *
   * Examples:
   *
   * ```js
   * song.useModifier('#');
   * song.useModifier('b');
   * ```
   *
   * @param {Modifier} modifier the new modifier
   * @returns {Song} the changed song
   */
  useModifier(modifier: Modifier): Song {
    const { currentKey } = this;
    let changedSong = this.mapChordLyricsPairs((pair) => pair.useModifier(modifier));

    if (currentKey && currentKey.modifier !== modifier) {
      changedSong = changedSong.changeKey(currentKey.useModifier(modifier));
    }

    return changedSong;
  }

  /**
   * Returns a copy of the song with all chords normalized to the specified key. See {@link Chord#normalize}.
   * @param key the key to normalize to
   * @param options options
   * @param options.normalizeSuffix whether to normalize the chord suffixes
   */
  normalizeChords(
    key: Key | string | null = null,
    { normalizeSuffix = true }: { normalizeSuffix?: boolean; } = {},
  ): Song {
    return this.changeChords((chord) => chord.normalize(key, { normalizeSuffix }));
  }

  mapChordLyricsPairs(func: (pair: ChordLyricsPair) => ChordLyricsPair): Song {
    return this.mapItems((item) => {
      if (item instanceof ChordLyricsPair) {
        return func(item);
      }

      return item;
    });
  }

  changeChords(func: (chord: Chord) => Chord): Song {
    return this.mapChordLyricsPairs((pair) => pair.changeChord(func));
  }

  get currentKey(): Key | null {
    return Key.wrap(this.key);
  }

  requireCurrentKey(): Key {
    const { currentKey } = this;

    if (!currentKey) {
      throw new Error(`
Cannot change song key, the original key is unknown.

Either ensure a key directive is present in the song (when using chordpro):
  \`{key: C}\`

Or set the song key before changing key:
  \`song.setKey('C');\``.substring(1));
    }

    return currentKey;
  }

  /**
   * Returns a copy of the song with the directive value set to the specified value.
   * - when there is a matching directive in the song, it will update the directive
   * - when there is no matching directive, it will be inserted
   * If `value` is `null` it will act as a delete, any directive matching `name` will be removed.
   *
   * @example
   * ```javascript
   * song.changeMetadata('author', 'John');
   * song.changeMetadata('composer', ['Jane', 'John']);
   * song.changeMetadata('key', null); // Remove key directive
   * ```
   * @param name The directive name
   * @param {string | string[] | null} value The value to set, or `null` to remove the directive
   * @return {Song} The changed song
   */
  changeMetadata(name: string, value: string | string[] | null): Song;

  /**
   * Returns a copy of the song with the metadata changed. It will:
   * - update the metadata
   * - update any existing directive matching the metadata key
   * - insert a new directive if it does not exist
   * @example
   * ```javascript
   * song.changeMetadata({
   *   author: 'John',
   *   composer: ['Jane', 'John'],
   *   key: null, // Remove key directive
   * });
   * ```
   * @param {Record<string, string | string[] | null>} metadata The metadata to change
   * @returns {Song} The changed song
   */
  changeMetadata(metadata: Record<string, string | string[] | null>): Song;

  changeMetadata(
    nameOrData: string | Record<string, string | string[] | null>,
    value?: string | string[] | null,
  ): Song {
    if (typeof nameOrData === 'string') {
      if (typeof value === 'undefined') {
        throw new Error('Value is required when name is a string');
      }

      return this.changeMetadata({ [nameOrData]: value });
    }

    const updatedSong = this.updateDirectives(nameOrData);
    updatedSong.metadata.assign(nameOrData);
    return updatedSong;
  }

  addLine(line: Line) {
    this.lines.push(line);
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
    return new SongMapper(this).mapItems(func);
  }

  foreachItem(func: (_item: Item) => void): void {
    this.lines.forEach((line) => {
      line.items.forEach(func);
    });
  }

  /**
   * Returns all unique chords used in the song
   * @returns {string[]} the chords
   */
  getChords(): string[] {
    const chords = new Set<string>();

    this.foreachItem((item: Item) => {
      if (!(item instanceof ChordLyricsPair)) {
        return;
      }

      const itemChords = (item as ChordLyricsPair).chords;

      if (itemChords && itemChords.length > 0) {
        const parsedChord = Chord.parse(itemChords);

        if (parsedChord) {
          chords.add(parsedChord.toString());
        }
      }
    });

    return Array.from(chords);
  }

  /**
   * Returns all chord definitions from the song.
   * Definitions are made using the `{chord}` or `{define}` directive.
   * A chord definitions overrides a previous chord definition for the exact same chord.
   * @returns {Record<string, ChordDefinition>} the chord definitions
   * @see https://chordpro.org/chordpro/directives-define/
   * @see https://chordpro.org/chordpro/directives-chord/
   */
  getChordDefinitions(context?: FormattingContext): Record<string, ChordDefinition> {
    const chordDefinitions: Record<string, ChordDefinition> = {};

    this.foreachItem((item: Item) => {
      if (!(item instanceof Tag)) {
        return;
      }

      const { chordDefinition, selector, isNegated } = (item as Tag);

      if (selector && context && !testSelector({ selector, isNegated }, context)) {
        return;
      }

      if (chordDefinition) {
        chordDefinitions[chordDefinition.name] = chordDefinition.clone();
      }
    });

    return chordDefinitions;
  }

  /**
   * The song's metadata. When there is only one value for an entry, the value is a string. Else, the value is
   * an array containing all unique values for the entry.
   * @type {Metadata}
   */
  get metadata(): Metadata {
    if (!this._metadata) {
      this._metadata = this.getMetadata();
    }

    return this._metadata;
  }

  getMetadata(configuration?: Configuration): Metadata {
    const metadata = new Metadata();

    this.foreachItem((item: Item) => {
      if (!(item instanceof Tag)) {
        return;
      }

      const tag = item as Tag;

      if (!tag.isMetaTag()) {
        return;
      }

      const { selector, isNegated } = tag;

      if (selector && configuration && !testSelector({ selector, isNegated }, { metadata, configuration })) {
        return;
      }

      metadata.add(item.name, item.value);
    });

    return metadata;
  }

  get chordDefinitions(): ChordDefinitionSet {
    return new ChordDefinitionSet(this.getChordDefinitions());
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
  mapLines(func: (_line: Line) => Line | null): Song {
    const clonedSong = new Song();
    const builder = new SongBuilder(clonedSong);

    this.lines.forEach((line) => {
      const changedLine = func(line);

      if (changedLine) {
        builder.addLine();
        changedLine.items.forEach((item) => builder.addItem(item));
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
