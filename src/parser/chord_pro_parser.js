import ParserBase from './parser_base';
import Song from '../chord_sheet/song';

const NEW_LINE = '\n';
const SQUARE_START = '[';
const SQUARE_END = ']';
const CURLY_START = '{';
const CURLY_END = '}';
const COLON = ':';

export default class ChordProParser extends ParserBase {
  constructor() {
    super();

    this.currentState = this.state('readLyrics', () => {
      this.on(NEW_LINE, () => {
        this.song.addLine();
      });

      this.on(SQUARE_START, () => {
        this.song.addItem();
        this.transitionTo('readChords');
      });

      this.on(CURLY_START, () => {
        this.transitionTo('readTagName');
      });

      this.else((chr) => {
        this.song.lyrics(chr);
      });
    });

    this.state('readChords', () => {
      this.ignore(NEW_LINE, SQUARE_START);

      this.on(SQUARE_END, () => {
        this.transitionTo('readLyrics');
      });

      this.else((chr) => {
        this.song.chords(chr);
      });
    });

    this.state('readTagName', () => {
      this.on(COLON, () => {
        this.transitionTo('readTagValue');
      });

      this.on(CURLY_END, () => {
        this.finishTag();
        this.transitionTo('readLyrics');
      });

      this.else((chr) => {
        this.tagName += chr;
      });
    });

    this.state('readTagValue', () => {
      this.on(CURLY_END, () => {
        this.finishTag();
        this.transitionTo('readLyrics');
      });

      this.else((chr) => {
        this.tagValue += chr;
      });
    });
  }

  finishTag() {
    this.debug(`Tag: ${this.tagName} = ${this.tagValue}`);
    this.tagName = '';
    this.tagValue = '';
  }

  parse(document) {
    this.song = new Song();
    this.tagName = '';
    this.tagValue = '';
    super.parse(document);
    return this.song;
  }
}
