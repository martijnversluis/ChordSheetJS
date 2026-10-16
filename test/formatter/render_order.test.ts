import ChordProParser from '../../src/parser/chord_pro_parser';
import ChordsOverWordsFormatter from '../../src/formatter/chords_over_words_formatter';
import HtmlDivFormatter from '../../src/formatter/html_div_formatter';
import Song from '../../src/chord_sheet/song';
import TextFormatter from '../../src/formatter/text_formatter';
import { heredoc } from '../util/utilities';

function parse(chordpro: string): Song {
  return new ChordProParser().parse(chordpro);
}

const song = parse(heredoc`
  {flow: C1 V1 C1}

  {start_of_verse: Verse 1}
  [G]Verse one
  {end_of_verse}

  {start_of_chorus: Chorus}
  [C]Chorus line
  {end_of_chorus}`);

describe('renderOrder', () => {
  describe('TextFormatter', () => {
    it('renders the sections in source order by default', () => {
      expect(new TextFormatter().format(song)).toEqual(heredoc`
        Verse 1
        G
        Verse one

        Chorus
        C
        Chorus line`);
    });

    it('renders the sections in song map order when set to mapped', () => {
      expect(new TextFormatter({ renderOrder: 'mapped' }).format(song)).toEqual(heredoc`
        Chorus
        C
        Chorus line

        Verse 1
        G
        Verse one

        Chorus
        C
        Chorus line`);
    });
  });

  describe('a section with a blank line in it', () => {
    const splitSong = parse(heredoc`
      {start_of_chorus: Chorus}
      [C]First half

      [C]Second half
      {end_of_chorus}`);

    it('renders the same in mapped order as in source order', () => {
      expect(new TextFormatter({ renderOrder: 'mapped' }).format(splitSong))
        .toEqual(new TextFormatter().format(splitSong));
    });
  });

  describe('HtmlDivFormatter', () => {
    it('renders the sections in song map order when set to mapped', () => {
      const output = new HtmlDivFormatter({ renderOrder: 'mapped' }).format(song);
      const labels = [...output.matchAll(/class="label">([^<]+)</g)].map(([, label]) => label);

      expect(labels).toEqual(['Chorus', 'Verse 1', 'Chorus']);
    });
  });

  describe('ChordsOverWordsFormatter', () => {
    it('renders the sections in song map order when set to mapped', () => {
      const output = new ChordsOverWordsFormatter({ renderOrder: 'mapped' }).format(song);

      expect(output.match(/Chorus line/g)).toHaveLength(2);
      expect(output.indexOf('Verse one')).toBeGreaterThan(output.indexOf('Chorus line'));
    });
  });
});
