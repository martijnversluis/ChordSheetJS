import { ChordProParser } from '../../src';
import FlowDirective from '../../src/song_map/flow_directive';
import Song from '../../src/chord_sheet/song';
import SongMap from '../../src/song_map/song_map';
import { heredoc } from '../util/utilities';

function parse(chordpro: string): Song {
  return new ChordProParser().parse(chordpro);
}

const sections = heredoc`
  {start_of_verse: Verse 1}
  [G]Verse one
  {end_of_verse}

  {start_of_chorus: Chorus}
  [C]Chorus
  {end_of_chorus}

  {start_of_verse: Verse 2}
  [G]Verse two
  {end_of_verse}`;

function songWithFlow(flow: string): Song {
  return parse(`{flow: ${flow}}\n\n${sections}`);
}

function flowMap(flow: string): SongMap {
  return FlowDirective.parse(songWithFlow(flow)) as SongMap;
}

describe('FlowDirective', () => {
  describe('.parse', () => {
    it('returns null when the song has no flow directive', () => {
      expect(FlowDirective.parse(parse(sections))).toBeNull();
    });

    it('follows the order of the flow directive', () => {
      const songMap = flowMap('C1 V1 C1 V2 C1');

      expect(songMap.toString()).toEqual('C1 V1 C1 V2 C1');
      expect(songMap.occurrences.map((occurrence) => occurrence.origin)).toEqual(Array(5).fill('flow'));
      expect(songMap.diagnostics).toEqual([]);
    });

    it('keeps all sections available, also when the flow does not use them', () => {
      const songMap = flowMap('C1');

      expect(songMap.sections.map((section) => section.token)).toEqual(['V1', 'C1', 'V2']);
      expect(songMap.toString()).toEqual('C1');
    });

    it('accepts tokens in any case', () => {
      expect(flowMap('v1 c1').toString()).toEqual('V1 C1');
    });

    it('accepts comma separated section labels', () => {
      expect(flowMap('Verse 1, Chorus, Verse 2, Chorus').toString()).toEqual('V1 C1 V2 C1');
    });

    it('accepts OnSong style label abbreviations', () => {
      expect(flowMap('V1 C V2 C').toString()).toEqual('V1 C1 V2 C1');
    });

    it('repeats the previous occurrence for a repeat item', () => {
      expect(flowMap('V1, Chorus, (Repeat 2x)').toString()).toEqual('V1 C1 C1');
    });

    it('reports a reference that does not resolve to a section', () => {
      const songMap = flowMap('V1 X9 C1');
      const [diagnostic] = songMap.diagnostics;

      expect(songMap.toString()).toEqual('V1 C1');
      expect(diagnostic.type).toEqual('invalid_reference');
      expect(diagnostic.message).toContain('X9');
    });

    it('does not choose a section for an ambiguous abbreviation', () => {
      const song = parse(heredoc`
        {flow: C}

        {start_of_chorus: Chorus}
        [C]Chorus
        {end_of_chorus}

        {start_of_bridge: Coda}
        [C]Coda
        {end_of_bridge}`);

      const songMap = FlowDirective.parse(song) as SongMap;

      expect(songMap.occurrences).toEqual([]);
      expect(songMap.diagnostics.map((diagnostic) => diagnostic.type)).toEqual(['ambiguous_reference']);
    });

    it('reports an unsupported flow item', () => {
      const songMap = flowMap('V1, ----, Transpose: 2, C1');

      expect(songMap.toString()).toEqual('V1 C1');
      expect(songMap.diagnostics.map((diagnostic) => diagnostic.type))
        .toEqual(['unsupported_flow_item', 'unsupported_flow_item']);
    });

    it('reports an empty flow directive', () => {
      const songMap = flowMap('');

      expect(songMap.occurrences).toEqual([]);
      expect(songMap.isEmpty()).toBe(true);
      expect(songMap.diagnostics.map((diagnostic) => diagnostic.type)).toEqual(['empty_map']);
    });

    it('reports a repeat item without a preceding occurrence', () => {
      const songMap = flowMap('(2x), V1');

      expect(songMap.toString()).toEqual('V1');
      expect(songMap.diagnostics.map((diagnostic) => diagnostic.type)).toEqual(['ambiguous_repeat']);
    });

    it('keeps the diagnostics of the generated sections', () => {
      const song = parse(heredoc`
        {flow: VA1}

        {start_of_part: Vamp}
        [A]Vamp
        {end_of_part}`);

      const songMap = FlowDirective.parse(song) as SongMap;

      expect(songMap.toString()).toEqual('VA1');
      expect(songMap.diagnostics.map((diagnostic) => diagnostic.type)).toEqual(['inferred_token']);
    });

    it('does not change the song', () => {
      const song = songWithFlow('C1 V1');
      const lineCount = song.lines.length;

      FlowDirective.parse(song);

      expect(song.lines).toHaveLength(lineCount);
    });
  });

  describe('.format', () => {
    it('renders a song map as a flow directive', () => {
      const songMap = flowMap('C1 V1 C1');

      expect(FlowDirective.format(songMap)).toEqual('{flow: C1 V1 C1}');
    });
  });
});
