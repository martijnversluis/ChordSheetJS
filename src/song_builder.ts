import { NONE, PART } from './constants';

import Line, { LineType } from './chord_sheet/line';

import Tag, {
  AUTO,
  END_TAG,
  KEY,
  NEW_KEY,
  START_TAG,
  TRANSPOSE,
} from './chord_sheet/tag';

import Metadata from './chord_sheet/metadata';
import FontStack from './chord_sheet/font_stack';
import Item from './chord_sheet/item';
import TraceInfo from './chord_sheet/trace_info';
import ParserWarning from './parser/parser_warning';
import Song from './chord_sheet/song';

class SongBuilder {
  currentKey: string | null = null;

  currentLine: Line | null = null;

  fontStack: FontStack = new FontStack();

  lines: Line[] = [];

  metadata: Metadata = new Metadata();

  sectionType: string = NONE;

  selector: string | null = null;

  song: Song;

  transposeKey: string | null = null;

  warnings: ParserWarning[] = [];

  constructor(song: Song) {
    this.song = song;
    this.song.lines = this.lines;
    this.song.metadata = this.metadata;
    this.song.warnings = this.warnings;
  }

  get previousLine(): Line | null {
    const count = this.lines.length;

    if (count >= 2) {
      return this.lines[count - 2];
    }

    return null;
  }

  addLine(line?: Line): Line {
    if (line) {
      this.currentLine = line;
    } else {
      this.currentLine = new Line();
      this.lines.push(this.currentLine);
    }

    this.setCurrentProperties(this.sectionType, this.selector);
    this.currentLine.transposeKey = this.transposeKey ?? this.currentKey;
    this.currentLine.key = this.currentKey || this.metadata.getSingle(KEY);
    this.currentLine.lineNumber = this.lines.length - 1;
    return this.currentLine;
  }

  setCurrentProperties(sectionType: string, selector: string | null = null): void {
    if (!this.currentLine) throw new Error('Expected this.currentLine to be present');

    this.currentLine.type = sectionType as LineType;
    this.currentLine.selector = selector;
    this.currentLine.textFont = this.fontStack.textFont.clone();
    this.currentLine.chordFont = this.fontStack.chordFont.clone();
  }

  addItem(item: Item): void {
    if (item instanceof Tag) {
      this.addTag(item);
    } else {
      this.ensureLine();
      if (!this.currentLine) throw new Error('Expected this.currentLine to be present');
      this.currentLine.addItem(item);
    }
  }

  chords(chr: string): void {
    if (!this.currentLine) throw new Error('Expected this.currentLine to be present');
    this.currentLine.chords(chr);
  }

  lyrics(chr: string): void {
    this.ensureLine();
    if (!this.currentLine) throw new Error('Expected this.currentLine to be present');
    this.currentLine.lyrics(chr);
  }

  addTag(tagContents: string | Tag): Tag {
    const tag = Tag.parseOrFail(tagContents);
    this.applyTagOnSong(tag);
    this.applyTagOnLine(tag);
    return tag;
  }

  ensureLine(): void {
    if (this.currentLine === null) {
      this.addLine();
    }
  }

  private applyTagOnSong(tag: Tag) {
    if (tag.isMetaTag()) {
      this.setMetadata(tag.name, tag.value || '');
    } else if (tag.name === TRANSPOSE) {
      this.transposeKey = tag.value;
    } else if (tag.name === NEW_KEY) {
      this.currentKey = tag.value;
    } else if (tag.isSectionDelimiter()) {
      this.setSectionTypeFromTag(tag);
    } else if (tag.isInlineFontTag()) {
      this.fontStack.applyTag(tag);
    }
  }

  private applyTagOnLine(tag: Tag) {
    this.ensureLine();
    if (!this.currentLine) throw new Error('Expected this.currentLine to be present');
    this.currentLine.addTag(tag);
  }

  setMetadata(name: string, value: string): void {
    this.metadata.add(name, value);
  }

  setSectionTypeFromTag(tag: Tag): void {
    const [tagType, sectionType] = Tag.recognizeSectionTag(tag);

    if (!sectionType) {
      return;
    }

    if (tagType === START_TAG) {
      this.startSection(sectionType, tag);
    } else if (tagType === END_TAG) {
      this.endSection(sectionType === AUTO ? this.sectionType : sectionType, tag);
    }
  }

  startSection(sectionType: string, tag: Tag): void {
    this.checkCurrentSectionType(NONE, tag);
    this.selector = tag.selector;

    if (sectionType === PART && tag.value) {
      this.sectionType = tag.value.split(' ')[0].toLowerCase();
    } else {
      this.sectionType = sectionType;
    }

    this.selector = tag.selector;
    this.setCurrentProperties(sectionType, tag.selector);
  }

  endSection(sectionType: string, tag: Tag): void {
    this.checkCurrentSectionType(sectionType, tag);
    this.sectionType = NONE;
    this.selector = null;
  }

  checkCurrentSectionType(sectionType: string, tag: Tag): void {
    if (this.sectionType !== sectionType && !(sectionType === 'part' && tag.name === 'end_of_part')) {
      this.addWarning(`Unexpected tag {${tag.originalName}}, current section is: ${this.sectionType}`, tag);
    }
  }

  addWarning(message: string, { line, column }: TraceInfo): void {
    const warning = new ParserWarning(message, line || null, column || null);
    this.warnings.push(warning);
  }
}

export default SongBuilder;
