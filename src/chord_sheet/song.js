import Line from './line';
import Tag from './tag';

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
    const line = new Line();
    this.lines.push(line);
    this.currentLine = line;
    return line;
  }

  addItem() {
    this.ensureLine();
    return this.currentLine.addItem();
  }

  dropLine() {
    this.lines.pop();
  }

  ensureLine() {
    if (!this.currentLine) {
      this.addLine();
    }
  }

  addTag(name, value) {
    const tag = new Tag(name, value);

    if (tag.isMetaTag()) {
      this.metaData[tag.name] = tag.value;
      this.dropLine();
    } else {
      this.ensureLine();
      this.currentLine.addTag(tag);
    }

    return tag;
  }
}
