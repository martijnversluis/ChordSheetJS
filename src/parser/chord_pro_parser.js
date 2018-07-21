import Song from '../chord_sheet/song';
import { END_OF_CHORUS, END_OF_VERSE, START_OF_CHORUS, START_OF_VERSE } from '../chord_sheet/tag';
import { CHORUS, NONE, VERSE } from '../constants';

const NEW_LINE = '\n';
const SQUARE_START = '[';
const SQUARE_END = ']';
const CURLY_START = '{';
const CURLY_END = '}';
const SHARP_SIGN = '#';

export default class ChordProParser {
  parse(document) {
    this.song = new Song();
    this.sectionType = NONE;
    this.resetTag();
    this.processor = this.readLyrics;
    this.parseDocument(document);
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
        this.sectionType = CHORUS;
        break;

      case END_OF_CHORUS:
        this.sectionType = NONE;
        this.song.setCurrentLineType(this.sectionType);
        break;

      case START_OF_VERSE:
        this.sectionType = VERSE;
        break;

      case END_OF_VERSE:
        this.sectionType = NONE;
        this.song.setCurrentLineType(this.sectionType);
        break;
    }
  }
}
