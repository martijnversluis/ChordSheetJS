import Configuration from '../formatter/configuration';
import Song from '../chord_sheet/song';
import SongSection from './song_section';

function isExcluded(song: Song, section: SongSection, configuration: Configuration): boolean {
  const paragraphs = song.linesToParagraphs(section.lines).filter((paragraph) => !paragraph.isEmpty());

  if (paragraphs.length === 0) return false;

  return song.filterParagraphs(paragraphs, configuration).length === 0;
}

/**
 * Returns the sections of which the formatter configuration excludes the content, for example because a
 * section selector does not match the configured instrument.
 */
function excludedSections(song: Song, configuration: Configuration): SongSection[] {
  return song.songMap.sections.filter((section) => isExcluded(song, section, configuration));
}

export default excludedSections;
