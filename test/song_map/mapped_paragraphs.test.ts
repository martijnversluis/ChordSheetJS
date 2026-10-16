import { ChordProParser } from '../../src';
import Song from '../../src/chord_sheet/song';
import { heredoc } from '../util/utilities';

function parse(chordpro: string): Song {
  return new ChordProParser().parse(chordpro);
}

function labels(song: Song): (string | null)[] {
  return song.mappedBodyParagraphs.map((paragraph) => paragraph.label);
}

describe('Song', () => {
  describe('#mappedBodyParagraphs', () => {
    it('returns one paragraph per occurrence in song map order', () => {
      const song = parse(heredoc`
        {start_of_verse: Verse 1}
        [G]Verse one
        {end_of_verse}

        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}

        {start_of_verse: Verse 2}
        [G]Verse two
        {end_of_verse}

        {chorus}`);

      expect(labels(song)).toEqual(['Verse 1', 'Chorus', 'Verse 2', 'Chorus']);
    });

    it('includes the lines of a recalled chorus', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus}
        [C]Chorus line
        {end_of_chorus}

        {chorus}`);

      const [source, recalled] = song.mappedBodyParagraphs;

      expect(recalled.type).toEqual('chorus');
      expect(recalled.lines).toEqual(source.lines);
    });

    it('repeats a section as often as its repeat instruction says', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus (2x)}
        [C]Chorus line
        {end_of_chorus}`);

      expect(labels(song)).toEqual(['Chorus (2x)', 'Chorus (2x)']);
    });

    it('follows the flow directive when the song has one', () => {
      const song = parse(heredoc`
        {flow: C1 V1 C1}

        {start_of_verse: Verse 1}
        [G]Verse one
        {end_of_verse}

        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}`);

      expect(labels(song)).toEqual(['Chorus', 'Verse 1', 'Chorus']);
    });

    it('leaves out a section that the flow directive does not mention', () => {
      const song = parse(heredoc`
        {flow: C1}

        {start_of_verse: Verse 1}
        [G]Verse one
        {end_of_verse}

        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}`);

      expect(labels(song)).toEqual(['Chorus']);
    });

    it('keeps paragraphs that are not part of a section', () => {
      const song = parse(heredoc`
        {start_of_verse: Verse 1}
        [G]Verse one
        {end_of_verse}

        [C]Loose line

        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}`);

      expect(labels(song)).toEqual(['Verse 1', null, 'Chorus']);
    });

    it('moves a comment that is not part of a section along with the section that follows it', () => {
      const song = parse(heredoc`
        {flow: C1 V1}

        {comment: Softly}

        {start_of_verse: Verse 1}
        [G]Verse one
        {end_of_verse}

        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}`);

      expect(labels(song)).toEqual(['Chorus', null, 'Verse 1']);
      expect(song.mappedBodyParagraphs[1].lines[0].items[0]).toHaveProperty('value', 'Softly');
    });

    it('keeps a trailing comment at the end', () => {
      const song = parse(heredoc`
        {start_of_verse: Verse 1}
        [G]Verse one
        {end_of_verse}

        {comment: Fade out}`);

      expect(labels(song)).toEqual(['Verse 1', null]);
      expect(song.mappedBodyParagraphs[1].lines[0].items[0]).toHaveProperty('value', 'Fade out');
    });

    it('returns no paragraphs for a song without sections', () => {
      const song = parse('{title: Only metadata}');

      expect(song.mappedBodyParagraphs).toEqual([]);
    });
  });
});
