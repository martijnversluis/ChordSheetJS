const UNBOUNDED_PATTERN = /\brepeat\s+(?:until|till|while|as\s+needed|ad\s+lib(?:itum)?|indefinitely)\b[^,;)]*\)?/i;

const COUNT_PATTERNS = [
  /\(\s*(-?\d+(?:[.,]\d+)?)\s*(?:x|times?)\s*\)/i,
  /\(\s*x\s*(-?\d+(?:[.,]\d+)?)\s*\)/i,
  /\brepeat\s+(-?\d+(?:[.,]\d+)?)\s*(?:x\b|times?\b)/i,
  /(-?\d+(?:[.,]\d+)?)\s*(?:x\b|times?\b)/i,
  /\bx\s*(-?\d+(?:[.,]\d+)?)/i,
];

function findCount(text: string): RegExpExecArray | null {
  return COUNT_PATTERNS.reduce(
    (found: RegExpExecArray | null, pattern) => found || pattern.exec(text),
    null,
  );
}

function parseCount(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;

  const count = parseInt(value, 10);
  return count > 0 ? count : null;
}

/**
 * A repeat instruction as written in a chart, for example `2x` or `Repeat 2 times`. Instructions
 * that do not describe a finite number of performances have a `null` {@link count}.
 */
class RepeatInstruction {
  /**
   * Parses the first repeat instruction in a piece of text
   * @returns {RepeatInstruction|null} the instruction, or `null` when the text contains none
   */
  static parse(text: string): RepeatInstruction | null {
    const unbounded = UNBOUNDED_PATTERN.exec(text);

    if (unbounded) {
      return new RepeatInstruction(unbounded[0].trim(), null);
    }

    const count = findCount(text);

    if (!count) return null;

    return new RepeatInstruction(count[0].trim(), parseCount(count[1]));
  }

  /**
   * Removes all repeat instructions from a piece of text
   * @returns {string} the text without its repeat instructions
   */
  static strip(text: string): string {
    let result = text;

    for (let instruction = this.parse(result); instruction; instruction = this.parse(result)) {
      result = result.replace(instruction.text, ' ');
    }

    return result.replace(/\s+/g, ' ').trim();
  }

  /** The instruction as written in the chart */
  text: string;

  /** The number of performances, or `null` when the instruction is not a finite repeat */
  count: number | null;

  constructor(text: string, count: number | null) {
    this.text = text;
    this.count = count;
  }

  isFinite(): boolean {
    return this.count !== null;
  }
}

export default RepeatInstruction;
