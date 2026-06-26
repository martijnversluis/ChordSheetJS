// ChordSheetJS publishes multiple entrypoints. Some bundlers load those
// entrypoints as separate module graphs, which gives each graph its own class
// constructors. These global brands preserve nominal `instanceof` behavior for
// public chord-sheet model objects across those duplicate module instances.
export const CHORD_LYRICS_PAIR_BRAND = Symbol.for('chordsheetjs.ChordLyricsPair');
export const COMMENT_BRAND = Symbol.for('chordsheetjs.Comment');
export const LITERAL_BRAND = Symbol.for('chordsheetjs.Literal');
export const SOFT_LINE_BREAK_BRAND = Symbol.for('chordsheetjs.SoftLineBreak');
export const TAG_BRAND = Symbol.for('chordsheetjs.Tag');

export function brandPrototype(prototype: object, brand: symbol): void {
  Object.defineProperty(prototype, brand, {
    value: true,
    enumerable: false,
    configurable: false,
  });
}

export function hasBrand(instance: unknown, brand: symbol): boolean {
  return !!(
    instance &&
    typeof instance === 'object' &&
    (instance as Record<symbol, unknown>)[brand] === true
  );
}
