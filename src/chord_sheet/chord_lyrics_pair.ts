import Chord from '../chord';
import Key from '../key';
import type Line from './line';

import { Accidental } from '../constants';
import { deprecate } from '../utilities';
import { CHORD_LYRICS_PAIR_BRAND, brandPrototype, hasBrand } from './object_brand';
import {
  ChordLineTokenClassification,
  ChordLineTokenKind,
  ChordLineTokenVariant,
  chordLineStyleRole,
  isChordTokenKind,
  resolveChordLineTokenClassification,
} from './chord_line_token';

interface ChordLyricsPairChanges {
  chords?: string,
  lyrics?: string,
  annotation?: string,
  chordObj?: Chord | null,
  isRhythmSymbol?: boolean,
  classification?: ChordLineTokenClassification,
}

/**
 * Represents a chord with the corresponding (partial) lyrics
 */
class ChordLyricsPair {
  static [Symbol.hasInstance](instance: unknown): boolean {
    return hasBrand(instance, CHORD_LYRICS_PAIR_BRAND);
  }

  chords: string;

  lyrics: string | null;

  annotation: string | null;

  /** @deprecated Use tokenKind instead. */
  isRhythmSymbol: boolean;

  readonly classification: ChordLineTokenClassification;

  get tokenKind(): ChordLineTokenKind {
    return this.classification.kind;
  }

  get tokenVariant(): ChordLineTokenVariant {
    return this.classification.variant;
  }

  parentLine: Line | null = null;

  private _chordObj: Chord | null = null;

  /**
   * Initialises a ChordLyricsPair
   * @param {string} chords The chords
   * @param {string | null} lyrics The lyrics
   * @param {string | null} annotation The annotation
   * @param {Chord | null} chordObj Optional pre-parsed Chord object
   * @param {boolean} isRhythmSymbol Whether this pair represents a rhythm symbol
   */
  constructor(
    chords = '',
    lyrics: string | null = null,
    annotation: string | null = null,
    chordObj: Chord | null = null,
    isRhythmSymbol = false,
    classification?: ChordLineTokenClassification,
  ) {
    this.chords = chords || '';
    this.lyrics = lyrics || '';
    this.annotation = annotation || '';
    const resolvedClassification = resolveChordLineTokenClassification(
      this.chords,
      this.annotation,
      isRhythmSymbol,
      classification,
    );
    this.classification = Object.freeze(resolvedClassification);
    this._chordObj = isChordTokenKind(this.tokenKind) ? chordObj : null;
    this.isRhythmSymbol = this.tokenKind === 'rhythm-symbol';
  }

  /** Returns the Chord object if available, otherwise parses from string */
  get chord(): Chord | null {
    if (!isChordTokenKind(this.tokenKind)) {
      return null;
    }

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
    const chordObj = this._chordObj?.clone() || null;
    return new ChordLyricsPair(
      this.chords,
      this.lyrics,
      this.annotation,
      chordObj,
      this.isRhythmSymbol,
      this.classification,
    );
  }

  toString(): string {
    return `ChordLyricsPair(chords=${this.chords}, lyrics=${this.lyrics})`;
  }

  set(
    {
      chords, lyrics, annotation, chordObj, isRhythmSymbol, classification,
    }: ChordLyricsPairChanges,
  ): ChordLyricsPair {
    const tokenContentChanged = chords !== undefined || annotation !== undefined || isRhythmSymbol !== undefined;
    const nextIsRhythmSymbol = isRhythmSymbol ?? (chords === undefined ? this.isRhythmSymbol : false);
    return new ChordLyricsPair(
      chords ?? this.chords,
      lyrics ?? this.lyrics,
      annotation ?? this.annotation,
      chordObj ?? null,
      nextIsRhythmSymbol,
      classification ?? (tokenContentChanged ? undefined : this.classification),
    );
  }

  get styleRole() {
    return chordLineStyleRole(this.tokenKind, this.chords, this.tokenVariant);
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
    const chordObj = this.chord;

    if (chordObj) {
      const changedChord = func(chordObj);
      return this.set({ chords: changedChord.toString(), chordObj: changedChord });
    }

    return this.clone();
  }
}

brandPrototype(ChordLyricsPair.prototype, CHORD_LYRICS_PAIR_BRAND);

export default ChordLyricsPair;
