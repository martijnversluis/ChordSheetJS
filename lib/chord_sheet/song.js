import Line from './line';

export default class Song {
  constructor() {
    this.lines = [];
    this.currentLine = null;
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

  ensureLine() {
    if (!this.currentLine) {
      this.addLine();
    }
  }

  addTag(name, value) {
    this.ensureLine();
    return this.currentLine.addTag(name, value);
  }
}
