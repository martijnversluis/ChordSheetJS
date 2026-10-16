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

    it('keeps a blank line inside a section as a paragraph break', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus}
        [C]First half

        [C]Second half
        {end_of_chorus}`);

      expect(labels(song)).toEqual(['Chorus', null]);
      expect(song.mappedBodyParagraphs.map((paragraph) => paragraph.lines.length)).toEqual([2, 1]);
    });

    it('moves a comment forward to the next section that the map performs', () => {
      const song = parse(heredoc`
        {flow: C1}

        {comment: Capo 2}

        {start_of_verse: Verse 1}
        [G]Verse one
        {end_of_verse}

        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}`);

      expect(labels(song)).toEqual([null, 'Chorus']);
      expect(song.mappedBodyParagraphs[0].lines[0].items[0]).toHaveProperty('value', 'Capo 2');
    });

    it('keeps a comment that no performed section follows at the end', () => {
      const song = parse(heredoc`
        {flow: C1}

        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}

        {comment: Fade out}

        {start_of_verse: Verse 1}
        [G]Verse one
        {end_of_verse}`);

      expect(labels(song)).toEqual(['Chorus', null]);
      expect(song.mappedBodyParagraphs[1].lines[0].items[0]).toHaveProperty('value', 'Fade out');
    });

    it('returns no paragraphs for a song without sections', () => {
      const song = parse('{title: Only metadata}');

      expect(song.mappedBodyParagraphs).toEqual([]);
    });
  });

  describe('#songMap', () => {
    it('returns the map that the flow directive describes', () => {
      const song = parse(heredoc`
        {flow: C1 V1}

        {start_of_verse: Verse 1}
        [G]Verse one
        {end_of_verse}

        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}`);

      expect(song.songMap.toString()).toEqual('C1 V1');
    });

    it('returns the generated map when the song has no flow directive', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}

        {chorus}`);

      expect(song.songMap.toString()).toEqual('C1 C1');
    });
  });

  describe('#mappedBodyParagraphsFor', () => {
    function condensedLabels(song: Song): (string | null)[] {
      return song.mappedBodyParagraphsFor('condensed').map((paragraph) => paragraph.label);
    }

    it('renders adjacent occurrences of one section once with a repeat label', () => {
      const song = parse(heredoc`
        {flow: V1 C1 C1}

        {start_of_verse: Verse 1}
        [G]Verse one
        {end_of_verse}

        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}`);

      expect(condensedLabels(song)).toEqual(['Verse 1', 'Chorus (2x)']);
    });

    it('keeps non-adjacent occurrences of one section at their map positions', () => {
      const song = parse(heredoc`
        {flow: C1 V1 C1}

        {start_of_verse: Verse 1}
        [G]Verse one
        {end_of_verse}

        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}`);

      expect(condensedLabels(song)).toEqual(['Chorus', 'Verse 1', 'Chorus']);
    });

    it('replaces the repeat instruction in the label instead of adding a second one', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus (2x)}
        [C]Chorus
        {end_of_chorus}`);

      expect(condensedLabels(song)).toEqual(['Chorus (2x)']);
    });

    it('counts every adjacent occurrence', () => {
      const song = parse(heredoc`
        {flow: C1 C1 C1}

        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}`);

      expect(condensedLabels(song)).toEqual(['Chorus (3x)']);
    });

    it('labels a section that has no label with the repeat count', () => {
      const song = parse(heredoc`
        {flow: C1 C1}

        {start_of_chorus}
        [C]Chorus
        {end_of_chorus}`);

      expect(condensedLabels(song)).toEqual(['(2x)']);
    });

    it('does not change the source chart', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus (2x)}
        [C]Chorus
        {end_of_chorus}`);

      condensedLabels(song);

      expect(song.bodyParagraphs.map((paragraph) => paragraph.label)).toEqual(['Chorus (2x)']);
      expect(song.mappedBodyParagraphs.map((paragraph) => paragraph.label)).toEqual(['Chorus (2x)', 'Chorus (2x)']);
    });

    it('keeps the occurrences of a section without a section delimiter in full', () => {
      const song = parse(heredoc`
        {flow: S1 S1}

        [C]Loose line`);

      expect(condensedLabels(song)).toEqual([null, null]);
    });

    it('renders every occurrence in full by default', () => {
      const song = parse(heredoc`
        {flow: C1 C1}

        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}`);

      expect(song.mappedBodyParagraphsFor().map((paragraph) => paragraph.label)).toEqual(['Chorus', 'Chorus']);
    });
  });
});
