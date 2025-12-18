import { FontConfiguration } from '../../formatter/configuration';

export interface TextDimensions {
  width: number;
  height: number;
}

export interface Measurer {
  /**
   * Measures the dimensions of text with the given font configuration
   * @param text The text to measure
   * @param fontConfig The font configuration to apply
   * @returns The dimensions of the text
   */
  measureText(text: string, fontConfig: FontConfiguration): TextDimensions;

  /**
   * Measures the width of text with the given font configuration
   * @param text The text to measure
   * @param fontConfig The font configuration to apply
   * @returns The width of the text
   */
  measureTextWidth(text: string, fontConfig: FontConfiguration): number;

  /**
   * Measures the height of text with the given font configuration
   * @param text The text to measure
   * @param fontConfig The font configuration to apply
   * @returns The height of the text
   */
  measureTextHeight(text: string, fontConfig: FontConfiguration): number;

  /**
   * Splits text into lines that fit within the given width
   * @param text The text to split
   * @param maxWidth The maximum width of each line
   * @param fontConfig The font configuration to apply
   * @returns The lines of text
   */
  splitTextToSize(text: string, maxWidth: number, fontConfig: FontConfiguration): string[];
}

/**
 * Base class for implementing measurers with common functionality
 */
export abstract class BaseMeasurer implements Measurer {
  abstract measureText(text: string, fontConfig: FontConfiguration): TextDimensions;

  measureTextWidth(text: string, fontConfig: FontConfiguration): number {
    return this.measureText(text, fontConfig).width;
  }

  measureTextHeight(text: string, fontConfig: FontConfiguration): number {
    return this.measureText(text, fontConfig).height;
  }

  abstract splitTextToSize(text: string, maxWidth: number, fontConfig: FontConfiguration): string[];

  protected splitTextWithMeasure(
    text: string,
    maxWidth: number,
    measure: (value: string) => number,
  ): string[] {
    if (!text) return [];

    const normalizedText = text.replace(/\r\n|\r/g, '\n');

    return normalizedText
      .split('\n')
      .reduce<string[]>((acc, paragraph) => {
        acc.push(...this.wrapParagraph(paragraph, maxWidth, measure));
        return acc;
      }, []);
  }

  protected wrapParagraph(
    paragraph: string,
    maxWidth: number,
    measure: (value: string) => number,
  ): string[] {
    if (paragraph.length === 0) return [''];

    const { lines, currentLine } = this.accumulateWords(
      paragraph.split(' '),
      maxWidth,
      measure,
    );

    return currentLine.length === 0 ? lines : [...lines, currentLine];
  }

  protected splitWord(
    word: string,
    maxWidth: number,
    measure: (value: string) => number,
  ): { lines: string[]; remainder: string } {
    const result = [...word].reduce<{ lines: string[]; partial: string }>((acc, char) => {
      const testChar = `${acc.partial}${char}`;

      if (measure(testChar) <= maxWidth) {
        acc.partial = testChar;
      } else if (acc.partial.length > 0) {
        acc.lines.push(acc.partial);
        acc.partial = char;
      } else {
        acc.lines.push(char);
        acc.partial = '';
      }

      return acc;
    }, { lines: [], partial: '' });

    return { lines: result.lines, remainder: result.partial };
  }

  private accumulateWords(
    words: string[],
    maxWidth: number,
    measure: (value: string) => number,
  ): { lines: string[]; currentLine: string } {
    return words.reduce<{ lines: string[]; currentLine: string }>((acc, word) => {
      const testLine = acc.currentLine.length === 0 ? word : `${acc.currentLine} ${word}`;

      if (measure(testLine) <= maxWidth) {
        acc.currentLine = testLine;
      } else if (acc.currentLine.length > 0) {
        acc.lines.push(acc.currentLine);
        acc.currentLine = word;
      } else {
        const { lines: wordLines, remainder } = this.splitWord(word, maxWidth, measure);
        acc.lines.push(...wordLines);
        acc.currentLine = remainder;
      }

      return acc;
    }, { lines: [], currentLine: '' });
  }
}
