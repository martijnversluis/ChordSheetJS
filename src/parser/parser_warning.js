class ParserWarning {
  constructor(message, lineNumber) {
    this._message = message;
    this._lineNumber = lineNumber;
  }

  toString() {
    return `Warning: ${this._message} on line ${this._lineNumber}`;
  }
}

export default ParserWarning;
