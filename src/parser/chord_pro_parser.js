import Song from '../chord_sheet/song';

const NEW_LINE = '\n';
const SQUARE_START = '[';
const SQUARE_END = ']';
const CURLY_START = '{';
const CURLY_END = '}';
const COLON = ':';
const SHARP_SIGN = '#';

export default class ChordProParser {
  parse(document) {
    this.song = new Song();
    this.resetTag();
    this.processor = this.readLyrics;
    this.parseDocument(document);
    return this.song;
  }

  parseDocument(document) {
    for (let chr of document) {
      this.processor(chr);
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
        this.processor = this.readTagName;
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

  readTagName(chr) {
    switch (chr) {
      case COLON:
        this.processor = this.readTagValue;
        break;
      case CURLY_END:
        this.finishTag();
        this.processor = this.readLyrics;
        break;
      default:
        this.tagName += chr;
    }
  }

  readTagValue(chr) {
    switch (chr) {
      case CURLY_END:
        this.finishTag();
        this.processor = this.readLyrics;
        break;
      default:
        this.tagValue += chr;
    }
  }

  readComment(chr) {
    switch (chr) {
      case NEW_LINE:
        this.processor = this.readLyrics;
        break;
    }
  }

  finishTag() {
    this.song.addTag(this.tagName, this.tagValue);
    this.resetTag();
  }

  resetTag() {
    this.tagName = '';
    this.tagValue = '';
  }
}
