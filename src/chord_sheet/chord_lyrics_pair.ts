import Chord from '../chord';
import Key from '../key';

import { Accidental } from '../constants';
import { deprecate } from '../utilities';

/**
 * Represents a chord with the corresponding (partial) lyrics
 */
class ChordLyricsPair {
  chords: string;

  lyrics: string | null;

  annotation: string | null;

  private _chordObj: Chord | null = null;

  /**
   * Initialises a ChordLyricsPair
   * @param {string} chords The chords
   * @param {string | null} lyrics The lyrics
   * @param {string | null} annotation The annotation
   * @param {Chord | null} chordObj Optional pre-parsed Chord object
   */
  constructor(
    chords = '',
    lyrics: string | null = null,
    annotation: string | null = null,
    chordObj: Chord | null = null,
  ) {
    this.chords = chords || '';
    this.lyrics = lyrics || '';
    this.annotation = annotation || '';
    this._chordObj = chordObj;
  }

  /** Returns the Chord object if available, otherwise parses from string */
  get chord(): Chord | null {
    return this._chordObj || Chord.parse(this.chords.trim());
  }

  /**
   * Indicates whether a ChordLyricsPair should be visible in a formatted chord sheet (except for ChordPro sheets)
   * @returns {boolean}
   */
  isRenderable(): boolean {
    return true;
  }

  /**
   * Indicates whether the ChordLyricsPair has non-empty lyrics.
   */
  hasLyrics(): boolean {
    return !!(this.lyrics && this.lyrics.trim().length > 0);
  }

  /**
   * Returns a deep copy of the ChordLyricsPair, useful when programmatically transforming a song
   * @returns {ChordLyricsPair}
   */
  clone(): ChordLyricsPair {
    return new ChordLyricsPair(this.chords, this.lyrics, this.annotation, this._chordObj?.clone() || null);
  }

  toString(): string {
    return `ChordLyricsPair(chords=${this.chords}, lyrics=${this.lyrics})`;
  }

  set(
    {
      chords, lyrics, annotation, chordObj,
    }:
    { chords?: string, lyrics?: string, annotation?: string, chordObj?: Chord | null },
  ): ChordLyricsPair {
    return new ChordLyricsPair(
      chords ?? this.chords,
      lyrics ?? this.lyrics,
      annotation ?? this.annotation,
      chordObj ?? null,
    );
  }

  setLyrics(lyrics: string): ChordLyricsPair {
    return this.set({ lyrics });
  }

  setAnnotation(annotation: string): ChordLyricsPair {
    return this.set({ annotation });
  }

  transpose(
    delta: number,
    key: string | Key | null = null,
    { normalizeChordSuffix }: { normalizeChordSuffix: boolean } = { normalizeChordSuffix: false },
  ): ChordLyricsPair {
    return this.changeChord((chord: Chord) => {
      const transposedChord = chord.transpose(delta);

      if (key) {
        return transposedChord.normalize(key, { normalizeSuffix: normalizeChordSuffix });
      }

      return transposedChord;
    });
  }

  useAccidental(accidental: Accidental) {
    return this.changeChord((chord: Chord) => chord.useAccidental(accidental));
  }

  /**
   * @deprecated Use useAccidental instead
   */
  useModifier(accidental: Accidental) {
    deprecate('useModifier is deprecated, use useAccidental instead');
    return this.useAccidental(accidental);
  }

  changeChord(func: (chord: Chord) => Chord): ChordLyricsPair {
    const chordObj = Chord.parse(this.chords.trim());

    if (chordObj) {
      const changedChord = func(chordObj);
      return this.set({ chords: changedChord.toString(), chordObj: changedChord });
    }

    return this.clone();
  }
}

export default ChordLyricsPair;
