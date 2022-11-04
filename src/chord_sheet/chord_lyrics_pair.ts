import Chord from '../chord';
import Key from '../key';

/**
 * Represents a chord with the corresponding (partial) lyrics
 */
class ChordLyricsPair {
  chords: string;

  lyrics: string | null;

  /**
   * Initialises a ChordLyricsPair
   * @param {string} chords The chords
   * @param {string} lyrics The lyrics
   */
  constructor(chords = '', lyrics: string | null = null) {
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
  isRenderable(): boolean {
    return true;
  }

  /**
   * Returns a deep copy of the ChordLyricsPair, useful when programmatically transforming a song
   * @returns {ChordLyricsPair}
   */
  clone(): ChordLyricsPair {
    return new ChordLyricsPair(this.chords, this.lyrics);
  }

  toString(): string {
    return `ChordLyricsPair(chords=${this.chords}, lyrics=${this.lyrics})`;
  }

  set({ chords, lyrics }: { chords?: string, lyrics?: string }): ChordLyricsPair {
    return new ChordLyricsPair(
      chords || this.chords,
      lyrics || this.lyrics,
    );
  }

  setLyrics(lyrics: string): ChordLyricsPair {
    return this.set({ lyrics });
  }

  transpose(
    delta: number,
    key: string | Key | null = null,
    { normalizeChordSuffix }: { normalizeChordSuffix: boolean } = { normalizeChordSuffix: false },
  ): ChordLyricsPair {
    const chordObj = Chord.parse(this.chords.trim());

    if (chordObj) {
      let transposedChord = chordObj.transpose(delta);

      if (key) {
        transposedChord = transposedChord.normalize(key, { normalizeSuffix: normalizeChordSuffix });
      }

      return this.set({ chords: transposedChord.toString() });
    }

    return this.clone();
  }
}

export default ChordLyricsPair;
