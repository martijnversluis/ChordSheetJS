export default class ChordLyricsPair {
  constructor(chords = '', lyrics = '') {
    this.chords = chords;
    this.lyrics = lyrics;
  }

  clone() {
    return new ChordLyricsPair(this.chords, this.lyrics);
  }
}
