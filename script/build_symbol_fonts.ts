import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

import { TTF, createFont } from 'fonteditor-core';

import packageJSON from '../package.json';

const ROOT = resolve(__dirname, '..');
const SOURCE_DIR = resolve(ROOT, 'script/font-sources/noto-sans-symbols');
const OUTPUT_MODULE = resolve(ROOT, 'src/formatter/pdf_formatter/fonts/ChordSheetSymbolsFonts.base64.ts');
const OUTPUT_DIR = resolve(ROOT, 'tmp/chordsheet-symbol-fonts');
const FONTEDITOR_VERSION = packageJSON.devDependencies['fonteditor-core'];
const FONT_FAMILY = 'ChordSheet Symbols';
const POSTSCRIPT_FAMILY = 'ChordSheetSymbols';
const COPYRIGHT =
  'Copyright 2022 The Noto Project Authors; modifications copyright 2026 ChordSheetJS contributors';
const FLAT_X_SCALE = 1.38;
const FLAT_Y_SCALE = 1.3225;
const SHARP_BASELINE = 0;
const SOURCE_UNICODES = [0x0020, 0x00B0, 0x00F8, 0x2300, 0x266D, 0x266E, 0x266F];
const TRIANGLE_UNICODES = [0x0394, 0x2206, 0x25B3];
const SOURCE_HASHES = {
  Regular: 'aedeec1cd0514930aeeafc4a88a6deff83cda1e6b58086f0b9bb9c7dd0157578',
  Bold: '5682f6c88d6199623edf026f67a8722697e8c5f409e5249477594e409d657eb0',
} as const;

type FontStyle = keyof typeof SOURCE_HASHES;

export interface SymbolFontBuild {
  regular: Buffer;
  bold: Buffer;
  module: string;
}

function getGlyph(font: TTF.TTFObject, codePoint: number): TTF.Glyph {
  const glyph = font.glyf.find(({ unicode }) => unicode?.includes(codePoint));
  if (!glyph) throw new Error(`Source font does not contain U+${codePoint.toString(16).toUpperCase()}`);
  return glyph;
}

function withContoursAndBounds(glyph: TTF.Glyph, contours: TTF.Contour[]): TTF.Glyph {
  const points = contours.flat();
  if (points.length === 0) return { ...glyph, contours };
  return {
    ...glyph,
    contours,
    xMin: Math.min(...points.map(({ x }) => x)),
    yMin: Math.min(...points.map(({ y }) => y)),
    xMax: Math.max(...points.map(({ x }) => x)),
    yMax: Math.max(...points.map(({ y }) => y)),
  };
}

function transformFlat(glyph: TTF.Glyph): TTF.Glyph {
  const contours = glyph.contours.map((contour) => contour.map((point) => ({
    ...point,
    x: Math.round(point.x * FLAT_X_SCALE),
    y: Math.round(point.y * FLAT_Y_SCALE),
  })));
  return withContoursAndBounds({
    ...glyph,
    advanceWidth: Math.round(glyph.advanceWidth * FLAT_X_SCALE),
    leftSideBearing: Math.round(glyph.leftSideBearing * FLAT_X_SCALE),
  }, contours);
}

function translateSharp(glyph: TTF.Glyph): TTF.Glyph {
  const yShift = SHARP_BASELINE - glyph.yMin;
  const contours = glyph.contours.map((contour) => contour.map((point) => ({
    ...point,
    y: point.y + yShift,
  })));
  return withContoursAndBounds(glyph, contours);
}

function triangleGlyph(codePoint: number, bold: boolean): TTF.Glyph {
  const outerLeft = 40;
  const outerRight = 560;
  const apex = 300;
  const baseline = 20;
  const innerLeft = bold ? 155 : 130;
  const innerRight = bold ? 445 : 470;
  const innerBottom = bold ? 125 : 95;
  const innerTop = bold ? 465 : 510;
  const onCurve = true;
  const glyph: TTF.Glyph = {
    name: `chordMajor${codePoint.toString(16).toUpperCase()}`,
    unicode: [codePoint],
    advanceWidth: 600,
    leftSideBearing: outerLeft,
    xMin: outerLeft,
    yMin: baseline,
    xMax: outerRight,
    yMax: 700,
    contours: [
      [
        { x: outerLeft, y: baseline, onCurve },
        { x: outerRight, y: baseline, onCurve },
        { x: apex, y: 700, onCurve },
      ],
      [
        { x: innerLeft, y: innerBottom, onCurve },
        { x: apex, y: innerTop, onCurve },
        { x: innerRight, y: innerBottom, onCurve },
      ],
    ],
  };
  return glyph;
}

function customizedGlyphs(font: TTF.TTFObject, style: FontStyle): TTF.Glyph[] {
  const flat = getGlyph(font, 0x266D);
  const sharp = getGlyph(font, 0x266F);
  const sourceGlyphs = font.glyf.map((glyph) => {
    if (glyph === flat) return transformFlat(glyph);
    if (glyph === sharp) return translateSharp(glyph);
    return glyph;
  });
  const triangles = TRIANGLE_UNICODES.map((codePoint) => triangleGlyph(codePoint, style === 'Bold'));
  return [...sourceGlyphs, ...triangles];
}

function fontNames(names: TTF.Name, style: FontStyle): TTF.Name {
  return {
    ...names,
    copyright: COPYRIGHT,
    fontFamily: FONT_FAMILY,
    fontSubFamily: style,
    uniqueSubFamily: `ChordSheetJS:${POSTSCRIPT_FAMILY}-${style}`,
    fullName: `${FONT_FAMILY} ${style}`,
    version: 'Version 1.000',
    postScriptName: `${POSTSCRIPT_FAMILY}-${style}`,
    preferredFamily: FONT_FAMILY,
    preferredSubFamily: style,
  };
}

function buildFace(style: FontStyle): Buffer {
  const sourcePath = resolve(SOURCE_DIR, `NotoSansSymbols-${style}.ttf`);
  const source = readFileSync(sourcePath);
  const actualHash = createHash('sha256').update(source).digest('hex');
  if (actualHash !== SOURCE_HASHES[style]) {
    throw new Error(`Unexpected SHA-256 for ${sourcePath}: ${actualHash}`);
  }

  const parsed = createFont(source, { type: 'ttf', subset: SOURCE_UNICODES, hinting: false });
  const font = parsed.get();
  font.glyf = customizedGlyphs(font, style);
  font.head.fontRevision = 1;
  font.name = fontNames(font.name, style);
  return parsed.write({
    type: 'ttf', hinting: false, kerning: false, toBuffer: true,
  });
}

function encodeModule(regular: Buffer, bold: Buffer): string {
  const header =
    '// Generated by script/build_symbol_fonts.ts. Do not edit directly.\n' +
    `// fonteditor-core ${FONTEDITOR_VERSION}; flat scale ${FLAT_X_SCALE}x/${FLAT_Y_SCALE}y; ` +
    `sharp baseline ${SHARP_BASELINE}.\n`;
  return (
    `${header}export const ChordSheetSymbolsRegular = '${regular.toString('base64')}';\n\n` +
    `export const ChordSheetSymbolsBold = '${bold.toString('base64')}';\n`
  );
}

export function buildSymbolFonts(): SymbolFontBuild {
  const regular = buildFace('Regular');
  const bold = buildFace('Bold');
  return { regular, bold, module: encodeModule(regular, bold) };
}

export function writeSymbolFonts(): void {
  const built = buildSymbolFonts();
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(resolve(OUTPUT_DIR, `${POSTSCRIPT_FAMILY}-Regular.ttf`), built.regular);
  writeFileSync(resolve(OUTPUT_DIR, `${POSTSCRIPT_FAMILY}-Bold.ttf`), built.bold);
  writeFileSync(OUTPUT_MODULE, built.module, 'utf8');
  console.log(`Wrote ${OUTPUT_MODULE}`);
  console.log(`Regular: ${built.regular.length} bytes; Bold: ${built.bold.length} bytes`);
}

if (require.main === module) {
  writeSymbolFonts();
}
