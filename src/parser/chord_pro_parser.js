import ChordProPegParser from './chord_pro_peg_parser';
import Song from '../chord_sheet/song';
import Tag, {
  END_OF_CHORUS, END_OF_VERSE, START_OF_CHORUS, START_OF_VERSE,
} from '../chord_sheet/tag';
import { CHORUS, NONE, VERSE } from '../constants';
import ParserWarning from './parser_warning';

const NEW_LINE = '\n';
const SQUARE_START = '[';
const SQUARE_END = ']';
const CURLY_START = '{';
const CURLY_END = '}';
const SHARP_SIGN = '#';

const CHORD_SHEET = 'chordSheet';
const CHORD_LYRICS_PAIR = 'chordLyricsPair';
const TAG = 'tag';
const COMMENT = 'comment';

/**
 * Parses a ChordPro chord sheet
 */
class ChordProParser {
  /**
   * Parses a ChordPro chord sheet into a song
   * @param {string} chordProChordSheet the ChordPro chord sheet
   * @returns {Song} The parsed song
   */
  parse(chordProChordSheet) {
    /**
     * All warnings raised during parsing the ChordPro chord sheet
     * @member
     * @type {Array<ParserWarning>}
     */
    this.warnings = [];

    const ast = ChordProPegParser.parse(chordProChordSheet);
    this.parseAstComponent(ast);
    this.song.finish();
    return this.song;
  }

  parseAstComponent(astComponent) {
    const { type } = astComponent;

    switch (type) {
      case CHORD_SHEET:
        this.parseChordSheet(astComponent);
        break;
      case CHORD_LYRICS_PAIR:
        this.parseChordLyricsPair(astComponent);
        break;
      case TAG:
        this.parseTag(astComponent);
        break;
      case COMMENT:
        this.parseComment(astComponent);
        break;
      default: console.warn(`Unhandled AST component "${type}"`);
    }
  }

  parseChordSheet(astComponent) {
    const { lines } = astComponent;
    this.song = new Song();
    this.sectionType = NONE;
    lines.forEach((line, index) => this.parseLine(line, index));
  }

  parseLine(astComponent, lineNumber) {
    const { items } = astComponent;
    this.lineNumber = lineNumber + 1;
    this.song.addLine();
    this.song.setCurrentLineType(this.sectionType);
    items.forEach((item) => this.parseAstComponent(item));
  }

  parseChordLyricsPair(astComponent) {
    const { chord, lyrics } = astComponent;
    this.song.addChordLyricsPair(chord, lyrics);
  }

  parseTag(astComponent) {
    const { name, value } = astComponent;
    const parsedTag = this.song.addTag(new Tag(name, value));
    this.applyTag(parsedTag);
  }

  parseComment(astComponent) {
    const { comment } = astComponent;
    this.song.addComment(comment);
  }

  readLyrics(chr) {
    switch (chr) {
      case SHARP_SIGN:
        this.processor = this.readComment;
        break;
      case NEW_LINE:
        this.lineNumber += 1;
        this.song.addLine();
        this.song.setCurrentLineType(this.sectionType);
        break;
      case SQUARE_START:
        this.song.addChordLyricsPair();
        this.processor = this.readChords;
        break;
      case CURLY_START:
        this.processor = this.readTag;
        break;
      default:
        this.song.lyrics(chr);
    }
  }

  readChords(chr) {
    switch (chr) {
      case NEW_LINE:
        break;
      case SQUARE_START:
        break;
      case SQUARE_END:
        this.processor = this.readLyrics;
        break;
      default:
        this.song.chords(chr);
    }
  }

  readTag(chr) {
    switch (chr) {
      case CURLY_END:
        this.finishTag();
        this.processor = this.readLyrics;
        break;
      default:
        this.tag += chr;
    }
  }

  readComment(chr) {
    switch (chr) {
      case NEW_LINE:
        this.processor = this.readLyrics;
        break;
      default:
        break;
    }
  }

  finishTag() {
    const parsedTag = this.song.addTag(this.tag);
    this.applyTag(parsedTag);
    this.resetTag();
  }

  resetTag() {
    this.tag = '';
  }

  applyTag(tag) {
    switch (tag.name) {
      case START_OF_CHORUS:
        this.startSection(CHORUS, tag);
        break;

      case END_OF_CHORUS:
        this.endSection(CHORUS, tag);
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
  }

  endSection(sectionType, tag) {
    this.checkCurrentSectionType(sectionType, tag);
    this.sectionType = NONE;
    this.song.setCurrentLineType(this.sectionType);
  }

  checkCurrentSectionType(sectionType, tag) {
    if (this.sectionType !== sectionType) {
      this.addWarning(`Unexpected tag {${tag.originalName}, current section is: ${this.sectionType}`);
    }
  }

  addWarning(message) {
    const warning = new ParserWarning(message, this.lineNumber);
    this.warnings.push(warning);
  }
}

export default ChordProParser;
