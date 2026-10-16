import SongSection from './song_section';

export type SongMapOccurrenceOrigin = 'source' | 'recall' | 'repeat' | 'flow';

export interface SongMapOccurrenceProperties {
  section: SongSection;
  origin: SongMapOccurrenceOrigin;
  lineNumber?: number | null;
}

/**
 * One appearance of a {@link SongSection} in the performance order of a {@link SongMap}
 */
class SongMapOccurrence {
  /** The section that is performed */
  section: SongSection;

  /** Whether the occurrence comes from section content, a recall, a repeat instruction or a flow directive */
  origin: SongMapOccurrenceOrigin;

  /** The source line that produced the occurrence */
  lineNumber: number | null;

  constructor({ section, origin, lineNumber = null }: SongMapOccurrenceProperties) {
    this.section = section;
    this.origin = origin;
    this.lineNumber = lineNumber;
  }

  get token(): string {
    return this.section.token;
  }
}

export default SongMapOccurrence;
