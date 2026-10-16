import { ChordProParser } from '../../src';
import SectionSplitter from '../../src/song_map/section_splitter';
import { heredoc } from '../util/utilities';

function split(chordpro: string) {
  return SectionSplitter.split(new ChordProParser().parse(chordpro).lines);
}

describe('SectionSplitter', () => {
  describe('.split', () => {
    it('returns the section blocks, recalls and unattached lines in source order', () => {
      const entries = split(heredoc`
        {title: Song}

        {comment: Capo 2}

        {start_of_verse: Verse 1}
        [G]Verse one
        {end_of_verse}

        {chorus}`);

      expect(entries.map((entry) => entry.kind)).toEqual(['unattached', 'unattached', 'section', 'recall']);
    });

    it('keeps a section with a blank line in it as one block', () => {
      const entries = split(heredoc`
        {start_of_chorus: Chorus}
        [C]First half

        [C]Second half
        {end_of_chorus}`);

      expect(entries).toHaveLength(1);
      expect(entries[0].kind).toEqual('section');
    });

    it('starts a new block when the section type changes', () => {
      const entries = split(heredoc`
        [C]Loose line
        {start_of_verse: Verse 1}
        [G]Verse one
        {end_of_verse}`);

      expect(entries.map((entry) => entry.kind)).toEqual(['section', 'section']);
    });
  });
});
