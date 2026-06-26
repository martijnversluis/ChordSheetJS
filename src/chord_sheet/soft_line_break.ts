import { SOFT_LINE_BREAK_BRAND, brandPrototype, hasBrand } from './object_brand';

/**
 * Represents a soft line break in the lyrics, typically rendered as a space or optional break point.
 */
class SoftLineBreak {
  static [Symbol.hasInstance](instance: unknown): boolean {
    return hasBrand(instance, SOFT_LINE_BREAK_BRAND);
  }

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

brandPrototype(SoftLineBreak.prototype, SOFT_LINE_BREAK_BRAND);

export default SoftLineBreak;
