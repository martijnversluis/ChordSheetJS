import Song from '../chord_sheet/song';
import PegBasedParser from './peg_based_parser';
import { parse } from './chords_over_words_peg_parser';

/**
 * Parses a chords over words sheet
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
