import SongSection from './song_section';

export type SongMapOccurrenceOrigin = 'source' | 'recall';

export interface SongMapOccurrenceProperties {
  section: SongSection;
  index: number;
  origin: SongMapOccurrenceOrigin;
  lineNumber?: number | null;
}

/**
 * One appearance of a {@link SongSection} in the performance order of a {@link SongMap}
 */
class SongMapOccurrence {
  /** The section that is performed */
  section: SongSection;

  /** The 0-based position of the occurrence in the song map */
  index: number;

  /** Whether the occurrence comes from section content or from a recall directive */
  origin: SongMapOccurrenceOrigin;

  /** The source line that produced the occurrence */
  lineNumber: number | null;

  constructor({
    section, index, origin, lineNumber = null,
  }: SongMapOccurrenceProperties) {
    this.section = section;
    this.index = index;
    this.origin = origin;
    this.lineNumber = lineNumber;
  }

  get token(): string {
    return this.section.token;
  }
}

export default SongMapOccurrence;
