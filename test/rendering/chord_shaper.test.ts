import { FontConfiguration } from '../../src/formatter/configuration';
import { buildChordRuns, getChordRunsMetrics } from '../../src/rendering/chord_shaper';

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
  warnOnMissingGlyph: true,
  fallbackFonts: {
    normal: 'NotoSansSymbols',
    bold: 'NotoSansSymbols-Bold',
    italic: 'NotoSansSymbols',
    bolditalic: 'NotoSansSymbols-Bold',
  },
};

const missingUnicodeGlyphs = {
  hasGlyph: (codePoint: number, font: FontConfiguration) => (
    codePoint < 128 || font.name.startsWith('NotoSansSymbols')
  ),
};

describe('chord shaper', () => {
  it.each([
    ['Cmaj7', ['C', 'maj7']],
    ['Am7', ['Am', '7']],
    ['F#dim7', ['F#dim', '7']],
  ])('raises only the extension in %s', (chord, expectedTexts) => {
    const runs = buildChordRuns(chord, false, superscript, chordFont);

    expect(runs?.map(({ text }) => text)).toEqual(expectedTexts);
    expect(runs?.map(({ superscript: raised }) => raised)).toEqual([false, true]);
    expect(runs?.[1]).toMatchObject({
      yOffset: -7,
      font: { size: 14 },
    });
  });

  it('keeps slash basses and optional parentheses on the baseline', () => {
    const slashRuns = buildChordRuns('Cmaj7/E', false, superscript, chordFont);
    const optionalRuns = buildChordRuns('(Dm11)', false, superscript, chordFont);

    expect(slashRuns?.map(({ text }) => text)).toEqual(['C', 'maj7', '/E']);
    expect(slashRuns?.map(({ superscript: raised }) => raised)).toEqual([false, true, false]);
    expect(optionalRuns?.map(({ text }) => text)).toEqual(['(Dm', '11', ')']);
  });

  it('accepts already-rendered Unicode accidentals', () => {
    const runs = buildChordRuns('F♯7', true, superscript, chordFont);

    expect(runs?.map(({ text }) => text)).toEqual(['F♯', '7']);
  });

  it('uses a style-matched fallback font for missing Unicode glyphs', () => {
    const runs = buildChordRuns(
      'F♯7♭9/C♯',
      true,
      superscript,
      chordFont,
      unicodeFallback,
      missingUnicodeGlyphs,
    );

    const accidentalRuns = runs?.filter(({ text }) => text === '♯' || text === '♭');
    expect(accidentalRuns?.map(({ font }) => font.name)).toEqual([
      'NotoSansSymbols-Bold',
      'NotoSansSymbols-Bold',
      'NotoSansSymbols-Bold',
    ]);
    expect(accidentalRuns?.[1].superscript).toBe(true);
  });

  it('can apply Unicode fallback without superscripting extensions', () => {
    const runs = buildChordRuns(
      'F♯',
      true,
      { ...superscript, enabled: false },
      chordFont,
      unicodeFallback,
      missingUnicodeGlyphs,
    );

    expect(runs?.map(({ text }) => text)).toEqual(['F', '♯']);
    expect(runs?.[1].font.name).toBe('NotoSansSymbols-Bold');
  });

  it.each(['bold', '600', '700'])('uses the bold fallback for string weight %s', (weight) => {
    const runs = buildChordRuns(
      'F♯',
      true,
      { ...superscript, enabled: false },
      { ...chordFont, style: 'normal', weight },
      unicodeFallback,
      missingUnicodeGlyphs,
    );

    expect(runs?.[1].font).toMatchObject({
      name: 'NotoSansSymbols-Bold',
      style: 'bold',
    });
  });

  it('falls back to plain rendering when disabled, invalid, or without extensions', () => {
    expect(buildChordRuns('C7', false, { ...superscript, enabled: false }, chordFont)).toBeNull();
    expect(buildChordRuns('not a chord', false, superscript, chordFont)).toBeNull();
    expect(buildChordRuns('Am', false, superscript, chordFont)).toBeNull();
    expect(buildChordRuns('|', false, superscript, chordFont)).toBeNull();
  });

  it('measures mixed-size runs as one chord box', () => {
    const runs = buildChordRuns('Cmaj7', false, superscript, chordFont)!;
    const metrics = getChordRunsMetrics(runs, (text, font) => ({
      width: text.length * font.size,
      height: font.size,
    }));

    expect(metrics).toEqual({
      width: 76,
      baselineHeight: 20,
      boxHeight: 21,
    });
  });
});
