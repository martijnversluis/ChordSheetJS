import { createHash } from 'node:crypto';

import { TTF, createFont } from 'fonteditor-core';

import { buildSymbolFonts } from '../../script/build_symbol_fonts';

const EXPECTED_CODE_POINTS = [
  0x0020,
  0x00B0,
  0x00F8,
  0x0394,
  0x2206,
  0x2300,
  0x25B3,
  0x266D,
  0x266E,
  0x266F,
];

const EXPECTED_GLYPHS = {
  Regular: {
    '20': [260, 0, null, null, null, null, '4f53cda18c2baa0c'],
    'B0': [428, 55, 55, 417, 373, 724, 'be588c77d9f77d8f'],
    'F8': [605, 55, 55, -33, 551, 566, '1aa6323e6c2aba40'],
    '394': [600, 40, 40, 20, 560, 700, '2085f806aca0f367'],
    '2206': [600, 40, 40, 20, 560, 700, '2085f806aca0f367'],
    '2300': [571, 51, 51, 116, 520, 586, '2cc605c9f5c73434'],
    '25B3': [600, 40, 40, 20, 560, 700, '2085f806aca0f367'],
    '266D': [479, 70, 70, -33, 408, 772, '5cfc1904fd5789f0'],
    '266E': [357, 51, 51, -213, 306, 404, '99e2a0a40032e47d'],
    '266F': [553, 51, 51, 0, 502, 823, 'd933dff46522b669'],
  },
  Bold: {
    '20': [260, 0, null, null, null, null, '4f53cda18c2baa0c'],
    'B0': [424, 40, 40, 386, 384, 724, 'df68221e33b621b3'],
    'F8': [642, 47, 47, -48, 594, 586, '64a1920d673f3e4e'],
    '394': [600, 40, 40, 20, 560, 700, 'e0045f57d211806e'],
    '2206': [600, 40, 40, 20, 560, 700, 'e0045f57d211806e'],
    '2300': [571, 40, 40, 100, 533, 601, '84043408c18ce564'],
    '25B3': [600, 40, 40, 20, 560, 700, 'e0045f57d211806e'],
    '266D': [479, 51, 51, -30, 428, 788, 'c81daa1f4f46acb6'],
    '266E': [357, 37, 37, -200, 320, 423, '8d32d380bc21d408'],
    '266F': [553, 43, 43, 0, 510, 817, 'eb2c9132d260b1d4'],
  },
};

function parse(buffer: Buffer): TTF.TTFObject {
  return createFont(buffer, { type: 'ttf' }).get();
}

function codePoints(font: TTF.TTFObject): number[] {
  return font.glyf.flatMap(({ unicode }) => unicode || []).sort((a, b) => a - b);
}

function glyphManifest(font: TTF.TTFObject): Record<string, unknown[]> {
  return Object.fromEntries(font.glyf.flatMap((glyph) => (glyph.unicode || []).map((codePoint) => [
    codePoint.toString(16).toUpperCase(),
    [
      glyph.advanceWidth,
      glyph.leftSideBearing,
      glyph.xMin ?? null,
      glyph.yMin ?? null,
      glyph.xMax ?? null,
      glyph.yMax ?? null,
      createHash('sha256').update(JSON.stringify(glyph.contours)).digest('hex').slice(0, 16),
    ],
  ])));
}

describe('symbol font builder', () => {
  it('builds deterministic output', () => {
    const first = buildSymbolFonts();
    const second = buildSymbolFonts();

    expect(second.regular.equals(first.regular)).toBe(true);
    expect(second.bold.equals(first.bold)).toBe(true);
    expect(second.module).toBe(first.module);
  });

  it.each([
    ['Regular', 'regular'],
    ['Bold', 'bold'],
  ] as const)('builds the exact %s symbol set and metadata', (style, face) => {
    const font = parse(buildSymbolFonts()[face]);

    expect(codePoints(font)).toEqual(EXPECTED_CODE_POINTS);
    expect(font.name).toMatchObject({
      fontFamily: 'ChordSheet Symbols',
      fontSubFamily: style,
      postScriptName: `ChordSheetSymbols-${style}`,
      version: 'Version 1.000',
    });
    expect(glyphManifest(font)).toEqual(EXPECTED_GLYPHS[style]);
  });
});
