import ChordProFormatter from '../formatter/chord_pro_formatter';
import Line from '../chord_sheet/line';
import Paragraph from '../chord_sheet/paragraph';
import RepeatInstruction from './repeat_instruction';
import SectionSplitter from './section_splitter';
import SectionTokenizer from './section_tokenizer';
import Song from '../chord_sheet/song';
import SongMap from './song_map';
import SongMapDiagnostic from './song_map_diagnostic';
import SongMapOccurrence from './song_map_occurrence';
import SongSection from './song_section';
import Tag from '../chord_sheet/tag';

import { SectionSplitEntry } from './section_splitter';
import { SongMapDiagnosticProperties } from './song_map_diagnostic';
import { SongMapOccurrenceOrigin } from './song_map_occurrence';
import { CHORUS, NONE } from '../constants';

interface SectionEntry {
  section: SongSection;
  fingerprint: string;
  normalizedLabel: string;
}

interface SectionBlock {
  type: string;
  label: string | null;
  lines: Line[];
  fingerprint: string;
  normalizedLabel: string;
}

function normalizeLabel(label: string | null): string {
  return (label ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * Generates a {@link SongMap} from a linear chart. Paragraphs that are not part of a section become
 * anonymous sections. Generation does not change the song.
 */
class SongMapGenerator {
  static generate(song: Song): SongMap {
    return new SongMapGenerator(song).generate();
  }

  song: Song;

  private entries: SectionEntry[] = [];

  private occurrences: SongMapOccurrence[] = [];

  private diagnostics: SongMapDiagnostic[] = [];

  private tokenizer = new SectionTokenizer();

  private formatter = new ChordProFormatter();

  private lastSections: Record<string, SongSection> = {};

  constructor(song: Song) {
    this.song = song;
  }

  generate(): SongMap {
    SectionSplitter.split(this.song.lines).forEach((entry) => this.process(entry));

    return new SongMap({
      sections: this.entries.map((entry) => entry.section),
      occurrences: this.occurrences,
      diagnostics: this.diagnostics,
    });
  }

  private process(entry: SectionSplitEntry): void {
    if (entry.kind === 'recall') {
      this.addRecall(entry.line);
    } else if (entry.kind === 'unattached') {
      this.reportUnattachedRepeat(entry.line);
    } else {
      this.addSection(entry.lines);
    }
  }

  private addSection(lines: Line[]): void {
    const block = this.readBlock(lines);
    const section = this.resolveSection(block);
    const count = this.repeatCount(block, section);

    this.lastSections[section.type] = section;
    this.addOccurrence(section, 'source', lines[0].lineNumber);
    Array.from({ length: count - 1 }).forEach(() => this.addOccurrence(section, 'repeat', lines[0].lineNumber));
  }

  private readBlock(lines: Line[]): SectionBlock {
    const label = this.labelFor(lines);

    return {
      type: lines[0].type,
      label,
      lines,
      fingerprint: this.fingerprint(lines),
      normalizedLabel: normalizeLabel(RepeatInstruction.strip(label ?? '')),
    };
  }

  private repeatCount(block: SectionBlock, section: SongSection): number {
    const instructions = this.repeatInstructions(block);

    if (instructions.length === 0) return 1;

    const unbounded = instructions.find((instruction) => !instruction.isFinite());

    if (unbounded) return this.reportInvalidRepeat(unbounded, block, section);

    const counts = [...new Set(instructions.map((instruction) => instruction.count))]
      .filter((count): count is number => count !== null);

    if (counts.length > 1) return this.reportAmbiguousRepeat(instructions, block, section);

    return counts[0];
  }

  private repeatInstructions({ label, lines }: SectionBlock): RepeatInstruction[] {
    return [label ?? '', ...this.commentsIn(lines)]
      .map((text) => RepeatInstruction.parse(text))
      .filter((instruction): instruction is RepeatInstruction => instruction !== null);
  }

  private commentsIn(lines: Line[]): string[] {
    return lines.flatMap((line) => (
      line.items
        .filter((item) => item instanceof Tag && item.isComment())
        .map((item) => (item as Tag).value ?? '')
    ));
  }

  private resolveSection(block: SectionBlock): SongSection {
    const { type, normalizedLabel, fingerprint } = block;

    const identical = this.entries.find((entry) => (
      entry.section.type === type && entry.normalizedLabel === normalizedLabel && entry.fingerprint === fingerprint
    ));

    if (identical) {
      identical.section.addSourceBlock(block.lines);
      return identical.section;
    }

    this.reportLabelConflict(block);
    return this.createSection(block);
  }

  private createSection({
    type, label, lines, fingerprint, normalizedLabel,
  }: SectionBlock): SongSection {
    const { prefix, inferred } = this.tokenizer.prefixFor(type);
    const ordinal = this.entries.filter((entry) => entry.section.type === type).length + 1;

    const section = new SongSection({
      type, label, ordinal, token: `${prefix}${ordinal}`, lines,
    });

    this.entries.push({ section, fingerprint, normalizedLabel });
    if (inferred) this.reportInferredToken(section, lines[0]);
    this.reportOrdinalConflict(section, lines[0]);

    return section;
  }

  private labelFor(lines: Line[]): string | null {
    const paragraph = new Paragraph();
    lines.forEach((line) => paragraph.addLine(line));
    const { label } = paragraph;

    return label && label.length > 0 ? label : null;
  }

  private fingerprint(lines: Line[]): string {
    return lines
      .map((line) => this.fingerprintLine(line))
      .filter((contents) => contents.length > 0)
      .join('\n');
  }

  private fingerprintLine(line: Line): string {
    return line.items
      .filter((item) => !(item instanceof Tag && item.isSectionDelimiter()))
      .map((item) => this.formatter.formatItem(item, this.song.metadata, line, this.song))
      .join('')
      .trim();
  }

  private addRecall(line: Line): void {
    const section = this.lastSectionOfType(CHORUS);

    if (!section) {
      this.addDiagnostic({
        type: 'missing_recall_target',
        message: 'A chorus recall has no preceding chorus to refer to',
        lineNumber: line.lineNumber,
      });

      return;
    }

    this.addOccurrence(section, 'recall', line.lineNumber);
  }

  private lastSectionOfType(type: string): SongSection | null {
    return this.lastSections[type] ?? null;
  }

  private addOccurrence(section: SongSection, origin: SongMapOccurrenceOrigin, lineNumber: number | null): void {
    this.occurrences.push(new SongMapOccurrence({ section, origin, lineNumber }));
  }

  private reportLabelConflict({ type, normalizedLabel, lines }: SectionBlock): void {
    if (normalizedLabel.length === 0) return;

    const conflicting = this.entries.find((entry) => (
      entry.section.type === type && entry.normalizedLabel === normalizedLabel
    ));

    if (!conflicting) return;

    this.addDiagnostic({
      type: 'ambiguous_label',
      message: `Label "${conflicting.section.label}" is used for sections with different content`,
      lineNumber: lines[0].lineNumber,
      sectionToken: conflicting.section.token,
    });
  }

  private reportInvalidRepeat(instruction: RepeatInstruction, block: SectionBlock, section: SongSection): number {
    this.addDiagnostic({
      type: 'invalid_repeat',
      message: instruction.notFiniteMessage,
      lineNumber: block.lines[0].lineNumber,
      sectionToken: section.token,
    });

    return 1;
  }

  private reportAmbiguousRepeat(
    instructions: RepeatInstruction[],
    block: SectionBlock,
    section: SongSection,
  ): number {
    this.addDiagnostic({
      type: 'ambiguous_repeat',
      message: `Conflicting repeat instructions: ${instructions.map((instruction) => instruction.text).join(', ')}`,
      lineNumber: block.lines[0].lineNumber,
      sectionToken: section.token,
    });

    return 1;
  }

  private reportUnattachedRepeat(line: Line): void {
    const instruction = this.commentsIn([line])
      .map((text) => RepeatInstruction.parse(text))
      .find((parsed) => parsed !== null);

    if (!instruction) return;

    this.addDiagnostic({
      type: 'ambiguous_repeat',
      message: `Repeat instruction "${instruction.text}" is not part of a section and does not identify one occurrence`,
      lineNumber: line.lineNumber,
    });
  }

  private reportInferredToken(section: SongSection, line: Line): void {
    const reason = section.type === NONE ?
      'Paragraph is not part of a section' :
      `Section type "${section.type}" is not a known section type`;

    this.addDiagnostic({
      type: 'inferred_token',
      message: `${reason}, inferred token ${section.token}`,
      lineNumber: line.lineNumber,
      sectionToken: section.token,
    });
  }

  private reportOrdinalConflict(section: SongSection, line: Line): void {
    const labelOrdinal = /^\D+\s+(\d+)$/.exec(RepeatInstruction.strip(section.label ?? ''));

    if (!labelOrdinal || parseInt(labelOrdinal[1], 10) === section.ordinal) return;

    this.addDiagnostic({
      type: 'ordinal_conflict',
      message: `Label "${section.label}" does not match the section order, using token ${section.token}`,
      lineNumber: line.lineNumber,
      sectionToken: section.token,
    });
  }

  private addDiagnostic(properties: SongMapDiagnosticProperties): void {
    this.diagnostics.push(new SongMapDiagnostic(properties));
  }
}

export default SongMapGenerator;
