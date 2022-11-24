import PegBasedParser from './peg_based_parser';
import { parse } from './chords_over_words_peg_parser';
import Song from '../chord_sheet/song';

/**
 * Parses a chords over words sheet into a song
 *
 * It support "regular" chord sheets:
 *
 *            Am         C/G        F          C
 *     Let it be, let it be, let it be, let it be
 *     C                G              F  C/E Dm C
 *     Whisper words of wisdom, let it be
 *
 * Additionally, some chordpro features have been "ported back". For example, you can use chordpro directives:
 *
 *     {title: Let it be}
 *     {key: C}
 *     Chorus 1:
 *            Am
 *     Let it be
 *
 * For convenience, you can leave out the brackets:
 *
 *     title: Let it be
 *     Chorus 1:
 *            Am
 *     Let it be
 *
 * You can even use a markdown style frontmatter separator to separate the header from the song:
 *
 *     title: Let it be
 *     key: C
 *     ---
 *     Chorus 1:
 *            Am         C/G        F          C
 *     Let it be, let it be, let it be, let it be
 *     C                G              F  C/E Dm C
 *     Whisper words of wisdom, let it be
 *
 * `ChordsOverWordsParser` is the better version of `ChordSheetParser`, which is deprecated.
 */
class ChordsOverWordsParser extends PegBasedParser {
  /**
   * Parses a chords over words sheet into a song
   * @param {string} chordsOverWordsSheet the chords over words sheet
   * @returns {Song} The parsed song
   */
  parse(chordsOverWordsSheet: string): Song {
    return this.parseWithParser(chordsOverWordsSheet, parse);
  }
}

export default ChordsOverWordsParser;
