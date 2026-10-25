import ChordProParser from '../../src/parser/chord_pro_parser';
import HtmlDivFormatter from '../../src/formatter/html_div_formatter';
import PdfFormatter from '../../src/formatter/pdf_formatter';
import Song from '../../src/chord_sheet/song';
import StubbedPdfDoc from '../util/stubbed_pdf_doc';
import TextFormatter from '../../src/formatter/text_formatter';

import { heredoc } from '../util/utilities';

function parse(chordpro: string): Song {
  return new ChordProParser().parse(chordpro);
}

const song = parse(heredoc`
  {start_of_verse: Verse 1}
  [G]Verse one
  {end_of_verse}

  {start_of_chorus: Chorus}
  [C]Chorus
  {end_of_chorus}

  {chorus}`);

const songWithExcludedSection = parse(heredoc`
  {start_of_verse: Verse 1}
  [G]Verse one
  {end_of_verse}

  {start_of_chorus-guitar: Chorus}
  [C]Chorus line
  {end_of_chorus}`);

describe('song map entries', () => {
  describe('TextFormatter', () => {
    it('describes the song map it rendered', () => {
      const formatter = new TextFormatter({ renderOrder: 'mapped' });
      formatter.format(song);

      expect(formatter.songMapEntries.map(String)).toEqual(['V1', 'C1', 'C1']);
      expect(formatter.songMapEntries.map((entry) => entry.displayLabel)).toEqual(['Verse 1', 'Chorus', 'Chorus']);
    });

    it('describes the song map in the presentation it rendered', () => {
      const formatter = new TextFormatter({ renderOrder: 'mapped', repeatPresentation: 'condensed' });
      const output = formatter.format(song);

      expect(formatter.songMapEntries.map(String)).toEqual(['V1', 'C1 (2x)']);
      expect(formatter.songMapEntries.map((entry) => entry.displayLabel)).toEqual(['Verse 1', 'Chorus (2x)']);
      expect(output).toContain('Chorus (2x)');
    });

    it('describes no song map for source order rendering', () => {
      const formatter = new TextFormatter();
      formatter.format(song);

      expect(formatter.songMapEntries).toEqual([]);
    });

    it('marks an occurrence that the formatter configuration excludes', () => {
      const formatter = new TextFormatter({ renderOrder: 'mapped' });
      formatter.format(songWithExcludedSection);

      expect(formatter.songMapEntries.map((entry) => [entry.token, entry.omitted]))
        .toEqual([['V1', false], ['C1', true]]);
    });

    it('marks no omission when the section is rendered', () => {
      const formatter = new TextFormatter({ renderOrder: 'mapped', instrument: { type: 'guitar' } });
      formatter.format(songWithExcludedSection);

      expect(formatter.songMapEntries.map((entry) => entry.omitted)).toEqual([false, false]);
    });

    it('starts with the song map of the latest render', () => {
      const formatter = new TextFormatter({ renderOrder: 'mapped' });
      formatter.format(song);
      formatter.format(parse('{start_of_verse: Verse 1}\n[G]Verse one\n{end_of_verse}'));

      expect(formatter.songMapEntries.map(String)).toEqual(['V1']);
    });
  });

  describe('HtmlDivFormatter', () => {
    it('describes the song map it rendered', () => {
      const formatter = new HtmlDivFormatter({ renderOrder: 'mapped' });
      formatter.format(song);

      expect(formatter.songMapEntries.map(String)).toEqual(['V1', 'C1', 'C1']);
    });
  });

  describe('PdfFormatter', () => {
    it('describes the song map it rendered', () => {
      const formatter = new PdfFormatter({ renderOrder: 'mapped' });
      formatter.format(song, StubbedPdfDoc);

      expect(formatter.songMapEntries.map(String)).toEqual(['V1', 'C1', 'C1']);
    });
  });
});
