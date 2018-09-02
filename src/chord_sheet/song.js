import Line from './line';
import Tag, {
  ALBUM,
  ARTIST,
  CAPO,
  COMPOSER,
  COPYRIGHT,
  DURATION,
  KEY,
  LYRICIST,
  SUBTITLE,
  TEMPO,
  TIME,
  TITLE,
  YEAR,
} from './tag';
import Paragraph from './paragraph';
import { pushNew } from '../utilities';

export default class Song {
  constructor(metaData = {}) {
    this.lines = [];
    this.currentLine = null;
    this.paragraphs = [];
    this.currentParagraph = null;
    this.metaData = metaData;
  }

  get bodyLines() {
    if (this._bodyLines === undefined) {
      this._bodyLines = [...this.lines];

      while (!this._bodyLines[0].hasRenderableItems()) {
        this._bodyLines.shift();
      }
    }

    return this._bodyLines;
  }

  chords(chr) {
    this.currentLine.chords(chr);
  }

  lyrics(chr) {
    this.ensureLine();
    this.currentLine.lyrics(chr);
  }

  addLine() {
    this.ensureParagraph();
    this.flushLine();
    this.currentLine = pushNew(this.lines, Line);
    return this.currentLine;
  }

  setCurrentLineType(type) {
    if (this.currentLine) {
      this.currentLine.type = type;
    }
  }

  flushLine() {
    if (this.currentLine !== null) {
      if (this.currentLine.isEmpty()) {
        this.addParagraph();
      } else if (this.currentLine.hasRenderableItems()) {
        this.currentParagraph.addLine(this.currentLine);
      }
    }
  }

  finish() {
    this.flushLine();
  }

  addChordLyricsPair() {
    this.ensureLine();
    return this.currentLine.addChordLyricsPair();
  }

  ensureLine() {
    if (this.currentLine === null) {
      this.addLine();
    }
  }

  addParagraph() {
    this.currentParagraph = pushNew(this.paragraphs, Paragraph);
    return this.currentParagraph;
  }

  ensureParagraph() {
    if (this.currentParagraph === null) {
      this.addParagraph();
    }
  }

  addTag(tagContents) {
    const tag = Tag.parse(tagContents);

    if (tag.isMetaTag()) {
      this.metaData[tag.name] = tag.value;
    }

    this.ensureLine();
    this.currentLine.addTag(tag);

    return tag;
  }

  clone() {
    const clonedSong = new Song();
    clonedSong.lines = this.lines.map(line => line.clone());
    clonedSong.metaData = { ...this.metaData };
    return clonedSong;
  }

  get album() {
    return this.getMetaData(ALBUM);
  }

  get artist() {
    return this.getMetaData(ARTIST);
  }

  get capo() {
    return this.getMetaData(CAPO);
  }

  get composer() {
    return this.getMetaData(COMPOSER);
  }

  get copyright() {
    return this.getMetaData(COPYRIGHT);
  }

  get duration() {
    return this.getMetaData(DURATION);
  }

  get key() {
    return this.getMetaData(KEY);
  }

  get lyricist() {
    return this.getMetaData(LYRICIST);
  }

  get tempo() {
    return this.getMetaData(TEMPO);
  }

  get time() {
    return this.getMetaData(TIME);
  }

  get title() {
    return this.getMetaData(TITLE);
  }

  get subtitle() {
    return this.getMetaData(SUBTITLE);
  }

  get year() {
    return this.getMetaData(YEAR);
  }

  getMetaData(name) {
    return this.metaData[name] || null;
  }
}
