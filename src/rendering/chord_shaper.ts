import Chord from '../chord';
import { warn } from '../utilities';

import {
  ChordPartStyle,
  ChordRenderingConfig,
  FontConfiguration,
  UnicodeFallbackConfig,
} from '../formatter/configuration';

export type ChordTextPart = 'marker' | 'root' | 'quality' | 'extensions' | 'bass';

export interface ChordTextRun {
  part: ChordTextPart;
  text: string;
  font: FontConfiguration;
  yOffset: number;
}

export interface ChordRunMetrics {
  width: number;
  ascentHeight: number;
  baselineHeight: number;
  boxHeight: number;
}

export interface GlyphChecker {
  hasGlyph(codePoint: number, font: FontConfiguration): boolean;
}

export interface ChordRunOptions {
  useUnicodeModifiers: boolean;
  chordFont: FontConfiguration;
  chordRendering?: ChordRenderingConfig;
  unicodeFallback?: UnicodeFallbackConfig;
  glyphChecker?: GlyphChecker;
}

const warnedMissingGlyphs = new Set<string>();
const CHORD_SYMBOL_CODE_POINTS = new Set([0x00B0, 0x00F8, 0x0394, 0x2206, 0x2300, 0x25B3, 0x266D, 0x266E, 0x266F]);

function displaySuffixPart(text: string, useUnicodeModifier: boolean): string {
  if (!useUnicodeModifier) return text;
  return text.replace(/#(?=\d)/g, '\u266f').replace(/b(?=\d)/g, '\u266d');
}

function hasPartStyle(style: ChordPartStyle | undefined): boolean {
  return style?.fontSizeRatio !== undefined || style?.baselineShiftRatio !== undefined || !!style?.font;
}

function isBoldWeight(weight: FontConfiguration['weight']): boolean {
  if (typeof weight === 'number') return weight >= 600;
  if (typeof weight !== 'string') return false;
  const numericWeight = Number(weight);
  if (!Number.isNaN(numericWeight)) return numericWeight >= 600;
  return ['bold', 'bolder', 'semibold', 'semi-bold', 'demibold', 'demi-bold'].includes(weight.toLowerCase());
}

function styleForWeight(style: string, weight: FontConfiguration['weight']): string {
  const italic = style.includes('italic');
  const bold = isBoldWeight(weight);
  if (bold && italic) return 'bolditalic';
  if (bold) return 'bold';
  if (italic) return 'italic';
  return 'normal';
}

function resolvePartFont(chordFont: FontConfiguration, style: ChordPartStyle | undefined): FontConfiguration {
  const font = { ...chordFont, ...style?.font };
  if (style?.font?.weight !== undefined && style.font.style === undefined) {
    font.style = styleForWeight(chordFont.style, style.font.weight);
  }
  return { ...font, size: chordFont.size * (style?.fontSizeRatio ?? 1) };
}

function createRun(
  part: ChordTextPart,
  text: string,
  chordFont: FontConfiguration,
  style?: ChordPartStyle,
): ChordTextRun {
  const baselineShiftRatio = style?.baselineShiftRatio ?? 0;
  return {
    part,
    text,
    font: resolvePartFont(chordFont, style),
    yOffset: baselineShiftRatio === 0 ? 0 : -chordFont.size * baselineShiftRatio,
  };
}

function buildLogicalRuns(
  chord: Chord,
  useUnicodeModifier: boolean,
  chordFont: FontConfiguration,
  rendering: ChordRenderingConfig,
): ChordTextRun[] {
  const suffix = chord.suffix || '';
  const showMinor = suffix[0] !== 'm';
  const root = chord.root?.toString({ showMinor, useUnicodeModifier }) || '';
  const quality = displaySuffixPart(chord.quality || '', useUnicodeModifier);
  const extensions = displaySuffixPart(chord.extensions || '', useUnicodeModifier);
  const bass = chord.bass ? `/${chord.bass.toString({ useUnicodeModifier })}` : '';
  return [
    createRun('marker', chord.optional ? '(' : '', chordFont),
    createRun('root', root, chordFont),
    createRun('quality', quality, chordFont, rendering.quality),
    createRun('extensions', extensions, chordFont, rendering.extensions),
    createRun('bass', bass, chordFont),
    createRun('marker', chord.optional ? ')' : '', chordFont),
  ].filter(({ text }) => !!text);
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
  warn(`Missing glyph ${char} (U+${char.codePointAt(0)?.toString(16).toUpperCase()}) in configured fonts`);
}

function selectFont(
  char: string,
  font: FontConfiguration,
  config: UnicodeFallbackConfig,
  glyphChecker: GlyphChecker,
): FontConfiguration {
  const codePoint = char.codePointAt(0)!;
  const fallback = fallbackFont(font, config);
  if (config.preferChordSymbols && CHORD_SYMBOL_CODE_POINTS.has(codePoint) &&
    glyphChecker.hasGlyph(codePoint, fallback)) return fallback;
  if (glyphChecker.hasGlyph(codePoint, font)) return font;
  if (!glyphChecker.hasGlyph(codePoint, fallback)) warnMissingGlyph(char, font, config);
  return fallback;
}

function sameRunStyle(left: ChordTextRun, right: ChordTextRun): boolean {
  return left.part === right.part && left.font.name === right.font.name &&
    left.font.style === right.font.style && left.font.weight === right.font.weight &&
    left.font.size === right.font.size && left.yOffset === right.yOffset;
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
  return runs.some((run) => {
    const fontKeys = Object.keys(run.font) as (keyof FontConfiguration)[];
    return run.yOffset !== 0 || fontKeys.some((key) => run.font[key] !== chordFont[key]);
  });
}

export function buildChordRuns(chordString: string, options: ChordRunOptions): ChordTextRun[] | null {
  const rendering = options.chordRendering || {};
  const canStyle = hasPartStyle(rendering.quality) || hasPartStyle(rendering.extensions);
  const canFallback = !!options.unicodeFallback?.enabled && !!options.glyphChecker;
  if (!canStyle && !canFallback) return null;

  const chord = Chord.parse(chordString);
  if (!chord) return null;
  const logicalRuns = buildLogicalRuns(chord, options.useUnicodeModifiers, options.chordFont, rendering);
  const runs = applyUnicodeFallback(logicalRuns, options.unicodeFallback, options.glyphChecker);
  return differsFromPlainFont(runs, options.chordFont) ? runs : null;
}

export function getChordRunsMetrics(
  runs: ChordTextRun[],
  measureTextDimensions: (text: string, font: FontConfiguration) => { width: number; height: number },
): ChordRunMetrics {
  const dimensions = runs.map((run) => ({ run, ...measureTextDimensions(run.text, run.font) }));
  const width = dimensions.reduce((sum, dimension) => sum + dimension.width, 0);
  const baselineHeight = Math.max(
    ...dimensions.filter(({ run }) => (
      run.part === 'marker' || run.part === 'root' || run.part === 'bass'
    )).map(({ height }) => height),
    0,
  );
  const heightAboveBaseline = Math.max(
    ...dimensions.map(({ height, run }) => Math.max(height - run.yOffset, 0)),
    0,
  );
  const loweredExtent = Math.max(...dimensions.map(({ run }) => Math.max(run.yOffset, 0)), 0);
  const ascentHeight = Math.max(heightAboveBaseline - baselineHeight, 0);

  return {
    width,
    ascentHeight,
    baselineHeight,
    boxHeight: baselineHeight + ascentHeight + loweredExtent,
  };
}
