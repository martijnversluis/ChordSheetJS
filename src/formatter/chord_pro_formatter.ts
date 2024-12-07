import Formatter from './formatter';
import Tag from '../chord_sheet/tag';
import ChordLyricsPair from '../chord_sheet/chord_lyrics_pair';
import Ternary from '../chord_sheet/chord_pro/ternary';
import Literal from '../chord_sheet/chord_pro/literal';
import Song from '../chord_sheet/song';
import Line from '../chord_sheet/line';
import Metadata from '../chord_sheet/metadata';
import Item from '../chord_sheet/item';
import Evaluatable from '../chord_sheet/chord_pro/evaluatable';
import Comment from '../chord_sheet/comment';
import SoftLineBreak from '../chord_sheet/soft_line_break';
import Chord from '../chord';

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

    return lines
      .map((line) => this.formatLine(line, metadata))
      .join('\n');
  }

  formatLine(line: Line, metadata: Metadata): string {
    return line.items
      .map((item) => this.formatItem(item, metadata))
      .join('');
  }

  formatItem(item: Item, metadata: Metadata): string {
    if (item instanceof Tag) {
      return this.formatTag(item);
    }

    if (item instanceof ChordLyricsPair) {
      return this.formatChordLyricsPair(item);
    }

    if (item instanceof Comment) {
      return this.formatComment(item);
    }

    if (item instanceof SoftLineBreak) {
      return '\\ ';
    }

    if ('evaluate' in item) {
      return this.formatOrEvaluateItem(item, metadata);
    }

    throw new Error(`Don't know how to format a ${item}`);
  }

  formatOrEvaluateItem(item: Evaluatable, metadata: Metadata): string {
    if (this.configuration.evaluate) {
      return item.evaluate(metadata, this.configuration.get('metadata.separator'));
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
      const renderedChord = Chord.parse(chordLyricsPair.chords);

      if (!renderedChord) {
        return `[${chordLyricsPair.chords}]`;
      }

      const normalizedChord = this.configuration.normalizeChords ? renderedChord.normalize() : renderedChord;
      return `[${normalizedChord}]`;
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
