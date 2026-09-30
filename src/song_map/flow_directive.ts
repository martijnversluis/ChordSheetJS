import RepeatInstruction from './repeat_instruction';
import Song from '../chord_sheet/song';
import SongMap from './song_map';
import SongMapDiagnostic from './song_map_diagnostic';
import SongMapGenerator from './song_map_generator';
import SongMapOccurrence from './song_map_occurrence';
import SongSection from './song_section';
import Tag from '../chord_sheet/tag';

import { SongMapDiagnosticProperties } from './song_map_diagnostic';
import { SongMapOccurrenceOrigin } from './song_map_occurrence';

const FLOW = 'flow';

const UNSUPPORTED_ITEM = /^-{2,}$|^[^\s:]+\s*:/;

function normalize(text: string): string {
  return text.trim().replace(/\s+/g, ' ').toLowerCase();
}

function abbreviate(label: string): string {
  return normalize(label)
    .split(' ')
    .map((word) => word.slice(0, 1))
    .join('');
}

function splitItems(value: string): string[] {
  return (value.includes(',') ? value.split(',') : value.split(/\s+/))
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

const TRAILING_INSTRUCTION = /\(([^()]*)\)$/;

// A flow item is only read as a repeat instruction when it is marked as one, either by parentheses
// or by the word "repeat". A bare `x2` is a section reference, since tokens can look the same.
function splitReference(item: string): [string, RepeatInstruction | null] {
  const parenthesized = TRAILING_INSTRUCTION.exec(item);
  const marked = parenthesized || /^repeat\b/i.test(item);
  const instruction = marked ? RepeatInstruction.parse(parenthesized ? parenthesized[1] : item) : null;

  if (!instruction) return [item, null];

  return [parenthesized ? item.replace(parenthesized[0], '').trim() : '', instruction];
}

function findFlowTag(song: Song): Tag | null {
  const tags = song.lines
    .flatMap((line) => line.items)
    .filter((item): item is Tag => item instanceof Tag && item.name === FLOW);

  return tags[0] ?? null;
}

/**
 * Reads and writes the `{flow: ...}` directive, an OnSong extension that stores a performance order
 * in the chart itself. Both the shorthand (`V1 C V2 C`) and the comma separated longhand
 * (`Verse 1, Chorus`) are supported.
 */
class FlowDirective {
  /**
   * Reads the flow directive of a song and resolves it against the sections of the song
   * @returns {SongMap|null} the song map, or `null` when the song has no flow directive
   */
  static parse(song: Song): SongMap | null {
    const tag = findFlowTag(song);

    if (!tag) return null;

    return new FlowDirective(song, tag).parse();
  }

  /** Renders a song map as a flow directive @returns {string} */
  static format(songMap: SongMap): string {
    return `{${FLOW}: ${songMap}}`;
  }

  song: Song;

  private tag: Tag;

  private sections: SongSection[] = [];

  private occurrences: SongMapOccurrence[] = [];

  private diagnostics: SongMapDiagnostic[] = [];

  constructor(song: Song, tag: Tag) {
    this.song = song;
    this.tag = tag;
  }

  parse(): SongMap {
    const generated = SongMapGenerator.generate(this.song);
    const items = splitItems(this.tag.value ?? '');

    this.sections = generated.sections;

    if (items.length === 0) this.reportEmptyMap();
    items.forEach((item) => this.processItem(item));

    return new SongMap({
      sections: this.sections,
      occurrences: this.occurrences,
      diagnostics: [...generated.diagnostics, ...this.diagnostics],
    });
  }

  private processItem(item: string): void {
    const [reference, instruction] = splitReference(item);

    if (reference.length === 0) {
      this.applyRepeat(item, instruction);
      return;
    }

    if (UNSUPPORTED_ITEM.test(reference)) {
      this.reportUnsupportedItem(item);
      return;
    }

    const section = this.resolveSection(reference, item);

    if (section) this.addOccurrences(section, instruction);
  }

  private applyRepeat(item: string, instruction: RepeatInstruction | null): void {
    const previous = this.occurrences[this.occurrences.length - 1];

    if (!instruction || !previous) {
      this.reportAmbiguousRepeat(item);
      return;
    }

    if (!instruction.isFinite()) {
      this.reportInvalidRepeat(instruction);
      return;
    }

    this.repeat(previous.section, (instruction.count as number) - 1);
  }

  private addOccurrences(section: SongSection, instruction: RepeatInstruction | null): void {
    this.addOccurrence(section, 'flow');

    if (!instruction) return;

    if (!instruction.isFinite()) {
      this.reportInvalidRepeat(instruction);
      return;
    }

    this.repeat(section, (instruction.count as number) - 1);
  }

  private repeat(section: SongSection, times: number): void {
    Array.from({ length: Math.max(times, 0) }).forEach(() => this.addOccurrence(section, 'repeat'));
  }

  private resolveSection(reference: string, item: string): SongSection | null {
    const matches = this.matchingSections(reference);

    if (matches.length === 1) return matches[0];

    if (matches.length > 1) {
      this.reportAmbiguousReference(item, matches);
      return null;
    }

    this.reportInvalidReference(item);
    return null;
  }

  private matchingSections(reference: string): SongSection[] {
    const normalized = normalize(reference);

    const byToken = this.sections.filter((section) => normalize(section.token) === normalized);

    if (byToken.length > 0) return byToken;

    const byLabel = this.sections.filter((section) => normalize(section.displayLabel) === normalized);

    if (byLabel.length > 0) return byLabel;

    return this.sections.filter((section) => abbreviate(section.displayLabel) === normalized);
  }

  private addOccurrence(section: SongSection, origin: SongMapOccurrenceOrigin): void {
    this.occurrences.push(new SongMapOccurrence({
      section,
      index: this.occurrences.length,
      origin,
      lineNumber: this.tag.parentLine?.lineNumber ?? null,
    }));
  }

  private reportEmptyMap(): void {
    this.addDiagnostic({
      type: 'empty_map',
      message: 'The flow directive is empty, so the song map has no occurrences',
    });
  }

  private reportUnsupportedItem(item: string): void {
    this.addDiagnostic({
      type: 'unsupported_flow_item',
      message: `Flow item "${item}" is not a section reference and is not supported`,
    });
  }

  private reportInvalidReference(item: string): void {
    this.addDiagnostic({
      type: 'invalid_reference',
      message: `Flow item "${item}" does not refer to a section of this song`,
    });
  }

  private reportAmbiguousReference(item: string, matches: SongSection[]): void {
    this.addDiagnostic({
      type: 'ambiguous_reference',
      message: `Flow item "${item}" matches ${matches.map((section) => section.token).join(', ')}`,
    });
  }

  private reportAmbiguousRepeat(item: string): void {
    this.addDiagnostic({
      type: 'ambiguous_repeat',
      message: `Flow item "${item}" does not identify one occurrence to repeat`,
    });
  }

  private reportInvalidRepeat(instruction: RepeatInstruction): void {
    this.addDiagnostic({
      type: 'invalid_repeat',
      message: `Repeat instruction "${instruction.text}" does not describe a finite number of performances`,
    });
  }

  private addDiagnostic(properties: SongMapDiagnosticProperties): void {
    this.diagnostics.push(new SongMapDiagnostic({
      lineNumber: this.tag.parentLine?.lineNumber ?? null,
      ...properties,
    }));
  }
}

export default FlowDirective;
