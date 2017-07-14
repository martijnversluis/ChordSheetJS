export default class FormatterBase {
  constructor() {
    this.stringOutput = '';
  }

  output(str) {
    this.stringOutput += str;
  }

  format(song) {
    this.formatMetaData(song);

    song.lines.forEach((line) => {
      this.newLine();

      line.items.forEach((item) => {
        this.formatItem(item);
      });
    });

    this.endOfSong();
    return this.stringOutput;
  }

  formatMetaData(name, value) { }
}
