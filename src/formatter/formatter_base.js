export default class FormatterBase {
  constructor() {
    this.stringOutput = '';
  }

  output(str) {
    this.stringOutput += str;
  }

  format(song) {
    this.outputMetaData(song);
    this.startOfSong();

    song.lines.forEach((line) => {
      this.newLine();

      line.items.forEach((item) => {
        this.outputItem(item);
      });
    });

    this.endOfSong();
    return this.stringOutput;
  }

  outputMetaData(name, value) { }
  startOfSong() { }
  endOfSong() { }
}
