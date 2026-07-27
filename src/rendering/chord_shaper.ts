import Chord from '../chord';
import { ChordSuperscriptConfig, FontConfiguration } from '../formatter/configuration';

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

function createBaselineRun(text: string, font: FontConfiguration): ChordTextRun {
  return {
    text, font, yOffset: 0, superscript: false,
  };
}

export function buildChordRuns(
  chordString: string,
  useUnicodeModifier: boolean,
  config: ChordSuperscriptConfig,
  chordFont: FontConfiguration,
): ChordTextRun[] | null {
  if (!config.enabled) return null;

  const parseableChord = chordString.replace(/\u266f/g, '#').replace(/\u266d/g, 'b');
  const chord = Chord.parse(parseableChord);
  if (!chord?.extensions) return null;

  const { before, after } = buildBaselineParts(chord, useUnicodeModifier);
  const extensionFont = { ...chordFont, size: chordFont.size * config.fontSizeRatio };
  const runs: ChordTextRun[] = [];

  if (before) runs.push(createBaselineRun(before, chordFont));
  runs.push({
    text: displaySuffixPart(chord.extensions, useUnicodeModifier),
    font: extensionFont,
    yOffset: -chordFont.size * config.riseRatio,
    superscript: true,
  });
  if (after) runs.push(createBaselineRun(after, chordFont));

  return runs;
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
