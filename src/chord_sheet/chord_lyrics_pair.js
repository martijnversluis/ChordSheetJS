export default class ChordLyricsPair {
  constructor(chords = '', lyrics = '') {
    this.chords = chords;
    this.lyrics = lyrics;
  }

  isRenderable() {
    return true;
  }

  clone() {
    return new ChordLyricsPair(this.chords, this.lyrics);
  }

  toString() {
    return `ChordLyricsPair(chords=${this.chords}, lyrics=${this.lyrics})`;
  }
}
