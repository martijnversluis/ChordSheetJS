import SongMapDiagnostic from './song_map_diagnostic';
import SongMapOccurrence from './song_map_occurrence';
import SongSection from './song_section';

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

  isEmpty(): boolean {
    return this.occurrences.length === 0;
  }

  /** The section tokens as one space separated string, for example `V1 C1 V2 C1` */
  toString(): string {
    return this.tokens.join(' ');
  }
}

export default SongMap;
