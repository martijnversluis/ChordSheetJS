import Line from '../chord_sheet/line';
import Paragraph from '../chord_sheet/paragraph';
import RepeatInstruction from './repeat_instruction';
import Song from '../chord_sheet/song';
import SongMap from './song_map';
import SongMapOccurrence from './song_map_occurrence';
import SongSection from './song_section';
import Tag from '../chord_sheet/tag';
import resolveSongMap from './resolve_song_map';

import { RepeatPresentation } from '../formatter/configuration/base_configuration';

function paragraphOf(lines: Line[]): Paragraph {
  const paragraph = new Paragraph();
  lines.filter((line) => line.hasRenderableItems()).forEach((line) => paragraph.addLine(line));

  return paragraph;
}

function occurrenceRuns(occurrences: SongMapOccurrence[]): SongMapOccurrence[][] {
  return occurrences.reduce((runs: SongMapOccurrence[][], occurrence) => {
    const current = runs[runs.length - 1];

    if (current && current[0].section === occurrence.section) {
      current.push(occurrence);
    } else {
      runs.push([occurrence]);
    }

    return runs;
  }, []);
}

function repeatLabel(label: string, count: number): string {
  return [RepeatInstruction.strip(label), `(${count}x)`].filter((part) => part.length > 0).join(' ');
}

/**
 * Returns the section lines with the repeat count in the label of the section delimiter, or `null` when the
 * section has no delimiter to carry the repeat count.
 */
function withRepeatLabel(section: SongSection, count: number): Line[] | null {
  const lines = section.lines.map((line) => line.clone());
  const line = lines.find((candidate) => candidate.items.some((item) => item instanceof Tag && item.isSectionStart()));

  if (!line) return null;

  line.items = line.items.map((item) => (
    item instanceof Tag && item.isSectionStart() ? item.setAttribute('label', repeatLabel(item.label, count)) : item
  ));

  return lines;
}

/**
 * Builds the paragraphs that a song map describes: one paragraph per occurrence, in performance order.
 * Content that is not part of a section travels along with the section that follows it in the chart.
 */
class MappedParagraphs {
  static for(song: Song, presentation: RepeatPresentation = 'full'): Paragraph[] {
    return new MappedParagraphs(song, resolveSongMap(song), presentation).build();
  }

  private song: Song;

  private songMap: SongMap;

  private presentation: RepeatPresentation;

  private attachments = new Map<SongSection, Line[][]>();

  private placed = new Set<SongSection>();

  private trailing: Line[][] = [];

  private pending: Line[][] = [];

  constructor(song: Song, songMap: SongMap, presentation: RepeatPresentation) {
    this.song = song;
    this.songMap = songMap;
    this.presentation = presentation;
  }

  build(): Paragraph[] {
    this.collectUnmappedLines();

    const paragraphs = occurrenceRuns(this.songMap.occurrences).flatMap((run) => this.paragraphsForRun(run));

    return [...paragraphs, ...this.trailing.map(paragraphOf)].filter((paragraph) => !paragraph.isEmpty());
  }

  private paragraphsForRun(run: SongMapOccurrence[]): Paragraph[] {
    const { section } = run[0];
    const leading = this.placed.has(section) ? [] : this.attachmentsFor(section);
    this.placed.add(section);

    return [...leading, ...this.sectionParagraphs(section, run.length)];
  }

  private sectionParagraphs(section: SongSection, count: number): Paragraph[] {
    const condensed = count > 1 && this.presentation === 'condensed' ? withRepeatLabel(section, count) : null;

    if (condensed) return [paragraphOf(condensed)];

    return Array.from({ length: count }, () => paragraphOf(section.lines));
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
