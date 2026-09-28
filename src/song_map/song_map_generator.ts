import ChordProFormatter from '../formatter/chord_pro_formatter';
import Line from '../chord_sheet/line';
import Paragraph from '../chord_sheet/paragraph';
import SectionTokenizer from './section_tokenizer';
import Song from '../chord_sheet/song';
import SongMap from './song_map';
import SongMapDiagnostic from './song_map_diagnostic';
import SongMapOccurrence from './song_map_occurrence';
import SongSection from './song_section';
import Tag from '../chord_sheet/tag';

import { SongMapDiagnosticProperties } from './song_map_diagnostic';
import { SongMapOccurrenceOrigin } from './song_map_occurrence';
import { CHORUS, INDETERMINATE, NONE } from '../constants';

interface SectionEntry {
  section: SongSection;
  fingerprint: string;
  normalizedLabel: string;
}

interface SectionProperties {
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
 * Generates a {@link SongMap} from the recognized sections of a linear chart. Generation does not
 * change the song.
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

  private currentBlock: Line[] = [];

  constructor(song: Song) {
    this.song = song;
  }

  generate(): SongMap {
    this.song.lines.forEach((line) => this.processLine(line));
    this.flushBlock();

    return new SongMap({
      sections: this.entries.map((entry) => entry.section),
      occurrences: this.occurrences,
      diagnostics: this.diagnostics,
    });
  }

  private processLine(line: Line): void {
    if (this.isRecallLine(line)) {
      this.flushBlock();
      this.addRecall(line);
      return;
    }

    if (!this.isSectionLine(line)) {
      this.flushBlock();
      return;
    }

    if (line.isSectionStart() || this.startsNewType(line)) this.flushBlock();

    this.currentBlock.push(line);

    if (line.isSectionEnd()) this.flushBlock();
  }

  private isRecallLine(line: Line): boolean {
    return line.items.some((item) => item instanceof Tag && item.name === CHORUS && !item.isSectionDelimiter());
  }

  private isSectionLine(line: Line): boolean {
    return !line.isEmpty() && line.type !== NONE && line.type !== INDETERMINATE;
  }

  private startsNewType(line: Line): boolean {
    return this.currentBlock.length > 0 && this.currentBlock[0].type !== line.type;
  }

  private flushBlock(): void {
    const lines = this.currentBlock;
    this.currentBlock = [];

    if (lines.length === 0) return;

    this.addOccurrence(this.resolveSection(lines), 'source', lines[0].lineNumber);
  }

  private resolveSection(lines: Line[]): SongSection {
    const { type } = lines[0];
    const label = this.labelFor(lines);
    const normalizedLabel = normalizeLabel(label);
    const fingerprint = this.fingerprint(lines);

    const identical = this.entries.find((entry) => (
      entry.section.type === type && entry.normalizedLabel === normalizedLabel && entry.fingerprint === fingerprint
    ));

    if (identical) return identical.section;

    this.reportLabelConflict(type, normalizedLabel, lines[0]);
    return this.createSection({
      type, label, lines, fingerprint, normalizedLabel,
    });
  }

  private createSection({
    type, label, lines, fingerprint, normalizedLabel,
  }: SectionProperties): SongSection {
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
    const entries = this.entries.filter((entry) => entry.section.type === type);
    return entries[entries.length - 1]?.section ?? null;
  }

  private addOccurrence(section: SongSection, origin: SongMapOccurrenceOrigin, lineNumber: number | null): void {
    this.occurrences.push(new SongMapOccurrence({
      section, index: this.occurrences.length, origin, lineNumber,
    }));
  }

  private reportLabelConflict(type: string, normalizedLabel: string, line: Line): void {
    if (normalizedLabel.length === 0) return;

    const conflicting = this.entries.find((entry) => (
      entry.section.type === type && entry.normalizedLabel === normalizedLabel
    ));

    if (!conflicting) return;

    this.addDiagnostic({
      type: 'ambiguous_label',
      message: `Label "${conflicting.section.label}" is used for sections with different content`,
      lineNumber: line.lineNumber,
      sectionToken: conflicting.section.token,
    });
  }

  private reportInferredToken(section: SongSection, line: Line): void {
    this.addDiagnostic({
      type: 'inferred_token',
      message: `Section type "${section.type}" is not a known section type, inferred token ${section.token}`,
      lineNumber: line.lineNumber,
      sectionToken: section.token,
    });
  }

  private reportOrdinalConflict(section: SongSection, line: Line): void {
    const labelOrdinal = /(\d+)\s*$/.exec(section.label ?? '');

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
