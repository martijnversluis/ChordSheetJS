import Song from '../chord_sheet/song';
import { END_OF_CHORUS, END_OF_VERSE, START_OF_CHORUS, START_OF_VERSE } from '../chord_sheet/tag';
import { CHORUS, NONE, VERSE } from '../constants';
import ParserWarning from './parser_warning';

const NEW_LINE = '\n';
const SQUARE_START = '[';
const SQUARE_END = ']';
const CURLY_START = '{';
const CURLY_END = '}';
const SHARP_SIGN = '#';

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

    this.song = new Song();
    this.lineNumber = 1;
    this.sectionType = NONE;
    this.resetTag();
    this.processor = this.readLyrics;
    this.parseDocument(chordProChordSheet);
    this.song.finish();
    return this.song;
  }

  parseDocument(document) {
    for (let i = 0, count = document.length; i < count; i += 1) {
      this.processor(document[i]);
    }
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
