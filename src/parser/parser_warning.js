/**
 * Represents a parser warning, currently only used by ChordProParser.
 */
class ParserWarning {
  /**
   * @hideconstructor
   */
  constructor(message, lineNumber, column) {
    /**
     * The warning message
     * @member
     * @type {string}
     */
    this.message = message;

    /**
     * The chord sheet line number on which the warning occurred
     * @member
     * @type {number}
     */
    this.lineNumber = lineNumber;

    /**
     * The chord sheet column on which the warning occurred
     * @member
     * @type {number}
     */
    this.column = column;
  }

  /**
   * Returns a stringified version of the warning
   * @returns {string} The string warning
   */
  toString() {
    return `Warning: ${this.message} on line ${this.lineNumber} column ${this.column}`;
  }
}

export default ParserWarning;
