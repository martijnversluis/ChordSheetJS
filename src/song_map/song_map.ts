import SongMapDiagnostic from './song_map_diagnostic';
import SongMapOccurrence from './song_map_occurrence';
import SongMapViewEntry from './song_map_view';
import SongSection from './song_section';

import { SongMapViewOptions, songMapView } from './song_map_view';

export interface SongMapProperties {
  sections: SongSection[];
  occurrences: SongMapOccurrence[];
  diagnostics: SongMapDiagnostic[];
}

/**
 * The ordered list of section occurrences that describes how a song is performed
 */
class SongMap {
  /** The sections that the occurrences refer to, in order of first appearance */
  sections: SongSection[];

  /** The performance order, one occurrence per performed section */
  occurrences: SongMapOccurrence[];

  /** Issues that were encountered while generating the map */
  diagnostics: SongMapDiagnostic[];

  constructor({ sections, occurrences, diagnostics }: SongMapProperties) {
    this.sections = sections;
    this.occurrences = occurrences;
    this.diagnostics = diagnostics;
  }

  /** The section token for every occurrence, for example `['V1', 'C1', 'V2', 'C1']` */
  get tokens(): string[] {
    return this.occurrences.map((occurrence) => occurrence.token);
  }

  /**
   * The occurrences as they are presented, in the order and the grouping in which a formatter renders them.
   * Use this to render a song map next to the chart. See {@link Formatter.songMapEntries} for the entries of
   * a render.
   * @param {SongMapViewOptions} [options={}] options
   * @param {'full'|'condensed'} [options.repeatPresentation='full'] whether to combine the adjacent
   * occurrences of one section into one entry
   * @param {SongSection[]} [options.omittedSections=[]] the sections of which the renderer leaves the content
   * out
   * @returns {SongMapViewEntry[]}
   */
  view(options: SongMapViewOptions = {}): SongMapViewEntry[] {
    return songMapView(this.occurrences, options);
  }

  isEmpty(): boolean {
    return this.occurrences.length === 0;
  }

  /** The section tokens as one space separated string, for example `V1 C1 V2 C1` */
  toString(): string {
    return this.tokens.join(' ');
  }
}

export default SongMap;
