import Line from './line';
import Tag from './tag';
import { pushNew } from '../utilities';

const TITLE = 'title';
const SUBTITLE = 'subtitle';

export default class Song {
  constructor(metaData = {}) {
    this.lines = [];
    this.currentLine = null;
    this.metaData = metaData;
  }

  chords(chr) {
    this.currentLine.chords(chr);
  }

  lyrics(chr) {
    this.ensureLine();
    this.currentLine.lyrics(chr);
  }

  addLine() {
    this.currentLine = pushNew(this.lines, Line);
    return this.currentLine;
  }

  addChordLyricsPair() {
    this.ensureLine();
    return this.currentLine.addChordLyricsPair();
  }

  ensureLine() {
    if (!this.currentLine) {
      this.addLine();
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
