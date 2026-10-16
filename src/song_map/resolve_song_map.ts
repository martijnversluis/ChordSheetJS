import FlowDirective from './flow_directive';
import Song from '../chord_sheet/song';
import SongMap from './song_map';
import SongMapGenerator from './song_map_generator';

/**
 * Returns the song map of a song: the map that its `{flow}` directive describes, or else the map that
 * {@link SongMapGenerator} derives from the chart.
 */
function resolveSongMap(song: Song): SongMap {
  return FlowDirective.parse(song) ?? SongMapGenerator.generate(song);
}

export default resolveSongMap;
