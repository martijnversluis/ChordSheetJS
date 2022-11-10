import Line from './chord_sheet/line';
import ChordLyricsPair from './chord_sheet/chord_lyrics_pair';
import Item from './chord_sheet/item';

export const hasChordContents = (line: Line): boolean => (
  line.items.some((item) => (item instanceof ChordLyricsPair) && !!item.chords)
);

export const isEvaluatable = (item: Item): boolean => ('evaluate' in item) && (typeof item.evaluate === 'function');

export const padLeft = (string: string, length: number): string => {
  let paddedString = string;
  for (let l = string.length; l < length; l += 1, paddedString += ' ');
  return paddedString;
};

type ObjectWithLength = any[] | string | null;

export const isPresent = (object: ObjectWithLength): boolean => !!object && object.length > 0;
export const isString = (obj: any): boolean => (typeof obj === 'string');

function dasherize(string: string): string {
  return string.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

type CssObject = Record<string, Record<string, string>>;

export function scopeCss(css: CssObject, scope = ''): string {
  return Object
    .entries(css)
    .map(([selector, styles]) => {
      const rules = Object
        .entries(styles)
        .map(([property, value]) => `${dasherize(property)}: ${value};`)
        .join('\n  ');

      const scopedSelector = `${scope} ${selector}`.trim();

      return `
${scopedSelector} {
  ${rules}
}`.substring(1);
    })
    .join('\n\n');
}

export function deprecate(message: string): void {
  try {
    throw new Error(`DEPRECATION: ${message}`);
  } catch (e) {
    const error = (e as Error);
    const proc = globalThis.process;

    if (typeof proc === 'object' && typeof proc.emitWarning === 'function') {
      proc.emitWarning(`${message}\n${error.stack}`);
    } else {
      console.warn(`${message}\n${error.stack}`);
    }
  }
}

export function breakingChange(message: string): void {
  throw new Error(`BREAKING CHANGE: ${message}`);
}

export function isEmptyString(string: string | null | undefined): boolean {
  return (string === null || string === undefined || string === '');
}

export function isMinor(suffix: any): boolean {
  if (typeof suffix !== 'string') {
    return false;
  }

  return suffix[0] === 'm' && suffix.substring(0, 3).toLowerCase() !== 'maj';
}
