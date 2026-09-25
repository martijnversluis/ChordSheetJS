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

    it('returns an empty map for a chart without recognized sections', () => {
      const song = parse(heredoc`
        {title: Song}
        [G]Just a line`);

      const songMap = SongMapGenerator.generate(song);

      expect(songMap.occurrences).toEqual([]);
      expect(songMap.toString()).toEqual('');
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
