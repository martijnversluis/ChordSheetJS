import Song from '../chord_sheet/song';

const NEW_LINE = '\n';
const SQUARE_START = '[';
const SQUARE_END = ']';
const CURLY_START = '{';
const CURLY_END = '}';
const SHARP_SIGN = '#';

export default class ChordProParser {
  parse(document) {
    this.song = new Song();
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
    this.song.addTag(this.tag);
    this.resetTag();
  }

  resetTag() {
    this.tag = '';
  }
}
