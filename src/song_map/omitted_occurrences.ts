import Configuration from '../formatter/configuration';
import Song from '../chord_sheet/song';
import SongMapDiagnostic from './song_map_diagnostic';
import SongSection from './song_section';

function isExcluded(song: Song, section: SongSection, configuration: Configuration): boolean {
  const paragraphs = song.linesToParagraphs(section.lines).filter((paragraph) => !paragraph.isEmpty());

  if (paragraphs.length === 0) return false;

  return song.filterParagraphs(paragraphs, configuration).length === 0;
}

/**
 * Reports every occurrence of the song map of which the formatter configuration excludes the content, for
 * example because a section selector does not match the configured instrument. Mapped rendering leaves those
 * occurrences out instead of redirecting them to another section.
 */
function omittedOccurrences(song: Song, configuration: Configuration): SongMapDiagnostic[] {
  const excluded = song.songMap.sections.filter((section) => isExcluded(song, section, configuration));

  return song.songMap.occurrences
    .filter((occurrence) => excluded.includes(occurrence.section))
    .map((occurrence) => new SongMapDiagnostic({
      type: 'omitted_occurrence',
      message: `Section "${occurrence.section.displayLabel}" is excluded by the formatter configuration`,
      lineNumber: occurrence.lineNumber,
      sectionToken: occurrence.token,
    }));
}

export default omittedOccurrences;
