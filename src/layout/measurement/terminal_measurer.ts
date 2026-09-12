import Graphemer from 'graphemer';
import stringWidth from 'string-width';

import { BaseMeasurer } from './measurer';

// Native ESM sees graphemer's CommonJS exports object; transpilers may unwrap its default.
const GraphemerConstructor = typeof Graphemer === 'function' ? Graphemer :
  (Graphemer as unknown as { default: typeof Graphemer }).default;

export type TerminalCellWidth = (text: string) => number;

/** Reject controls rather than letting text inject terminal commands or cursor movement. */
export function validateTerminalText(text: string): void {
  if (/[\p{Cc}\p{Zl}\p{Zp}]/u.test(text)) throw new Error('Terminal text must not contain control characters');
}

/** Unit-height, font-independent measurements. Wide indivisible graphemes may overflow. */
export class TerminalMeasurer extends BaseMeasurer {
  private readonly graphemer = new GraphemerConstructor();

  constructor(private readonly cellWidth: TerminalCellWidth = stringWidth) {
    super();
  }

  measureText(text: string): { width: number; height: number } {
    validateTerminalText(text);
    const width = this.cellWidth(text);
    if (!Number.isInteger(width) || width < 0) throw new Error('Cell width must be a nonnegative integer');
    return { width, height: 1 };
  }

  joinWrappedLines(lines: string[]): string {
    return lines.join('');
  }

  splitTextToSize(text: string, maxWidth: number): string[] {
    if (!Number.isInteger(maxWidth) || maxWidth <= 0) throw new Error('Width must be a positive integer');
    if (!text) return [];
    return text.split(/\r\n|\n/).flatMap((line) => this.splitLine(line, maxWidth));
  }

  private splitLine(text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    let current = '';
    this.graphemer.splitGraphemes(text).forEach((grapheme) => {
      if (this.measureText(current + grapheme).width > maxWidth && current) {
        lines.push(current);
        current = '';
      }
      current += grapheme;
    });
    lines.push(current);
    return lines;
  }
}
