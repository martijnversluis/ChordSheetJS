import { parse, ParseOptions } from './chord_pro_peg_parser';
import Song from '../chord_sheet/song';
import ParserWarning from './parser_warning';
import { normalizeLineEndings } from '../utilities';
import ChordSheetSerializer from '../chord_sheet_serializer';

/**
 * Parses a ChordPro chord sheet
 */
class ChordProParser {
  song?: Song;

  /**
   * All warnings raised during parsing the chord sheet
   * @member
   * @type {ParserWarning[]}
   */
  get warnings(): ParserWarning[] {
    return this.song?.warnings || [];
  }

  /**
   * Parses a ChordPro chord sheet into a song
   * @param {string} chordSheet the ChordPro chord sheet
   * @returns {Song} The parsed song
   */
  parse(chordSheet: string, options?: ParseOptions): Song {
    const ast = parse(normalizeLineEndings(chordSheet), options);
    this.song = new ChordSheetSerializer().deserialize(ast);
    return this.song;
  }
}

export default ChordProParser;
