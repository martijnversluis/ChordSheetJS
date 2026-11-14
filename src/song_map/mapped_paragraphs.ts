import Line from '../chord_sheet/line';
import Paragraph from '../chord_sheet/paragraph';
import Song from '../chord_sheet/song';
import SongMap from './song_map';
import SongMapOccurrence from './song_map_occurrence';
import SongSection from './song_section';
import Tag from '../chord_sheet/tag';

import { RepeatPresentation } from './presentation';
import { isCondensed, occurrenceRuns, repeatLabel } from './repeat_grouping';

/** Returns the section lines with the repeat count in the label of the section delimiter */
function withRepeatLabel(section: SongSection, count: number): Line[] {
  return section.lines.map((line) => {
    const clone = line.clone();

    clone.items = clone.items.map((item) => (
      item instanceof Tag && item.isSectionStart() ? item.setAttribute('label', repeatLabel(item.label, count)) : item
    ));

    return clone;
  });
}

/** One block of source lines that a section was read from, by its position in the chart */
interface SourceBlock {
  section: SongSection;
  index: number;
}

/**
 * Builds the paragraphs that a song map describes: one paragraph per occurrence, in performance order.
 * Content that is not part of a section travels along with the next section that the map performs.
 */
class MappedParagraphs {
  static for(song: Song, presentation: RepeatPresentation = 'full'): Paragraph[] {
    return new MappedParagraphs(song, song.songMap, presentation).build();
  }

  private song: Song;

  private songMap: SongMap;

  private presentation: RepeatPresentation;

  private attachments = new Map<SongSection, Line[][]>();

  private rendered = new Map<SongSection, number>();

  private unattached: Line[] = [];

  constructor(song: Song, songMap: SongMap, presentation: RepeatPresentation) {
    this.song = song;
    this.songMap = songMap;
    this.presentation = presentation;
  }

  build(): Paragraph[] {
    this.collectUnmappedLines();

    const paragraphs = occurrenceRuns(this.songMap.occurrences).flatMap((run) => this.paragraphsForRun(run));

    return [...paragraphs, ...this.paragraphsOf(this.unattached)];
  }

  /**
   * The paragraphs of one run of occurrences. The content that travels along with a performance joins its
   * lines, so content that the chart does not separate by a blank line keeps sharing its paragraph, just like
   * in source order. A condensed run renders one section, which carries the content of every performance it
   * combines.
   */
  private paragraphsForRun(run: SongMapOccurrence[]): Paragraph[] {
    const { section } = run[0];
    const performed = this.rendered.get(section) ?? 0;
    this.rendered.set(section, performed + run.length);

    if (isCondensed(run, this.presentation)) {
      return this.paragraphsOf([
        ...this.attachmentsFor(section, performed, run.length),
        ...withRepeatLabel(section, run.length),
      ]);
    }

    return run.flatMap((_occurrence, index) => this.paragraphsOf([
      ...this.attachmentsFor(section, performed + index, 1),
      ...section.lines,
    ]));
  }

  /** The content that travels along with `count` performances of a section, from `from` in performance order */
  private attachmentsFor(section: SongSection, from: number, count: number): Line[] {
    const performances = this.attachments.get(section) ?? [];

    return Array.from({ length: count }, (_value, offset) => performances[from + offset] ?? []).flat();
  }

  /** Builds the paragraphs for a set of lines the same way the source order pipeline does */
  private paragraphsOf(lines: Line[]): Paragraph[] {
    return this.song.linesToParagraphs(lines).filter((paragraph) => !paragraph.isEmpty());
  }

  /**
   * Collects the lines that are not part of a section and attaches them to the block they precede, so they
   * travel along with the performance that renders that block. Lines that no performed block follows stay
   * unattached and are rendered last.
   */
  private collectUnmappedLines(): void {
    const blocks = this.blocksByLine();
    const performed = new Set(this.songMap.occurrences.map((occurrence) => occurrence.section));
    let pending: Line[] = [];

    this.song.lines.forEach((line) => {
      const block = blocks.get(line);

      if (block && performed.has(block.section)) {
        this.attach(block, pending);
        pending = [];
      } else if (!block && (line.hasRenderableItems() || line.isEmpty())) {
        pending.push(line);
      }
    });

    this.unattached = pending;
  }

  private attach({ section, index }: SourceBlock, lines: Line[]): void {
    if (lines.length === 0) return;

    const attachments = this.attachments.get(section) ?? [];
    attachments[index] = [...(attachments[index] ?? []), ...lines];
    this.attachments.set(section, attachments);
  }

  /** Maps every source line of a section to the block it belongs to */
  private blocksByLine(): Map<Line, SourceBlock> {
    const blocks = new Map<Line, SourceBlock>();

    this.songMap.sections.forEach((section) => {
      section.sourceBlocks.forEach((lines, index) => {
        lines.forEach((line) => blocks.set(line, { section, index }));
      });
    });

    return blocks;
  }
}

export default MappedParagraphs;
