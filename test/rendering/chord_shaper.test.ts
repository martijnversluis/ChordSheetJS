import { FontConfiguration } from '../../src/formatter/configuration';
import {
  ChordRunOptions,
  buildChordRuns,
  getChordRunsMetrics,
  resolveChordRenderingConfig,
} from '../../src/rendering/chord_shaper';

const chordFont: FontConfiguration = {
  name: 'Test',
  style: 'bold',
  size: 20,
  color: '#000000',
};

const superscript = {
  enabled: true,
  fontSizeRatio: 0.7,
  riseRatio: 0.35,
};

const unicodeFallback = {
  enabled: true,
  preferChordSymbols: true,
  warnOnMissingGlyph: true,
  fallbackFonts: {
    normal: 'ChordSheetSymbols',
    bold: 'ChordSheetSymbols',
    italic: 'ChordSheetSymbols',
    bolditalic: 'ChordSheetSymbols',
  },
};

const missingUnicodeGlyphs = {
  hasGlyph: (codePoint: number, font: FontConfiguration) => (
    codePoint < 128 || font.name.startsWith('ChordSheetSymbols')
  ),
};

function shape(chord: string, options: Partial<ChordRunOptions> = {}) {
  return buildChordRuns(chord, {
    chordFont,
    useUnicodeModifiers: false,
    ...options,
  });
}

describe('chord shaper', () => {
  it.each([
    ['Cmaj7', ['C', 'maj', '7']],
    ['Am7', ['A', 'm', '7']],
    ['F#dim7', ['F#', 'dim', '7']],
  ])('styles semantic quality and extension runs in %s', (chord, expectedTexts) => {
    const runs = shape(chord, {
      chordRendering: {
        quality: { font: { weight: 500 }, fontSizeRatio: 0.8 },
        extensions: { baselineShiftRatio: 0.35, fontSizeRatio: 0.7 },
      },
    });

    expect(runs?.map(({ text }) => text)).toEqual(expectedTexts);
    expect(runs?.map(({ part }) => part)).toEqual(['root', 'quality', 'extensions']);
    expect(runs?.[1]).toMatchObject({
      font: { size: 16, style: 'normal', weight: 500 },
      yOffset: 0,
    });
    expect(runs?.[2]).toMatchObject({ font: { size: 14 }, yOffset: -7 });
  });

  it('translates the legacy superscript API and lets canonical fields override it', () => {
    expect(resolveChordRenderingConfig(undefined, superscript).extensions).toEqual({
      fontSizeRatio: 0.7,
      baselineShiftRatio: 0.35,
    });
    expect(resolveChordRenderingConfig({
      extensions: { baselineShiftRatio: 0, font: { weight: 500 } },
    }, superscript).extensions).toEqual({
      fontSizeRatio: 0.7,
      baselineShiftRatio: 0,
      font: { weight: 500 },
    });
    expect(resolveChordRenderingConfig(undefined, { ...superscript, enabled: false }).extensions).toEqual({});
  });

  it('keeps slash basses and optional markers on the baseline', () => {
    const chordRendering = { extensions: { baselineShiftRatio: 0.35, fontSizeRatio: 0.7 } };
    const slashRuns = shape('Cmaj7/E', { chordRendering });
    const optionalRuns = shape('(Dm11)', { chordRendering });

    expect(slashRuns?.map(({ text }) => text)).toEqual(['C', 'maj', '7', '/E']);
    expect(slashRuns?.map(({ yOffset }) => yOffset)).toEqual([0, 0, -7, 0]);
    expect(optionalRuns?.map(({ text }) => text)).toEqual(['(', 'D', 'm', '11', ')']);
    expect(optionalRuns?.map(({ part }) => part)).toEqual([
      'marker', 'root', 'quality', 'extensions', 'marker',
    ]);
  });

  it('accepts already-rendered Unicode accidentals', () => {
    const runs = shape('F♯7', {
      chordSuperscript: superscript,
      useUnicodeModifiers: true,
    });

    expect(runs?.map(({ text }) => text)).toEqual(['F♯', '7']);
  });

  it('uses a style-matched fallback font without losing semantic styles', () => {
    const runs = shape('F♯7♭9/C♯', {
      chordRendering: { extensions: { baselineShiftRatio: 0.35, fontSizeRatio: 0.7 } },
      glyphChecker: missingUnicodeGlyphs,
      unicodeFallback,
      useUnicodeModifiers: true,
    });

    const accidentals = runs?.filter(({ text }) => text === '♯' || text === '♭');
    expect(accidentals?.map(({ font }) => font.name)).toEqual([
      'ChordSheetSymbols',
      'ChordSheetSymbols',
      'ChordSheetSymbols',
    ]);
    expect(accidentals?.[1]).toMatchObject({ part: 'extensions', yOffset: -7, font: { size: 14 } });
  });

  it.each(['Δ', '∆', '△', '°', 'ø', '⌀'])('falls back for the %s chord-quality symbol', (symbol) => {
    const runs = shape(`C${symbol}7`, {
      chordRendering: { quality: { fontSizeRatio: 0.8 } },
      glyphChecker: missingUnicodeGlyphs,
      unicodeFallback,
      useUnicodeModifiers: true,
    });

    expect(runs?.find(({ text }) => text === symbol)).toMatchObject({
      part: 'quality',
      font: { name: 'ChordSheetSymbols', size: 16 },
    });
  });

  it('prefers the chord-symbol font when the primary font also has a glyph', () => {
    const runs = shape('CΔ7', {
      glyphChecker: { hasGlyph: () => true },
      unicodeFallback,
      useUnicodeModifiers: true,
    });

    expect(runs?.find(({ text }) => text === 'Δ')?.font.name).toBe('ChordSheetSymbols');
  });

  it('keeps a supported primary glyph when chord-symbol preference is disabled', () => {
    const runs = shape('CΔ7', {
      glyphChecker: { hasGlyph: () => true },
      unicodeFallback: { ...unicodeFallback, preferChordSymbols: false },
      useUnicodeModifiers: true,
    });

    expect(runs).toBeNull();
  });

  it('can apply Unicode fallback without chord-part styling', () => {
    const runs = shape('F♯', {
      glyphChecker: missingUnicodeGlyphs,
      unicodeFallback,
      useUnicodeModifiers: true,
    });

    expect(runs?.map(({ text }) => text)).toEqual(['F', '♯']);
    expect(runs?.[1].font.name).toBe('ChordSheetSymbols');
  });

  it.each(['bold', '600', '700'])('uses the bold fallback for string weight %s', (weight) => {
    const runs = shape('F♯', {
      chordFont: { ...chordFont, style: 'normal', weight },
      glyphChecker: missingUnicodeGlyphs,
      unicodeFallback,
      useUnicodeModifiers: true,
    });

    expect(runs?.[1].font).toMatchObject({
      name: 'ChordSheetSymbols',
      style: 'bold',
    });
  });

  it('falls back to plain rendering when unstyled, invalid, or without styled parts', () => {
    expect(shape('C7')).toBeNull();
    expect(shape('not a chord', { chordSuperscript: superscript })).toBeNull();
    expect(shape('Am', { chordRendering: { extensions: { fontSizeRatio: 0.7 } } })).toBeNull();
    expect(shape('|', { chordSuperscript: superscript })).toBeNull();
  });

  it('measures independently sized and raised runs as one chord box', () => {
    const runs = shape('Cmaj7', {
      chordRendering: {
        quality: { fontSizeRatio: 0.8 },
        extensions: { baselineShiftRatio: 0.35, fontSizeRatio: 0.7 },
      },
    })!;
    const metrics = getChordRunsMetrics(runs, (text, font) => ({
      width: text.length * font.size,
      height: font.size,
    }));

    expect(metrics).toEqual({
      width: 82,
      ascentHeight: 1,
      baselineHeight: 20,
      boxHeight: 21,
    });
  });

  it('accounts for a downward baseline shift below the root baseline', () => {
    const runs = shape('Cm7', {
      chordRendering: { extensions: { baselineShiftRatio: -0.4 } },
    })!;
    const metrics = getChordRunsMetrics(runs, (_text, font) => ({ width: font.size, height: font.size }));

    expect(metrics).toEqual({
      width: 60, ascentHeight: 0, baselineHeight: 20, boxHeight: 28,
    });
  });

  it('combines independently raised and lowered chord-part extents', () => {
    const runs = shape('Cm7', {
      chordRendering: {
        quality: { baselineShiftRatio: -0.4 },
        extensions: { baselineShiftRatio: 0.35, fontSizeRatio: 0.7 },
      },
    })!;
    const metrics = getChordRunsMetrics(runs, (_text, font) => ({ width: font.size, height: font.size }));

    expect(metrics).toEqual({
      width: 54, ascentHeight: 1, baselineHeight: 20, boxHeight: 29,
    });
  });
});
