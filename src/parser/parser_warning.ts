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
  lineNumber: number | null = null;

  /**
   * The chord sheet column on which the warning occurred
   * @member
   * @type {number}
   */
  column: number | null = null;

  /**
   * @hideconstructor
   */
  constructor(message: string, lineNumber: number | null, column: number | null) {
    this.message = message;
    this.lineNumber = lineNumber;
    this.column = column;
  }

  /**
   * Returns a stringified version of the warning
   * @returns {string} The string warning
   */
  toString(): string {
    return `Warning: ${this.message} on line ${this.lineNumber || '?'} column ${this.column || '?'}`;
  }
}

export default ParserWarning;
