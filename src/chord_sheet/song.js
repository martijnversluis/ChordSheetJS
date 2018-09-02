import Line from './line';
import Tag from './tag';
import Paragraph from './paragraph';
import { pushNew } from '../utilities';

const TITLE = 'title';
const SUBTITLE = 'subtitle';

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

  get title() {
    return this.metaData[TITLE] || '';
  }

  get subtitle() {
    return this.metaData[SUBTITLE] || '';
  }

  clone() {
    const clonedSong = new Song();
    clonedSong.lines = this.lines.map(line => line.clone());
    clonedSong.metaData = { ...this.metaData };
    return clonedSong;
  }
}
