class EvaluationError extends Error {
  line: number | null = null;

  column: number | null = null;

  offset: number | null = null;

  constructor(message: string, line: number | null = null, column: number | null = null, offset: number | null = null) {
    super(`${message} on line ${line} column ${column}`);
    this.name = 'ExpressionError';
    this.line = line;
    this.column = column;
    this.offset = offset;
  }
}

export default EvaluationError;
