import { parse, ParseOptions } from './chord_pro/peg_parser';
import Song from '../chord_sheet/song';
import ParserWarning from './parser_warning';
import { normalizeLineEndings } from '../utilities';
import ChordSheetSerializer from '../chord_sheet_serializer';
import { SerializedSong } from '../serialized_types';
import NullTracer from './null_tracer';

export type ChordProParserOptions = ParseOptions & {
  softLineBreaks?: boolean;
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
   * @see https://peggyjs.org/documentation.html#using-the-parser
   * @returns {Song} The parsed song
   */
  parse(chordSheet: string, options?: ChordProParserOptions): Song {
    const ast = parse(
      normalizeLineEndings(chordSheet),
      { tracer: new NullTracer(), ...options },
    ) as SerializedSong;

    this.song = new ChordSheetSerializer().deserialize(ast);
    return this.song;
  }
}

export default ChordProParser;
