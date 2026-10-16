import Comment from '../chord_sheet/comment';
import Item from '../chord_sheet/item';
import Line from '../chord_sheet/line';
import Tag from '../chord_sheet/tag';

import { CHORUS, INDETERMINATE, NONE } from '../constants';

export type SectionSplitEntry =
  { kind: 'section'; lines: Line[] } |
  { kind: 'recall'; line: Line } |
  { kind: 'unattached'; line: Line };

function isContentItem(item: Item): boolean {
  if (item instanceof Comment) return false;
  if (item instanceof Tag) return item.isRenderable() && !item.isComment();

  return item.isRenderable();
}

function hasContent(line: Line): boolean {
  return line.items.some(isContentItem);
}

function isRecallLine(line: Line): boolean {
  return line.items.some((item) => item instanceof Tag && item.name === CHORUS && !item.isSectionDelimiter());
}

/**
 * Splits the lines of a chart into the blocks that become sections, the chorus recalls and the lines that are
 * not part of a section, in source order. A section lasts until it is ended or another section starts.
 */
class SectionSplitter {
  static split(lines: Line[]): SectionSplitEntry[] {
    return new SectionSplitter().build(lines);
  }

  private entries: SectionSplitEntry[] = [];

  private currentBlock: Line[] = [];

  private build(lines: Line[]): SectionSplitEntry[] {
    lines.forEach((line) => this.addLine(line));
    this.flush();

    return this.entries;
  }

  private addLine(line: Line): void {
    if (isRecallLine(line)) {
      this.flush();
      this.entries.push({ kind: 'recall', line });
      return;
    }

    if (!this.isSectionLine(line)) {
      this.flush();
      if (!line.isEmpty()) this.entries.push({ kind: 'unattached', line });
      return;
    }

    if (line.isSectionStart() || this.startsNewType(line)) this.flush();

    this.currentBlock.push(line);

    if (line.isSectionEnd()) this.flush();
  }

  private isSectionLine(line: Line): boolean {
    if (line.type === INDETERMINATE) return false;
    if (line.type === NONE) return !line.isEmpty() && (hasContent(line) || this.continuesBlock(line));
    if (line.isEmpty()) return this.continuesBlock(line);

    return true;
  }

  private continuesBlock(line: Line): boolean {
    return this.currentBlock.length > 0 && !this.startsNewType(line);
  }

  private startsNewType(line: Line): boolean {
    return this.currentBlock.length > 0 && this.currentBlock[0].type !== line.type;
  }

  private flush(): void {
    const lines = this.currentBlock;
    this.currentBlock = [];

    if (lines.length > 0) this.entries.push({ kind: 'section', lines });
  }
}

export default SectionSplitter;
