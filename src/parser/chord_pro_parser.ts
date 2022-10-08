import PegBasedParser from './peg_based_parser';
import { parse } from './chord_pro_peg_parser';

/**
 * Parses a ChordPro chord sheet
 */
class ChordProParser extends PegBasedParser {
  /**
   * Parses a ChordPro chord sheet into a song
   * @param {string} chordProChordSheet the ChordPro chord sheet
   * @returns {Song} The parsed song
   */
  parse(chordProChordSheet) {
    return this.parseWithParser(chordProChordSheet, parse);
  }
}

export default ChordProParser;
