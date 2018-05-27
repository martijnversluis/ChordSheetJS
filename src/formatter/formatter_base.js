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

      if (line.items.length > 0) {
        line.items.forEach((item, itemIndex) => {
          this.outputItem(item);
        });
      } else {
        this.emptyLine();
      }
    });

    this.endOfSong();
    return this.stringOutput;
  }

  emptyLine() { }
  outputMetaData() { }
  startOfSong() { }
  endOfSong() { }
}
