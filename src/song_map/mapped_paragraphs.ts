import Line from '../chord_sheet/line';
import Paragraph from '../chord_sheet/paragraph';
import Song from '../chord_sheet/song';
import SongMap from './song_map';
import SongSection from './song_section';
import resolveSongMap from './resolve_song_map';

function paragraphOf(lines: Line[]): Paragraph {
  const paragraph = new Paragraph();
  lines.filter((line) => line.hasRenderableItems()).forEach((line) => paragraph.addLine(line));

  return paragraph;
}

/**
 * Builds the paragraphs that a song map describes: one paragraph per occurrence, in performance order.
 * Content that is not part of a section travels along with the section that follows it in the chart.
 */
class MappedParagraphs {
  static for(song: Song): Paragraph[] {
    return new MappedParagraphs(song, resolveSongMap(song)).build();
  }

  private song: Song;

  private songMap: SongMap;

  private attachments = new Map<SongSection, Line[][]>();

  private trailing: Line[][] = [];

  private pending: Line[][] = [];

  constructor(song: Song, songMap: SongMap) {
    this.song = song;
    this.songMap = songMap;
  }

  build(): Paragraph[] {
    this.collectUnmappedLines();

    const placed = new Set<SongSection>();

    const paragraphs = this.songMap.occurrences.flatMap(({ section }) => {
      const leading = placed.has(section) ? [] : this.attachmentsFor(section);
      placed.add(section);

      return [...leading, paragraphOf(section.lines)];
    });

    return [...paragraphs, ...this.trailing.map(paragraphOf)].filter((paragraph) => !paragraph.isEmpty());
  }

  private attachmentsFor(section: SongSection): Paragraph[] {
    return (this.attachments.get(section) ?? []).map(paragraphOf);
  }

  private collectUnmappedLines(): void {
    const sections = this.sectionsByLine();

    this.song.lines.forEach((line) => {
      const section = sections.get(line);

      if (section) {
        this.attachPending(section);
      } else if (line.hasRenderableItems()) {
        this.addToPending(line);
      } else {
        this.pending.push([]);
      }
    });

    this.trailing = this.pending.filter((lines) => lines.length > 0);
  }

  private addToPending(line: Line): void {
    const group = this.pending[this.pending.length - 1];

    if (group) {
      group.push(line);
    } else {
      this.pending.push([line]);
    }
  }

  private attachPending(section: SongSection): void {
    const groups = this.pending.filter((lines) => lines.length > 0);
    this.pending = [];

    if (groups.length === 0) return;

    this.attachments.set(section, [...(this.attachments.get(section) ?? []), ...groups]);
  }

  private sectionsByLine(): Map<Line, SongSection> {
    const sections = new Map<Line, SongSection>();

    this.songMap.sections.forEach((section) => {
      section.lines.forEach((line) => sections.set(line, section));
    });

    return sections;
  }
}

export default MappedParagraphs;
