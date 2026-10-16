import ChordProParser from '../../src/parser/chord_pro_parser';
import ChordsOverWordsFormatter from '../../src/formatter/chords_over_words_formatter';
import HtmlDivFormatter from '../../src/formatter/html_div_formatter';
import Song from '../../src/chord_sheet/song';
import TextFormatter from '../../src/formatter/text_formatter';
import { heredoc } from '../util/utilities';

function parse(chordpro: string): Song {
  return new ChordProParser().parse(chordpro);
}

const songWithInvalidFlow = parse(heredoc`
  {flow: C1 Z9}

  {start_of_verse: Verse 1}
  [G]Verse one
  {end_of_verse}

  {start_of_chorus: Chorus}
  [C]Chorus line
  {end_of_chorus}`);

const songWithExcludedSection = parse(heredoc`
  {start_of_verse: Verse 1}
  [G]Verse one
  {end_of_verse}

  {start_of_chorus-guitar: Chorus}
  [C]Chorus line
  {end_of_chorus}`);

describe('render diagnostics', () => {
  describe('TextFormatter', () => {
    it('reports the diagnostics of the song map it rendered', () => {
      const formatter = new TextFormatter({ renderOrder: 'mapped' });
      formatter.format(songWithInvalidFlow);

      expect(formatter.diagnostics.map((diagnostic) => [diagnostic.type, diagnostic.message])).toEqual([
        ['invalid_reference', 'Flow item "Z9" does not refer to a section of this song'],
      ]);
    });

    it('reports no diagnostics for source order rendering', () => {
      const formatter = new TextFormatter();
      formatter.format(songWithInvalidFlow);

      expect(formatter.diagnostics).toEqual([]);
    });

    it('reports an occurrence that the formatter configuration excludes', () => {
      const formatter = new TextFormatter({ renderOrder: 'mapped' });
      formatter.format(songWithExcludedSection);

      expect(formatter.diagnostics.map((diagnostic) => [diagnostic.type, diagnostic.sectionToken])).toEqual([
        ['omitted_occurrence', 'C1'],
      ]);
    });

    it('reports no omission when the section is rendered', () => {
      const formatter = new TextFormatter({ renderOrder: 'mapped', instrument: { type: 'guitar' } });
      formatter.format(songWithExcludedSection);

      expect(formatter.diagnostics).toEqual([]);
    });

    it('starts with the diagnostics of the latest render', () => {
      const formatter = new TextFormatter({ renderOrder: 'mapped' });
      formatter.format(songWithInvalidFlow);
      formatter.format(parse('{start_of_verse: Verse 1}\n[G]Verse one\n{end_of_verse}'));

      expect(formatter.diagnostics).toEqual([]);
    });
  });

  describe('HtmlDivFormatter', () => {
    it('reports the diagnostics of the song map it rendered', () => {
      const formatter = new HtmlDivFormatter({ renderOrder: 'mapped' });
      formatter.format(songWithInvalidFlow);

      expect(formatter.diagnostics.map((diagnostic) => diagnostic.type)).toEqual(['invalid_reference']);
    });
  });

  describe('ChordsOverWordsFormatter', () => {
    it('reports the diagnostics of the song map it rendered', () => {
      const formatter = new ChordsOverWordsFormatter({ renderOrder: 'mapped' });
      formatter.format(songWithInvalidFlow);

      expect(formatter.diagnostics.map((diagnostic) => diagnostic.type)).toEqual(['invalid_reference']);
    });
  });
});
