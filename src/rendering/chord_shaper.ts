import Chord from '../chord';

import {
  ChordSuperscriptConfig,
  FontConfiguration,
  UnicodeFallbackConfig,
  defaultChordSuperscriptConfig,
} from '../formatter/configuration';

export interface ChordTextRun {
  text: string;
  font: FontConfiguration;
  yOffset: number;
  superscript: boolean;
}

export interface ChordRunMetrics {
  width: number;
  baselineHeight: number;
  boxHeight: number;
}

export interface GlyphChecker {
  hasGlyph(codePoint: number, font: FontConfiguration): boolean;
}

const warnedMissingGlyphs = new Set<string>();

function displaySuffixPart(text: string, useUnicodeModifier: boolean): string {
  if (!useUnicodeModifier) return text;
  return text.replace(/#(?=\d)/g, '\u266f').replace(/b(?=\d)/g, '\u266d');
}

function buildBaselineParts(chord: Chord, useUnicodeModifier: boolean): { before: string; after: string } {
  const suffix = chord.suffix || '';
  const showMinor = suffix[0] !== 'm';
  const opening = chord.optional ? '(' : '';
  const closing = chord.optional ? ')' : '';
  const root = chord.root?.toString({ showMinor, useUnicodeModifier }) || '';
  const quality = displaySuffixPart(chord.quality || '', useUnicodeModifier);
  const bass = chord.bass ? `/${chord.bass.toString({ useUnicodeModifier })}` : '';

  return {
    before: `${opening}${root}${quality}`,
    after: `${bass}${closing}`,
  };
}

function createRun(
  text: string,
  font: FontConfiguration,
  yOffset = 0,
  superscript = false,
): ChordTextRun {
  return {
    text, font, yOffset, superscript,
  };
}

function buildLogicalRuns(
  chord: Chord,
  useUnicodeModifier: boolean,
  superscript: ChordSuperscriptConfig,
  chordFont: FontConfiguration,
): ChordTextRun[] {
  const { before, after } = buildBaselineParts(chord, useUnicodeModifier);
  const runs: ChordTextRun[] = [];
  if (before) runs.push(createRun(before, chordFont));

  if (chord.extensions) {
    const extension = displaySuffixPart(chord.extensions, useUnicodeModifier);
    const font = superscript.enabled ?
      { ...chordFont, size: chordFont.size * superscript.fontSizeRatio } : chordFont;
    const rise = superscript.enabled ? -chordFont.size * superscript.riseRatio : 0;
    runs.push(createRun(extension, font, rise, superscript.enabled));
  }

  if (after) runs.push(createRun(after, chordFont));
  return runs;
}

function isBoldWeight(weight: FontConfiguration['weight']): boolean {
  if (typeof weight === 'number') return weight >= 600;
  if (typeof weight !== 'string') return false;
  const numericWeight = Number(weight);
  if (!Number.isNaN(numericWeight)) return numericWeight >= 600;
  return ['bold', 'bolder', 'semibold', 'semi-bold', 'demibold', 'demi-bold'].includes(weight.toLowerCase());
}

function fallbackStyle(font: FontConfiguration): 'normal' | 'bold' | 'italic' | 'bolditalic' {
  const bold = font.style.includes('bold') || isBoldWeight(font.weight);
  const italic = font.style.includes('italic');
  if (bold && italic) return 'bolditalic';
  if (bold) return 'bold';
  if (italic) return 'italic';
  return 'normal';
}

function fallbackFont(font: FontConfiguration, config: UnicodeFallbackConfig): FontConfiguration {
  const style = fallbackStyle(font);
  return {
    ...font,
    name: config.fallbackFonts[style],
    style,
    weight: undefined,
  };
}

function warnMissingGlyph(char: string, font: FontConfiguration, config: UnicodeFallbackConfig): void {
  if (!config.warnOnMissingGlyph) return;
  const key = `${font.name}:${char}`;
  if (warnedMissingGlyphs.has(key)) return;
  warnedMissingGlyphs.add(key);
  // eslint-disable-next-line no-console
  console.warn(`Missing glyph ${char} (U+${char.codePointAt(0)?.toString(16).toUpperCase()}) in configured fonts`);
}

function selectFont(
  char: string,
  font: FontConfiguration,
  config: UnicodeFallbackConfig,
  glyphChecker: GlyphChecker,
): FontConfiguration {
  const codePoint = char.codePointAt(0)!;
  if (glyphChecker.hasGlyph(codePoint, font)) return font;
  const fallback = fallbackFont(font, config);
  if (!glyphChecker.hasGlyph(codePoint, fallback)) warnMissingGlyph(char, font, config);
  return fallback;
}

function sameRunStyle(left: ChordTextRun, right: ChordTextRun): boolean {
  return left.font.name === right.font.name &&
    left.font.style === right.font.style &&
    left.font.weight === right.font.weight &&
    left.font.size === right.font.size &&
    left.yOffset === right.yOffset &&
    left.superscript === right.superscript;
}

function appendCharacter(runs: ChordTextRun[], run: ChordTextRun, char: string, font: FontConfiguration): void {
  const next = { ...run, text: char, font };
  const previous = runs[runs.length - 1];
  if (previous && sameRunStyle(previous, next)) {
    previous.text += char;
  } else {
    runs.push(next);
  }
}

function applyUnicodeFallback(
  runs: ChordTextRun[],
  config: UnicodeFallbackConfig | undefined,
  glyphChecker: GlyphChecker | undefined,
): ChordTextRun[] {
  if (!config?.enabled || !glyphChecker) return runs;
  const shaped: ChordTextRun[] = [];
  runs.forEach((run) => {
    [...run.text].forEach((char) => {
      appendCharacter(shaped, run, char, selectFont(char, run.font, config, glyphChecker));
    });
  });
  return shaped;
}

function differsFromPlainFont(runs: ChordTextRun[], chordFont: FontConfiguration): boolean {
  return runs.some((run) => run.superscript || run.yOffset !== 0 ||
    run.font.name !== chordFont.name || run.font.style !== chordFont.style ||
    run.font.weight !== chordFont.weight || run.font.size !== chordFont.size);
}

export function buildChordRuns(
  chordString: string,
  useUnicodeModifier: boolean,
  superscript: ChordSuperscriptConfig | undefined,
  chordFont: FontConfiguration,
  unicodeFallback?: UnicodeFallbackConfig,
  glyphChecker?: GlyphChecker,
): ChordTextRun[] | null {
  const chord = Chord.parse(chordString);
  if (!chord) return null;
  const resolvedSuperscript = superscript ?? defaultChordSuperscriptConfig;
  const canSuperscript = resolvedSuperscript.enabled && !!chord.extensions;
  const canFallback = !!unicodeFallback?.enabled && !!glyphChecker;
  if (!canSuperscript && !canFallback) return null;

  const logicalRuns = buildLogicalRuns(chord, useUnicodeModifier, resolvedSuperscript, chordFont);
  const runs = applyUnicodeFallback(logicalRuns, unicodeFallback, glyphChecker);
  return differsFromPlainFont(runs, chordFont) ? runs : null;
}

export function getChordRunsMetrics(
  runs: ChordTextRun[],
  measureTextDimensions: (text: string, font: FontConfiguration) => { width: number; height: number },
): ChordRunMetrics {
  const dimensions = runs.map((run) => ({ run, ...measureTextDimensions(run.text, run.font) }));
  const width = dimensions.reduce((sum, dimension) => sum + dimension.width, 0);
  const baselineHeight = Math.max(
    ...dimensions.filter(({ run }) => !run.superscript).map(({ height }) => height),
    0,
  );
  const superscriptHeight = Math.max(
    ...dimensions.filter(({ run }) => run.superscript).map(({ height, run }) => height + Math.abs(run.yOffset)),
    0,
  );

  return {
    width,
    baselineHeight,
    boxHeight: Math.max(baselineHeight, superscriptHeight),
  };
}
