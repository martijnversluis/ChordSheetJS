import ChordProParser from '../../src/parser/chord_pro_parser';
import HtmlDivFormatter from '../../src/formatter/html_div_formatter';
import Song from '../../src/chord_sheet/song';
import TextFormatter from '../../src/formatter/text_formatter';
import { heredoc } from '../util/utilities';

function parse(chordpro: string): Song {
  return new ChordProParser().parse(chordpro);
}

const song = parse(heredoc`
  {flow: V1 C1 C1}

  {start_of_verse: Verse 1}
  [G]Verse one
  {end_of_verse}

  {start_of_chorus: Chorus}
  [C]Chorus line
  {end_of_chorus}`);

describe('repeatPresentation', () => {
  describe('TextFormatter', () => {
    it('renders every occurrence in full by default', () => {
      expect(new TextFormatter({ renderOrder: 'mapped' }).format(song)).toEqual(heredoc`
        Verse 1
        G
        Verse one

        Chorus
        C
        Chorus line

        Chorus
        C
        Chorus line`);
    });

    it('renders adjacent occurrences once with a repeat label when condensed', () => {
      const formatter = new TextFormatter({ renderOrder: 'mapped', repeatPresentation: 'condensed' });

      expect(formatter.format(song)).toEqual(heredoc`
        Verse 1
        G
        Verse one

        Chorus (2x)
        C
        Chorus line`);
    });

    it('has no effect on source order rendering', () => {
      const formatter = new TextFormatter({ repeatPresentation: 'condensed' });

      expect(formatter.format(song)).toEqual(new TextFormatter().format(song));
    });
  });

  describe('HtmlDivFormatter', () => {
    it('renders adjacent occurrences once with a repeat label when condensed', () => {
      const formatter = new HtmlDivFormatter({ renderOrder: 'mapped', repeatPresentation: 'condensed' });
      const output = formatter.format(song);
      const labels = [...output.matchAll(/class="label">([^<]+)</g)].map(([, label]) => label);

      expect(labels).toEqual(['Verse 1', 'Chorus (2x)']);
    });
  });
});
