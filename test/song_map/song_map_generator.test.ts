import { ChordProParser } from '../../src';
import Song from '../../src/chord_sheet/song';
import SongMapGenerator from '../../src/song_map/song_map_generator';
import { heredoc } from '../util/utilities';

function parse(chordpro: string): Song {
  return new ChordProParser().parse(chordpro);
}

describe('SongMapGenerator', () => {
  describe('.generate', () => {
    it('generates a map with one occurrence per section in source order', () => {
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

      const songMap = SongMapGenerator.generate(song);

      expect(songMap.toString()).toEqual('V1 C1 V2 C1');
      expect(songMap.sections.map((section) => section.token)).toEqual(['V1', 'C1', 'V2']);
      expect(songMap.diagnostics).toEqual([]);
    });

    it('keeps every occurrence distinguishable', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}

        {chorus}`);

      const songMap = SongMapGenerator.generate(song);
      const [first, second] = songMap.occurrences;

      expect(songMap.occurrences).toHaveLength(2);
      expect(first.index).toEqual(0);
      expect(second.index).toEqual(1);
      expect(first.origin).toEqual('source');
      expect(second.origin).toEqual('recall');
      expect(first.section).toBe(second.section);
    });

    it('keeps a section with a blank line in it as one section', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus}
        [C]First half

        [C]Second half
        {end_of_chorus}`);

      const songMap = SongMapGenerator.generate(song);

      expect(songMap.toString()).toEqual('C1');
      expect(songMap.sections).toHaveLength(1);
    });

    it('keeps a section without an end tag as one section', () => {
      const song = parse(heredoc`
        {start_of_verse: Verse 1}
        [G]First half

        [G]Second half`);

      const songMap = SongMapGenerator.generate(song);

      expect(songMap.toString()).toEqual('V1');
    });

    it('reuses a section for an exactly equal repeated block', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}

        {start_of_verse: Verse}
        [G]Verse
        {end_of_verse}

        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}`);

      const songMap = SongMapGenerator.generate(song);

      expect(songMap.toString()).toEqual('C1 V1 C1');
      expect(songMap.sections).toHaveLength(2);
      expect(songMap.diagnostics).toEqual([]);
    });

    it('does not merge equally labelled sections with different content', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus}
        [C]Chorus one
        {end_of_chorus}

        {start_of_verse: Verse}
        [G]Verse
        {end_of_verse}

        {start_of_chorus: Chorus}
        [C]Chorus two
        {end_of_chorus}`);

      const songMap = SongMapGenerator.generate(song);

      expect(songMap.toString()).toEqual('C1 V1 C2');
      expect(songMap.diagnostics.map((diagnostic) => diagnostic.type)).toEqual(['ambiguous_label']);
    });

    it('infers tokens for sections without a label', () => {
      const song = parse(heredoc`
        {start_of_bridge}
        [D]Bridge
        {end_of_bridge}`);

      const [section] = SongMapGenerator.generate(song).sections;

      expect(section.token).toEqual('B1');
      expect(section.label).toBeNull();
      expect(section.displayLabel).toEqual('Bridge 1');
    });

    it('preserves the original label', () => {
      const song = parse(heredoc`
        {start_of_part: Pre-Chorus}
        [F]Pre chorus
        {end_of_part}`);

      const [section] = SongMapGenerator.generate(song).sections;

      expect(section.token).toEqual('PC1');
      expect(section.label).toEqual('Pre-Chorus');
      expect(section.displayLabel).toEqual('Pre-Chorus');
    });

    it('returns a deterministic fallback token for an unknown section type', () => {
      const song = parse(heredoc`
        {start_of_part: Vamp}
        [A]Vamp
        {end_of_part}`);

      const songMap = SongMapGenerator.generate(song);

      expect(songMap.toString()).toEqual('VA1');
      expect(songMap.diagnostics.map((diagnostic) => diagnostic.type)).toEqual(['inferred_token']);
    });

    it('does not let a fallback token claim a reserved section token', () => {
      const song = parse(heredoc`
        {start_of_part: Vamp}
        [A]Vamp
        {end_of_part}

        {start_of_verse: Verse 1}
        [G]Verse one
        {end_of_verse}`);

      const songMap = SongMapGenerator.generate(song);

      expect(songMap.sections.map((section) => section.token)).toEqual(['VA1', 'V1']);
    });

    it('reports a conflict between an explicit ordinal and the label ordinal', () => {
      const song = parse(heredoc`
        {start_of_verse: Verse 2}
        [G]Verse two
        {end_of_verse}`);

      const songMap = SongMapGenerator.generate(song);
      const [diagnostic] = songMap.diagnostics;

      expect(songMap.toString()).toEqual('V1');
      expect(diagnostic.type).toEqual('ordinal_conflict');
      expect(diagnostic.sectionToken).toEqual('V1');
    });

    it('reports an ordinal conflict for a label with a repeat instruction', () => {
      const song = parse(heredoc`
        {start_of_verse: Verse 2 (2x)}
        [G]Verse two
        {end_of_verse}`);

      const songMap = SongMapGenerator.generate(song);

      expect(songMap.toString()).toEqual('V1 V1');
      expect(songMap.diagnostics.map((diagnostic) => diagnostic.type)).toEqual(['ordinal_conflict']);
    });

    it('resolves a chorus recall to the nearest preceding chorus', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus}
        [C]Chorus A
        {end_of_chorus}

        {start_of_chorus: Alternate}
        [C]Chorus B
        {end_of_chorus}

        {start_of_chorus: Chorus}
        [C]Chorus A
        {end_of_chorus}

        {chorus}`);

      const songMap = SongMapGenerator.generate(song);

      expect(songMap.toString()).toEqual('C1 C2 C1 C1');
    });

    it('reports a chorus recall without a resolvable target', () => {
      const song = parse(heredoc`
        {chorus}

        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}`);

      const songMap = SongMapGenerator.generate(song);
      const [diagnostic] = songMap.diagnostics;

      expect(songMap.toString()).toEqual('C1');
      expect(diagnostic.type).toEqual('missing_recall_target');
      expect(diagnostic.lineNumber).toEqual(0);
    });

    it('returns an empty map for a chart without content', () => {
      const song = parse(heredoc`
        {title: Song}
        {artist: Artist}`);

      const songMap = SongMapGenerator.generate(song);

      expect(songMap.occurrences).toEqual([]);
      expect(songMap.toString()).toEqual('');
    });

    it('includes paragraphs that are not part of a section', () => {
      const song = parse(heredoc`
        {title: Song}
        [A]Intro line

        {start_of_verse: Verse 1}
        [G]Verse one
        {end_of_verse}

        [D]Outro line`);

      const songMap = SongMapGenerator.generate(song);
      const [section] = songMap.sections;

      expect(songMap.toString()).toEqual('S1 V1 S2');
      expect(section.displayLabel).toEqual('Section 1');
      expect(songMap.diagnostics.map((diagnostic) => diagnostic.type)).toEqual(['inferred_token', 'inferred_token']);
    });

    it('reuses a section for an equal paragraph that is not part of a section', () => {
      const song = parse(heredoc`
        [A]Tag line

        {start_of_verse: Verse 1}
        [G]Verse one
        {end_of_verse}

        [A]Tag line`);

      expect(SongMapGenerator.generate(song).toString()).toEqual('S1 V1 S1');
    });

    it('separates paragraphs that are not part of a section', () => {
      const song = parse(heredoc`
        [A]Intro line

        [D]Outro line`);

      expect(SongMapGenerator.generate(song).toString()).toEqual('S1 S2');
    });

    it('keeps a comment inside a paragraph that is not part of a section', () => {
      const song = parse(heredoc`
        [A]Intro line
        {comment: Softly}
        [A]Second line`);

      expect(SongMapGenerator.generate(song).toString()).toEqual('S1');
    });

    it('includes a paragraph that only contains an image', () => {
      const song = parse(heredoc`
        {start_of_verse: Verse 1}
        [G]Verse one
        {end_of_verse}

        {image: diagram.png}`);

      expect(SongMapGenerator.generate(song).toString()).toEqual('V1 S1');
    });

    it('explains an inferred token for a paragraph without a section', () => {
      const song = parse('[A]Intro line');
      const [diagnostic] = SongMapGenerator.generate(song).diagnostics;

      expect(diagnostic.type).toEqual('inferred_token');
      expect(diagnostic.message).toEqual('Paragraph is not part of a section, inferred token S1');
    });

    it('does not turn a comment into a section', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}

        {comment: Softly}

        [D]Outro line`);

      const songMap = SongMapGenerator.generate(song);

      expect(songMap.toString()).toEqual('C1 S1');
    });

    it('expands a repeat instruction in a section label into explicit occurrences', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus (2x)}
        [C]Chorus
        {end_of_chorus}`);

      const songMap = SongMapGenerator.generate(song);
      const [section] = songMap.sections;

      expect(songMap.toString()).toEqual('C1 C1');
      expect(songMap.occurrences.map((occurrence) => occurrence.origin)).toEqual(['source', 'repeat']);
      expect(songMap.occurrences.map((occurrence) => occurrence.index)).toEqual([0, 1]);
      expect(section.label).toEqual('Chorus (2x)');
      expect(songMap.diagnostics).toEqual([]);
    });

    it('expands a repeat instruction in a comment within a section', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus}
        [C]Chorus
        {comment: Repeat 2 times}
        {end_of_chorus}`);

      const songMap = SongMapGenerator.generate(song);

      expect(songMap.toString()).toEqual('C1 C1');
      expect(songMap.diagnostics).toEqual([]);
    });

    it('ignores the repeat instruction when identifying a section', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}

        {start_of_verse: Verse 1}
        [G]Verse
        {end_of_verse}

        {start_of_chorus: Chorus (2x)}
        [C]Chorus
        {end_of_chorus}`);

      const songMap = SongMapGenerator.generate(song);

      expect(songMap.toString()).toEqual('C1 V1 C1 C1');
      expect(songMap.sections).toHaveLength(2);
      expect(songMap.diagnostics).toEqual([]);
    });

    it('does not repeat a section for an invalid repeat value', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus (0x)}
        [C]Chorus
        {end_of_chorus}`);

      const songMap = SongMapGenerator.generate(song);
      const [diagnostic] = songMap.diagnostics;

      expect(songMap.toString()).toEqual('C1');
      expect(diagnostic.type).toEqual('invalid_repeat');
      expect(diagnostic.sectionToken).toEqual('C1');
    });

    it('does not repeat a section for an unbounded repeat instruction', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus}
        [C]Chorus
        {comment: Repeat until cue}
        {end_of_chorus}`);

      const songMap = SongMapGenerator.generate(song);

      expect(songMap.toString()).toEqual('C1');
      expect(songMap.diagnostics.map((diagnostic) => diagnostic.type)).toEqual(['invalid_repeat']);
    });

    it('does not repeat a section for conflicting repeat instructions', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus (2x)}
        [C]Chorus
        {comment: 3x}
        {end_of_chorus}`);

      const songMap = SongMapGenerator.generate(song);
      const [diagnostic] = songMap.diagnostics;

      expect(songMap.toString()).toEqual('C1');
      expect(diagnostic.type).toEqual('ambiguous_repeat');
      expect(diagnostic.sectionToken).toEqual('C1');
    });

    it('reports a repeat instruction that does not identify one occurrence', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}

        {comment: 2x}`);

      const songMap = SongMapGenerator.generate(song);
      const [diagnostic] = songMap.diagnostics;

      expect(songMap.toString()).toEqual('C1');
      expect(diagnostic.type).toEqual('ambiguous_repeat');
      expect(diagnostic.lineNumber).toEqual(4);
    });

    it('does not change the song', () => {
      const song = parse(heredoc`
        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}

        {chorus}`);

      const lineCount = song.lines.length;
      SongMapGenerator.generate(song);

      expect(song.lines).toHaveLength(lineCount);
    });
  });
});
