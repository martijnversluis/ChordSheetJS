import Literal from './chord_sheet/chord_pro/literal';
import Song from './chord_sheet/song';
import ChordLyricsPair from './chord_sheet/chord_lyrics_pair';
import Tag from './chord_sheet/tag';
import Comment from './chord_sheet/comment';
import Ternary from './chord_sheet/chord_pro/ternary';
import Chord from './chord';
import Line from './chord_sheet/line';
import AstType from './chord_sheet/ast_type';
import Item from './chord_sheet/item';
import Evaluatable from './chord_sheet/chord_pro/evaluatable';

import {
  SerializedChordLyricsPair,
  SerializedComment,
  SerializedComponent,
  SerializedItem,
  SerializedLine, SerializedLiteral,
  SerializedSong,
  SerializedTag, SerializedTernary,
} from './serialized_types';
import SoftLineBreak from './chord_sheet/soft_line_break';

const CHORD_LYRICS_PAIR = 'chordLyricsPair';
const CHORD_SHEET = 'chordSheet';
const COMMENT = 'comment';
const LINE = 'line';
const SOFT_LINE_BREAK = 'softLineBreak';
const TAG = 'tag';
const TERNARY = 'ternary';

/**
 * Serializes a song into een plain object, and deserializes the serialized object back into a {@link Song}
 */
class ChordSheetSerializer {
  song: Song = new Song();

  /**
   * Serializes the chord sheet to a plain object, which can be converted to any format like JSON, XML etc
   * Can be deserialized using {@link deserialize}
   * @returns object A plain JS object containing all chord sheet data
   */
  serialize(song: Song): SerializedSong {
    return {
      type: CHORD_SHEET,
      lines: song.lines.map((line) => this.serializeLine(line)),
    };
  }

  serializeLine(line: Line): SerializedLine {
    return {
      type: LINE,
      items: line.items.map((item) => this.serializeItem(item) as SerializedItem),
    };
  }

  serializeItem(item: AstType): SerializedComponent {
    if (item instanceof Tag) {
      return this.serializeTag(item) as SerializedComponent;
    }

    if (item instanceof ChordLyricsPair) {
      return this.serializeChordLyricsPair(item) as SerializedComponent;
    }

    if (item instanceof Ternary) {
      return this.serializeTernary(item) as SerializedComponent;
    }

    if (item instanceof Literal) {
      return this.serializeLiteral(item);
    }

    if (item instanceof Comment) {
      return this.serializeComment(item);
    }

    if (item instanceof SoftLineBreak) {
      return { type: SOFT_LINE_BREAK };
    }

    throw new Error(`Don't know how to serialize ${item.constructor.name}`);
  }

  serializeTag(tag: Tag): SerializedTag {
    return {
      type: TAG,
      name: tag.originalName,
      value: tag.value,
    };
  }

  serializeChordLyricsPair(chordLyricsPair: ChordLyricsPair) {
    return {
      type: CHORD_LYRICS_PAIR,
      chords: chordLyricsPair.chords,
      chord: null,
      lyrics: chordLyricsPair.lyrics,
      annotation: chordLyricsPair.annotation,
    };
  }

  serializeTernary(ternary: Ternary): object {
    return {
      type: TERNARY,
      variable: ternary.variable,
      valueTest: ternary.valueTest,
      trueExpression: this.serializeExpression(ternary.trueExpression),
      falseExpression: this.serializeExpression(ternary.falseExpression),
    };
  }

  serializeLiteral(literal: Literal) {
    return literal.string;
  }

  serializeExpression(expression: AstType[]) {
    return expression.map((part) => this.serializeItem(part));
  }

  serializeComment(comment: Comment): SerializedComment {
    return { type: COMMENT, comment: comment.content };
  }

  /**
   * Deserializes a song that has been serialized using {@link serialize}
   * @param {object} serializedSong The serialized song
   * @returns {Song} The deserialized song
   */
  deserialize(serializedSong: SerializedSong): Song {
    this.parseAstComponent(serializedSong);
    return this.song;
  }

  parseAstComponent(astComponent: SerializedComponent)
    : null | ChordLyricsPair | Tag | Comment | Ternary | Literal | SoftLineBreak {
    if (typeof astComponent === 'string') return new Literal(astComponent);

    switch (astComponent.type) {
      case CHORD_SHEET:
        this.parseChordSheet(astComponent);
        break;
      case CHORD_LYRICS_PAIR:
        return this.parseChordLyricsPair(astComponent);
      case COMMENT:
        return this.parseComment(astComponent);
      case SOFT_LINE_BREAK:
        return new SoftLineBreak();
      case TAG:
        return this.parseTag(astComponent);
      case TERNARY:
        return this.parseTernary(astComponent);
      case LINE:
        this.parseLine(astComponent);
        break;
      default:
        console.warn(`Unhandled AST component "${astComponent.type}"`, astComponent);
    }

    return null;
  }

  parseChordSheet(astComponent: SerializedSong): void {
    const { lines } = astComponent;
    this.song = new Song();
    lines.forEach((line) => this.parseAstComponent(line));
  }

  parseLine(astComponent: SerializedLine): void {
    const { items } = astComponent;
    this.song.addLine();

    items.forEach((item) => {
      const parsedItem = this.parseAstComponent(item) as Item;
      this.song.addItem(parsedItem);
    });
  }

  parseChordLyricsPair(astComponent: SerializedChordLyricsPair): ChordLyricsPair {
    const {
      chord, chords, lyrics, annotation,
    } = astComponent;

    return new ChordLyricsPair(
      chord ? new Chord(chord).toString() : chords,
      lyrics,
      annotation,
    );
  }

  parseTag(astComponent: SerializedTag): Tag {
    const {
      name,
      value,
      location: { offset = null, line = null, column = null } = {},
    } = astComponent;
    return new Tag(name, value, { line, column, offset });
  }

  parseComment(astComponent: SerializedComment): Comment {
    const { comment } = astComponent;
    return new Comment(comment);
  }

  parseTernary(astComponent: SerializedTernary): Ternary {
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
      trueExpression: this.parseExpression(trueExpression) as Evaluatable[],
      falseExpression: this.parseExpression(falseExpression) as Evaluatable[],
      offset,
      line,
      column,
    });
  }

  parseExpression(expression: Array<SerializedLiteral | SerializedTernary>): Array<AstType | null> {
    return (expression || [])
      .map((part) => this.parseAstComponent(part))
      .filter((part) => part !== null);
  }
}

export default ChordSheetSerializer;
