// eslint-disable-next-line import/no-cycle
import { Song } from '../index';
import { parse } from './chord_pro_peg_parser';
import ChordSheetSerializer from '../chord_sheet_serializer';
import ParserWarning from './parser_warning';

/**
 * Parses a ChordPro chord sheet
 */
class ChordProParser {
  song?: Song;

  /**
   * Parses a ChordPro chord sheet into a song
   * @param {string} chordProChordSheet the ChordPro chord sheet
   * @returns {Song} The parsed song
   */
  parse(chordProChordSheet) {
    const ast = parse(chordProChordSheet);
    this.song = new ChordSheetSerializer().deserialize(ast);
    return this.song;
  }

  /**
   * All warnings raised during parsing the ChordPro chord sheet
   * @member
   * @type {ParserWarning[]}
   */
  get warnings(): ParserWarning[] {
    return this.song.warnings;
  }
}

export default ChordProParser;
