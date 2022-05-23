import Literal from './chord_sheet/chord_pro/literal';
import Song from './chord_sheet/song';
import ChordLyricsPair from './chord_sheet/chord_lyrics_pair';
import Tag from './chord_sheet/tag';
import Comment from './chord_sheet/comment';
import Ternary from './chord_sheet/chord_pro/ternary';
import { presence } from './utilities';

const CHORD_SHEET = 'chordSheet';
const CHORD_LYRICS_PAIR = 'chordLyricsPair';
const TAG = 'tag';
const COMMENT = 'comment';
const TERNARY = 'ternary';
const LINE = 'line';

/**
 * Serializes a song into een plain object, and deserializes the serialized object back into a {@link Song}
 */
class ChordSheetSerializer {
  song?: Song;

  /**
   * Serializes the chord sheet to a plain object, which can be converted to any format like JSON, XML etc
   * Can be deserialized using {@link deserialize}
   * @returns object A plain JS object containing all chord sheet data
   */
  serialize(song) {
    return {
      type: CHORD_SHEET,
      lines: song.lines.map((line) => this.serializeLine(line)),
    };
  }

  serializeLine(line) {
    return {
      type: LINE,
      items: line.items.map((item) => this.serializeItem(item)),
    };
  }

  serializeItem(item) {
    if (item instanceof Tag) {
      return this.serializeTag(item);
    }

    if (item instanceof ChordLyricsPair) {
      return this.serializeChordLyricsPair(item);
    }

    if (item instanceof Ternary) {
      return this.serializeTernary(item);
    }

    if (item instanceof Literal) {
      return this.serializeLiteral(item);
    }

    throw new Error(`Don't know how to serialize ${item.constructor.name}`);
  }

  serializeTag(tag) {
    return {
      type: TAG,
      name: tag.originalName,
      value: tag.value,
    };
  }

  serializeChordLyricsPair(chordLyricsPair) {
    return {
      type: CHORD_LYRICS_PAIR,
      chords: chordLyricsPair.chords,
      lyrics: chordLyricsPair.lyrics,
    };
  }

  serializeTernary(ternary) {
    return {
      type: TERNARY,
      variable: ternary.variable,
      valueTest: ternary.valueTest,
      trueExpression: this.serializeExpression(ternary.trueExpression),
      falseExpression: this.serializeExpression(ternary.falseExpression),
    };
  }

  serializeLiteral(literal) {
    return literal.string;
  }

  serializeExpression(expression) {
    return expression?.map((part) => this.serializeItem(part));
  }

  /**
   * Deserializes a song that has been serialized using {@link serialize}
   * @param {object} serializedSong The serialized song
   * @returns {Song} The deserialized song
   */
  deserialize(serializedSong) {
    this.parseAstComponent(serializedSong);
    return this.song;
  }

  parseAstComponent(astComponent) {
    if (!astComponent) {
      return null;
    }

    if (typeof astComponent === 'string') {
      return new Literal(astComponent);
    }

    const { type } = astComponent;

    switch (type) {
      case CHORD_SHEET:
        return this.parseChordSheet(astComponent);
      case CHORD_LYRICS_PAIR:
        return this.parseChordLyricsPair(astComponent);
      case TAG:
        return this.parseTag(astComponent);
      case COMMENT:
        return this.parseComment(astComponent);
      case TERNARY:
        return this.parseTernary(astComponent);
      default:
        console.warn(`Unhandled AST component "${type}"`, astComponent);
    }

    return null;
  }

  parseChordSheet(astComponent) {
    const { lines } = astComponent;
    this.song = new Song();
    lines.forEach((line) => this.parseLine(line));
  }

  parseLine(astComponent) {
    const { items } = astComponent;
    this.song.addLine();

    items.forEach((item) => {
      const parsedItem = this.parseAstComponent(item);
      this.song.addItem(parsedItem);
    });
  }

  parseChordLyricsPair(astComponent) {
    const { chords, lyrics } = astComponent;
    return new ChordLyricsPair(chords, lyrics);
  }

  parseTag(astComponent) {
    const {
      name,
      value,
      location: { offset = null, line = null, column = null } = {},
    } = astComponent;
    return new Tag(name, value, { line, column, offset });
  }

  parseComment(astComponent) {
    const { comment } = astComponent;
    return new Comment(comment);
  }

  parseTernary(astComponent) {
    const {
      variable,
      valueTest,
      trueExpression,
      falseExpression,
      location: { offset = null, line = null, column = null } = {},
    } = astComponent;

    return new Ternary({
      variable,
      valueTest,
      trueExpression: this.parseExpression(trueExpression),
      falseExpression: this.parseExpression(falseExpression),
      offset,
      line,
      column,
    });
  }

  parseExpression(expression) {
    const parsedParts = (expression || []).map((part) => this.parseAstComponent(part));
    return presence(parsedParts);
  }
}

export default ChordSheetSerializer;
