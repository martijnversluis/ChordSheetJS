import Line from './line';

export default class Song {
  constructor() {
    this.lines = [];
    this.currentLine = null;
  }

  chords(chr) {
    this.currentLine.currentItem.chords += chr;
  }

  lyrics(chr) {
    this.currentLine || this.addLine();
    this.currentLine.currentItem.lyrics += chr;
  }

  addLine() {
    const line = new Line();
    this.lines.push(line);
    this.currentLine = line;
    return line;
  }

  addItem() {
    if (!this.currentLine) {
      this.addLine();
    }

    return this.currentLine.addItem();
  }
}
