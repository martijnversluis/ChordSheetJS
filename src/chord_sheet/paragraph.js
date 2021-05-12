import { INDETERMINATE } from '../constants';

/**
 * Represents a paragraph of lines in a chord sheet
 */
class Paragraph {
  constructor() {
    /**
     * The {@link Line} items of which the paragraph consists
     * @member
     * @type {Array<Line>}
     */
    this.lines = [];
  }

  addLine(line) {
    this.lines.push(line);
  }

  /**
   * Tries to determine the common type for all lines. If the types for all lines are equal, it returns that type.
   * If not, it returns {@link INDETERMINATE}
   * @returns {string}
   */
  get type() {
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
  hasRenderableItems() {
    return this.lines.some((line) => line.hasRenderableItems());
  }
}

export default Paragraph;
