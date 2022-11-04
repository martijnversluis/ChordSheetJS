// eslint-disable-next-line import/no-cycle
import { Song } from '../index';
import ChordSheetSerializer from '../chord_sheet_serializer';
import ParserWarning from './parser_warning';

interface IParseOptions {
  filename?: string;
  startRule?: string;
  tracer?: any;
  [key: string]: any;
}
export type ParseFunction = (_input: string, _options?: IParseOptions) => any;

/**
 * Parses a chords over words sheet
 */
class PegBasedParser {
  song: Song = new Song();

  /**
   * All warnings raised during parsing the chord sheet
   * @member
   * @type {ParserWarning[]}
   */
  get warnings(): ParserWarning[] {
    return this.song.warnings;
  }

  protected parseWithParser(chordSheet: string, parser: ParseFunction): Song {
    const ast = parser(chordSheet);
    this.song = new ChordSheetSerializer().deserialize(ast);
    return this.song;
  }
}

export default PegBasedParser;
