import { INDETERMINATE } from '../constants';
import Line, { LineType } from './line';
import Literal from './chord_pro/literal';
import Tag from './tag';
import Item from './item';

/**
 * Represents a paragraph of lines in a chord sheet
 */
class Paragraph {
  /**
   * The {@link Line} items of which the paragraph consists
   * @member
   * @type {Line[]}
   */
  lines: Line[] = [];

  addLine(line): void {
    this.lines.push(line);
  }

  /**
   * Indicates whether the paragraph only contains literals. If true, {@link contents} can be used to retrieve
   * the paragraph contents as one string where lines are separated by newlines.
   * @see {@link contents}
   * @returns {boolean}
   */
  isLiteral() {
    const { lines } = this;

    if (lines.length === 0) {
      return false;
    }

    return lines.every((line) => line.items.every((item) => {
      if (item instanceof Literal) {
        return true;
      }

      if (item instanceof Tag && (item as Tag).isSectionDelimiter()) {
        return true;
      }

      return false;
    }));
  }

  /**
   * Returns the paragraph contents as one string where lines are separated by newlines
   * @returns {string}
   */
  get contents(): string {
    return this
      .lines
      .filter((line) => (
        line.items.every((item) => item instanceof Literal)
      ))
      .map((line) => (
        line.items.map((item) => (item as Literal).string).join('')
      )).join('\n');
  }

  /**
   * Returns the label of the paragraph. The label is the value of the first section delimiter tag
   * in the first line.
   * @returns {string|null}
   */
  get label(): string | null {
    if (this.lines.length === 0) {
      return null;
    }

    const startTag = this.lines[0].items.find((item: Item) => item instanceof Tag && item.isSectionDelimiter());

    if (startTag) {
      return (startTag as Tag).value;
    }

    return null;
  }

  /**
   * Tries to determine the common type for all lines. If the types for all lines are equal, it returns that type.
   * If not, it returns {@link INDETERMINATE}
   * @returns {string}
   */
  get type(): LineType {
    const types = this.lines.map((line) => line.type);
    const uniqueTypes = [...new Set(types)];

    if (uniqueTypes.length === 1) {
      return uniqueTypes[0];
    }

    return INDETERMINATE;
  }

  /**
   * Indicates whether the paragraph contains lines with renderable items.
   * @see {@link Line.hasRenderableItems}
   * @returns {boolean}
   */
  hasRenderableItems(): boolean {
    return this.lines.some((line) => line.hasRenderableItems());
  }
}

export default Paragraph;
