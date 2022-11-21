type Size = 'px' | '%';

class FontSize {
  /**
   * The size unit, either `"px"` or `"%"`
   * @member {string}
   */
  unit: Size;

  /**
   * The font size
   * @member {number}
   */
  fontSize: number;

  constructor(fontSize: number, kind: Size) {
    this.fontSize = fontSize;
    this.unit = kind;
  }

  clone() {
    return new FontSize(this.fontSize, this.unit);
  }

  multiply(percentage): FontSize {
    return new FontSize((this.fontSize * percentage) / 100, this.unit);
  }

  /**
   * Stringifies the font size by concatenating size and unit
   *
   * @example
   * // Returns "30px"
   * new FontSize(30, 'px').toString()
   * @example
   * // Returns "120%"
   * new FontSize(120, '%').toString()
   *
   * @return {string} The font size
   */
  toString() {
    return `${this.fontSize}${this.unit}`;
  }

  static parse(fontSize: string, parent: FontSize | null) {
    const trimmed = fontSize.trim();
    const parsedFontSize = parseFloat(trimmed);

    if (Number.isNaN(parsedFontSize)) {
      return this.parseNotANumber(parent);
    }

    if (trimmed.slice(-1) === '%') {
      return this.parsePercentage(parsedFontSize, parent);
    }

    return new FontSize(parsedFontSize, 'px');
  }

  static parseNotANumber(parent: FontSize | null) {
    if (parent) {
      return parent.clone();
    }

    return new FontSize(100, '%');
  }

  static parsePercentage(parsedFontSize: number, parent: FontSize | null) {
    if (parent) {
      return parent.multiply(parsedFontSize);
    }

    return new FontSize(parsedFontSize, '%');
  }
}

export default FontSize;
