import Song from '../src/chord_sheet/song';

class SongStub extends Song {
  addLine(line) {
    this.ensureParagraph();
    this.flushLine();
    this.lines.push(line);
    this.currentLine = line;
    return this.currentLine;
  }
}

export default SongStub;
