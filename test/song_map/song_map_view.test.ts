import { ChordProParser } from '../../src';
import Song from '../../src/chord_sheet/song';
import { heredoc } from '../util/utilities';

function parse(chordpro: string): Song {
  return new ChordProParser().parse(chordpro);
}

const songWithRecalls = parse(heredoc`
  {start_of_verse: Verse 1}
  [G]Verse one
  {end_of_verse}

  {start_of_chorus: Chorus}
  [C]Chorus
  {end_of_chorus}

  {chorus}
  {chorus}`);

describe('SongMap', () => {
  describe('#view', () => {
    it('returns one entry per occurrence', () => {
      const entries = songWithRecalls.songMap.view();

      expect(entries.map((entry) => entry.token)).toEqual(['V1', 'C1', 'C1', 'C1']);
      expect(entries.map((entry) => entry.repeatCount)).toEqual([1, 1, 1, 1]);
    });

    it('describes the section of every entry', () => {
      const [verse] = songWithRecalls.songMap.view();

      expect(verse.section).toBe(songWithRecalls.songMap.sections[0]);
      expect(verse.type).toEqual('verse');
      expect(verse.displayLabel).toEqual('Verse 1');
      expect(verse.lineNumber).toEqual(0);
      expect(verse.omitted).toBe(false);
      expect(verse.toString()).toEqual('V1');
    });

    it('refers to the canonical occurrences of every entry', () => {
      const entries = songWithRecalls.songMap.view();

      expect(entries.flatMap((entry) => entry.occurrences)).toEqual(songWithRecalls.songMap.occurrences);
      expect(entries.map((entry) => entry.occurrences[0].origin)).toEqual(['source', 'source', 'recall', 'recall']);
    });

    it('combines adjacent occurrences of one section in condensed presentation', () => {
      const entries = songWithRecalls.songMap.view({ repeatPresentation: 'condensed' });

      expect(entries.map((entry) => entry.token)).toEqual(['V1', 'C1']);
      expect(entries.map((entry) => entry.repeatCount)).toEqual([1, 3]);
      expect(entries.map((entry) => entry.displayLabel)).toEqual(['Verse 1', 'Chorus (3x)']);
      expect(entries.map(String)).toEqual(['V1', 'C1 (3x)']);
    });

    it('keeps every canonical occurrence identifiable in condensed presentation', () => {
      const [, chorus] = songWithRecalls.songMap.view({ repeatPresentation: 'condensed' });

      expect(chorus.occurrences).toEqual(songWithRecalls.songMap.occurrences.slice(1));
    });

    it('keeps non adjacent occurrences of one section separate', () => {
      const song = parse(heredoc`
        {flow: V1 C1 V1 C1}

        {start_of_verse: Verse 1}
        [G]Verse one
        {end_of_verse}

        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}`);

      const entries = song.songMap.view({ repeatPresentation: 'condensed' });

      expect(entries.map((entry) => entry.token)).toEqual(['V1', 'C1', 'V1', 'C1']);
    });

    it('keeps a section without a delimiter expanded in condensed presentation', () => {
      const song = parse(heredoc`
        {flow: S1 S1}

        [G]Loose line`);

      const entries = song.songMap.view({ repeatPresentation: 'condensed' });

      expect(entries.map((entry) => entry.token)).toEqual(['S1', 'S1']);
      expect(entries.map((entry) => entry.displayLabel)).toEqual(['Section 1', 'Section 1']);
    });

    it('marks the entries of a section that the renderer leaves out', () => {
      const { songMap } = songWithRecalls;
      const entries = songMap.view({ omittedSections: [songMap.sections[1]] });

      expect(entries.map((entry) => entry.omitted)).toEqual([false, true, true, true]);
    });
  });
});
