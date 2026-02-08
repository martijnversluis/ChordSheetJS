import ChordLyricsPair from '../chord_sheet/chord_lyrics_pair';
import Comment from '../chord_sheet/comment';
import Evaluatable from '../chord_sheet/chord_pro/evaluatable';
import Formatter from './formatter';
import Item from '../chord_sheet/item';
import Line from '../chord_sheet/line';
import Literal from '../chord_sheet/chord_pro/literal';
import Metadata from '../chord_sheet/metadata';
import SoftLineBreak from '../chord_sheet/soft_line_break';
import Song from '../chord_sheet/song';
import Tag from '../chord_sheet/tag';
import Ternary from '../chord_sheet/chord_pro/ternary';

/**
 * Formats a song into a ChordPro chord sheet
 */
class ChordProFormatter extends Formatter {
  /**
   * Formats a song into a ChordPro chord sheet.
   * @param {Song} song The song to be formatted
   * @returns {string} The ChordPro string
   */
  format(song: Song): string {
    const { lines, metadata } = song;
    const { metadataLines, contentLines } = this.separateMetadataFromContent(lines);
    const formattedMetadataLines = this.formatMetadataSection(metadataLines);
    const formattedContentLines = this.formatContentSection(contentLines, metadata);
    return this.combineMetadataAndContent(formattedMetadataLines, formattedContentLines);
  }

  private separateMetadataFromContent(lines: Line[]): { metadataLines: Line[], contentLines: Line[] } {
    const metadataLines: Line[] = [];
    const contentLines: Line[] = [];
    let foundContentLine = false;

    lines.forEach((line) => {
      const isMetadataLine = line.items.length === 1 &&
        line.items[0] instanceof Tag &&
        (line.items[0] as Tag).isMetaTag();

      // Only treat as metadata if it appears before any content line
      // This preserves contextual directives like key changes within the song
      if (isMetadataLine && !foundContentLine) {
        metadataLines.push(line);
      } else {
        contentLines.push(line);
        if (line.hasRenderableItems()) {
          foundContentLine = true;
        }
      }
    });

    return { metadataLines, contentLines };
  }

  private formatMetadataSection(metadataLines: Line[]): string[] {
    return metadataLines.map((line) => {
      const tag = line.items[0] as Tag;
      return this.formatTag(tag);
    });
  }

  private formatContentSection(contentLines: Line[], metadata: Metadata): string {
    return contentLines
      .map((line) => this.formatLine(line, metadata))
      .join('\n');
  }

  private combineMetadataAndContent(formattedMetadataLines: string[], formattedContentLines: string): string {
    if (formattedMetadataLines.length > 0) {
      if (formattedContentLines.trim().length > 0) {
        return `${formattedMetadataLines.join('\n')}\n${formattedContentLines}`;
      }
      return formattedMetadataLines.join('\n');
    }

    return formattedContentLines;
  }

  formatLine(line: Line, metadata: Metadata): string {
    return line.items
      .map((item) => this.formatItem(item, metadata))
      .join('');
  }

  formatItem(item: Item, metadata: Metadata): string {
    type constructor = any;
    type handlerFunc = any;

    const handlers = new Map<constructor, handlerFunc>([
      [Tag, (i: Item) => this.formatTag(i as Tag)],
      [ChordLyricsPair, (i: Item) => this.formatChordLyricsPair(i as ChordLyricsPair)],
      [Comment, (i: Item) => this.formatComment(i as Comment)],
      [SoftLineBreak, (_i: Item) => '\\ '],
    ]);

    const handler = handlers.get(item.constructor);

    if (handler) {
      return handler(item);
    }

    if ('evaluate' in item) {
      return this.formatOrEvaluateItem(item, metadata);
    }

    throw new Error(`Don't know how to format a ${item}`);
  }

  formatOrEvaluateItem(item: Evaluatable, metadata: Metadata): string {
    if (this.configuration.evaluate) {
      return item.evaluate(metadata, this.configuration.metadata.separator);
    }

    if (item instanceof Ternary) {
      return this.formatTernary(item);
    }

    if (item instanceof Literal) {
      return item.evaluate();
    }

    throw new Error(`Don't know how to format a ${item.constructor.name}`);
  }

  formatTernary(ternary: Ternary): string {
    const {
      variable,
      valueTest,
      trueExpression,
      falseExpression,
    } = ternary;

    return [
      '%{',
      variable || '',
      this.formatValueTest(valueTest),
      this.formatExpressionRange(trueExpression),
      this.formatExpressionRange(falseExpression),
      '}',
    ].join('');
  }

  formatValueTest(valueTest: string | null): string {
    if (!valueTest) {
      return '';
    }

    return `=${valueTest}`;
  }

  formatExpressionRange(expressionRange: Evaluatable[]): string {
    if (!expressionRange.length) {
      return '';
    }

    return `|${expressionRange.map((expression) => this.formatExpression(expression)).join('')}`;
  }

  formatExpression(expression: Evaluatable): string {
    if (expression instanceof Ternary) {
      return this.formatTernary(expression);
    }

    if (expression instanceof Literal) {
      return expression.string;
    }

    return '';
  }

  formatTag(tag: Tag): string {
    if (tag.hasAttributes()) {
      return `{${tag.originalName}: ${this.formatTagAttributes(tag)}}`;
    }

    if (tag.hasValue()) {
      return `{${tag.originalName}: ${tag.value}}`;
    }

    return `{${tag.originalName}}`;
  }

  formatTagAttributes(tag: Tag) {
    const keys = Object.keys(tag.attributes);

    if (keys.length === 0) {
      return '';
    }

    return keys.map((key) => `${key}="${tag.attributes[key]}"`).join(' ');
  }

  formatChordLyricsPair(chordLyricsPair: ChordLyricsPair): string {
    return [
      this.formatChordLyricsPairChords(chordLyricsPair),
      this.formatChordLyricsPairLyrics(chordLyricsPair),
    ].join('');
  }

  formatChordLyricsPairChords(chordLyricsPair: ChordLyricsPair): string {
    if (chordLyricsPair.chords) {
      const chordObj = chordLyricsPair.chord;
      if (!chordObj) {
        return `[${chordLyricsPair.chords}]`;
      }

      const finalChord = this.configuration.normalizeChords ? chordObj.normalize() : chordObj;
      return `[${finalChord}]`;
    }

    if (chordLyricsPair.annotation) {
      return `[*${chordLyricsPair.annotation}]`;
    }

    return '';
  }

  formatChordLyricsPairLyrics(chordLyricsPair: ChordLyricsPair): string {
    return chordLyricsPair.lyrics || '';
  }

  formatComment(comment: Comment): string {
    return `#${comment.content}`;
  }
}

export default ChordProFormatter;
