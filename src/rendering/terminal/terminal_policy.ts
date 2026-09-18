import ChordLyricsPair from '../../chord_sheet/chord_lyrics_pair';
import Paragraph from '../../chord_sheet/paragraph';
import SoftLineBreak from '../../chord_sheet/soft_line_break';
import Tag from '../../chord_sheet/tag';

import { clonePositionedLine, isColumnBreakItem } from '../../layout/engine/positioned_source';

import type { TerminalDiagnostic } from './types';
import type { TerminalFormatterConfiguration } from '../../formatter/configuration/terminal_configuration';

/** Applies visibility before measurement; never replays a cached section body. */
export class TerminalPolicy {
  readonly diagnostics: TerminalDiagnostic[] = [];

  private readonly labels = new Set<string>();

  constructor(private readonly config: TerminalFormatterConfiguration) {}

  prepare(original: Paragraph, occurrence: number): { paragraph: Paragraph; lyricsOnly: boolean } {
    const label = original.label?.trim().toLowerCase();
    const repeated = !!label && this.labels.has(label);
    if (label) this.labels.add(label);
    const policy = repeated ? this.config.layout.sections.base.display.repeatedSections : 'full';
    const paragraph = new Paragraph();
    paragraph.lines = original.lines.map((line, index) => {
      const clone = clonePositionedLine(line);
      clone.items = clone.items.filter(
        (item) => isColumnBreakItem(item) ||
          (policy !== 'hide' && this.keepItem(item, occurrence, index, policy === 'title_only')),
      );
      return clone;
    });
    return {
      paragraph,
      lyricsOnly: this.config.layout.sections.base.display.lyricsOnly || policy === 'lyrics_only',
    };
  }

  private keepItem(item: unknown, paragraph: number, line: number, titleOnly: boolean): boolean {
    const unsupported = !(
      item instanceof ChordLyricsPair ||
      item instanceof SoftLineBreak ||
      item instanceof Tag
    );
    if (unsupported || (item instanceof Tag && item.isImage())) {
      this.diagnostics.push({
        code: 'unsupported-content',
        message: 'Unsupported terminal body item',
        source: { paragraph, line },
      });
      return false;
    }
    if (item instanceof ChordLyricsPair && item.annotation && !item.chords) {
      const pair = item;
      pair.chords = item.annotation;
    }
    if (item instanceof Tag && item.isSectionDelimiter()) return this.prepareLabel(item);
    return !titleOnly;
  }

  private prepareLabel(tag: Tag): boolean {
    if (!this.config.layout.sections.base.display.showLabel) return false;
    if (this.config.layout.sections.base.display.labelStyle === 'uppercase') {
      const target = tag;
      target.attributes.label = tag.label.toUpperCase();
      target.value = tag.value.toUpperCase();
    }
    return true;
  }
}
