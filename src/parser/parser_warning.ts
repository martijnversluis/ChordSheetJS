/**
 * Represents a parser warning, currently only used by ChordProParser.
 */
class ParserWarning {
  /**
   * The warning message
   * @member
   * @type {string}
   */
  message: string;

  /**
   * The chord sheet line number on which the warning occurred
   * @member
   * @type {number}
   */
  lineNumber: number;

  /**
   * The chord sheet column on which the warning occurred
   * @member
   * @type {number}
   */
  column: number;

  /**
   * @hideconstructor
   */
  constructor(message: string, lineNumber: number, column: number) {
    this.message = message;
    this.lineNumber = lineNumber;
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
