import FontSize from './font_size';

interface FontProperties {
  font?: string | null;
  size?: FontSize | null;
  colour?: string | null;
}

class Font {
  /**
   * The font
   * @member {string | null}
   */
  font: string | null = null;

  /**
   * The font size, expressed in either pixels or percentage.
   * @member {FontSize | null}
   */
  size: FontSize | null = null;

  /**
   * The font color
   * @member {string | null}
   */
  colour: string | null = null;

  constructor({ font, size, colour }: FontProperties = { font: null, size: null, colour: null }) {
    this.font = font ? font.replace(/"/g, '\'') : null;
    this.size = size || null;
    this.colour = colour || null;
  }

  clone() {
    return new Font({
      font: this.font,
      size: this.size,
      colour: this.colour,
    });
  }

  /**
   * Converts the font, size and color to a CSS string.
   * If possible, font and size are combined to the `font` shorthand.
   * If `font` contains double quotes (`"`) those will be converted to single quotes (`'`).
   *
   * @example
   * // Returns "font-family: 'Times New Roman'"
   * new Font({ font: '"Times New Roman"' }).toCssString()
   * @example
   * // Returns "color: red; font-family: Verdana"
   * new Font({ font: 'Verdana', colour: 'red' }).toCssString()
   * @example
   * // Returns "font: 30px Verdana"
   * new Font({ font: 'Verdana', size: '30' }).toCssString()
   * @example
   * // Returns "color: blue; font: 30% Verdana"
   * new Font({ font: 'Verdana', size: '30%', colour: 'blue' }).toCssString()
   * ```
   *
   * @return {string} The CSS string
   */
  toCssString(): string {
    const properties: Record<string, string> = {};

    if (this.colour) {
      properties.color = this.colour;
    }

    if (this.font && this.size) {
      properties.font = `${this.size} ${this.font}`;
    } else if (this.font) {
      properties['font-family'] = this.font;
    } else if (this.size) {
      properties['font-size'] = `${this.size}`;
    }

    return Object
      .keys(properties)
      .map((key) => `${key}: ${properties[key]}`)
      .join('; ');
  }
}

export default Font;
