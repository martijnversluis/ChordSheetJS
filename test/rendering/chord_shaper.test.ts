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
