import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { buildSymbolFonts } from './build_symbol_fonts';

const ROOT = resolve(__dirname, '..');
const GENERATED = resolve(ROOT, 'src/formatter/pdf_formatter/fonts/ChordSheetSymbolsFonts.base64.ts');
const expected = buildSymbolFonts().module;
const actual = readFileSync(GENERATED, 'utf8');

if (actual !== expected) {
  console.error('ChordSheet Symbols output is stale. Run: yarn unibuild build symbolFonts --force');
  process.exit(1);
}

console.log('ChordSheet Symbols output is current.');
