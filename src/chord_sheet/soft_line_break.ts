/**
 * Represents a soft line break in the lyrics, typically rendered as a space or optional break point.
 */
class SoftLineBreak {
  /**
   * The content of the soft line break, defaults to a single space.
   */
  content: string;

  constructor(content = ' ') {
    this.content = content;
  }

  /**
   * Returns a copy of the SoftLineBreak.
   */
  clone() {
    return new SoftLineBreak();
  }
}

export default SoftLineBreak;
