/**
 * Represents a chord with the corresponding (partial) lyrics
 */
class ChordLyricsPair {
  chords: string;

  lyrics: string;

  /**
   * Initialises a ChordLyricsPair
   * @param {string} chords The chords
   * @param {string} lyrics The lyrics
   */
  constructor(chords = '', lyrics = '') {
    /**
     * The chords
     * @member
     * @type {string}
     */
    this.chords = chords || '';

    /**
     * The lyrics
     * @member
     * @type {string}
     */
    this.lyrics = lyrics || '';
  }

  /**
   * Indicates whether a ChordLyricsPair should be visible in a formatted chord sheet (except for ChordPro sheets)
   * @returns {boolean}
   */
  isRenderable() {
    return true;
  }

  /**
   * Returns a deep copy of the ChordLyricsPair, useful when programmatically transforming a song
   * @returns {ChordLyricsPair}
   */
  clone() {
    return new ChordLyricsPair(this.chords, this.lyrics);
  }

  toString() {
    return `ChordLyricsPair(chords=${this.chords}, lyrics=${this.lyrics})`;
  }

  set(properties) {
    return new ChordLyricsPair(
      properties.chords || this.chords,
      properties.lyrics || this.lyrics,
    );
  }
}

export default ChordLyricsPair;
