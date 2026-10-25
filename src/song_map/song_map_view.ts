import SongMapOccurrence from './song_map_occurrence';
import SongSection from './song_section';

import { RepeatPresentation } from './presentation';
import { isCondensed, occurrenceRuns, repeatLabel } from './repeat_grouping';

export interface SongMapViewEntryProperties {
  occurrences: SongMapOccurrence[];
  omitted: boolean;
}

export interface SongMapViewOptions {
  /** Whether to combine the adjacent occurrences of one section into one entry, `full` by default */
  repeatPresentation?: RepeatPresentation;

  /** The sections of which the renderer leaves the content out */
  omittedSections?: SongSection[];
}

/**
 * One item of a song map as it is presented. Full presentation presents one occurrence per entry, condensed
 * presentation combines the adjacent occurrences of one section into one entry.
 */
class SongMapViewEntry {
  /** The canonical occurrences that the entry presents, in performance order */
  occurrences: SongMapOccurrence[];

  /** Whether the renderer leaves the content of the section out, see {@link Formatter.songMapEntries} */
  omitted: boolean;

  constructor({ occurrences, omitted }: SongMapViewEntryProperties) {
    this.occurrences = occurrences;
    this.omitted = omitted;
  }

  /** The section that the entry presents */
  get section(): SongSection {
    return this.occurrences[0].section;
  }

  /** The section token, for example `C1` */
  get token(): string {
    return this.section.token;
  }

  /** The section type, for example `chorus`. See {@link Line.type} */
  get type(): string {
    return this.section.type;
  }

  /** How many times the entry is performed */
  get repeatCount(): number {
    return this.occurrences.length;
  }

  /** The source line that produced the first occurrence of the entry */
  get lineNumber(): number | null {
    return this.occurrences[0].lineNumber;
  }

  /** The label to display, with the repeat count when the entry presents more than one occurrence */
  get displayLabel(): string {
    if (this.repeatCount === 1) return this.section.displayLabel;

    return repeatLabel(this.section.displayLabel, this.repeatCount);
  }

  /** The section token, with the repeat count when the entry presents more than one occurrence */
  toString(): string {
    if (this.repeatCount === 1) return this.token;

    return `${this.token} (${this.repeatCount}x)`;
  }
}

/**
 * Builds the entries that present a performance order, in the order and the grouping in which a formatter
 * renders it. See {@link SongMap.view}.
 */
function songMapView(occurrences: SongMapOccurrence[], options: SongMapViewOptions = {}): SongMapViewEntry[] {
  const { repeatPresentation = 'full', omittedSections = [] } = options;

  return occurrenceRuns(occurrences).flatMap((run) => {
    const omitted = omittedSections.includes(run[0].section);

    if (isCondensed(run, repeatPresentation)) return [new SongMapViewEntry({ occurrences: run, omitted })];

    return run.map((occurrence) => new SongMapViewEntry({ occurrences: [occurrence], omitted }));
  });
}

export default SongMapViewEntry;
export { songMapView };
