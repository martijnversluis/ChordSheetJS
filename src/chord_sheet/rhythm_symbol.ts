const RHYTHM_SYMBOLS = new Set([
  '/',
  '|',
  '||',
  '|.',
  '|:',
  ':|',
  ':|:',
  ':||',
  '-',
  'x',
]);

const REPEAT_COUNT = /^\(\d+x\)$/i;

export function isRhythmSymbolValue(value: string): boolean {
  return RHYTHM_SYMBOLS.has(value) || REPEAT_COUNT.test(value);
}
