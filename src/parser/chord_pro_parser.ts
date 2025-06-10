import ChordSheetSerializer from '../chord_sheet_serializer';
import NullTracer from './null_tracer';
import ParserWarning from './parser_warning';
import Song from '../chord_sheet/song';

import { normalizeLineEndings } from '../utilities';
import { ParseOptions, parse } from './chord_pro/peg_parser';

export type ChordProParserOptions = ParseOptions & {
  softLineBreaks?: boolean;
  chopFirstWord?: boolean;
};

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
   * @param {ChordProParserOptions} options Parser options.
   * @param {ChordProParserOptions.softLineBreaks} options.softLineBreaks=false If true, a backslash
   * followed by * a space is treated as a soft line break
   * @param {ChordProParserOptions.chopFirstWord} options.chopFirstWord=true If true, only the first lyric
   * word is paired with the chord, the rest of the lyric is put in a separate chord lyric pair
   * @see https://peggyjs.org/documentation.html#using-the-parser
   * @returns {Song} The parsed song
   */
  parse(chordSheet: string, options?: ChordProParserOptions): Song {
    const ast = parse(
      normalizeLineEndings(chordSheet),
      { tracer: new NullTracer(), ...options },
    );

    this.song = new ChordSheetSerializer().deserialize(ast);
    return this.song;
  }
}

export default ChordProParser;
