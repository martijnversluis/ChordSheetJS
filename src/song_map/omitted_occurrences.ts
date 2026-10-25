import SongMap from './song_map';
import SongMapDiagnostic from './song_map_diagnostic';
import SongSection from './song_section';

/**
 * Reports every occurrence of the song map of which the renderer leaves the content out, see
 * {@link excludedSections}. Mapped rendering leaves those occurrences out instead of redirecting them to
 * another section.
 */
function omittedOccurrences(songMap: SongMap, excluded: SongSection[]): SongMapDiagnostic[] {
  return songMap.occurrences
    .filter((occurrence) => excluded.includes(occurrence.section))
    .map((occurrence) => new SongMapDiagnostic({
      type: 'omitted_occurrence',
      message: `Section "${occurrence.section.displayLabel}" is excluded by the formatter configuration`,
      lineNumber: occurrence.lineNumber,
      sectionToken: occurrence.token,
    }));
}

export default omittedOccurrences;
