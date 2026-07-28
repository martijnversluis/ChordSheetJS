import JsPDF from 'jspdf';

import DocWrapper from '../../../src/formatter/pdf_formatter/doc_wrapper';
import StubbedPdfDoc from '../../util/stubbed_pdf_doc';
import {
  ChordSheetSymbolsBold,
  ChordSheetSymbolsRegular,
} from '../../../src/formatter/pdf_formatter/fonts/ChordSheetSymbolsFonts.base64';

const fallbackFont = {
  name: 'ChordSheetSymbols',
  style: 'bold',
  size: 9,
  color: 'black',
};

describe('DocWrapper Unicode glyph support', () => {
  it.each(['normal', 'bold'])('registers all chord symbols for the %s face', (style) => {
    const doc = DocWrapper.setup(JsPDF as any);
    const font = { ...fallbackFont, style };

    [...'♭♮♯Δ∆△°ø⌀'].forEach((symbol) => {
      expect(doc.hasGlyph(symbol.codePointAt(0)!, font)).toBe(true);
    });
  });

  it('keeps both generated faces small', () => {
    expect(Buffer.from(ChordSheetSymbolsRegular, 'base64').length).toBeLessThan(5_000);
    expect(Buffer.from(ChordSheetSymbolsBold, 'base64').length).toBeLessThan(5_000);
  });

  it.each([
    ['NimbusSansL-Bol', 'normal', 'NimbusSansL-Reg.ttf'],
    ['NimbusSansL-Reg', 'bold', 'NimbusSansL-Bol.ttf'],
  ])('resolves a partial Nimbus face override for %s/%s', (name, style, postScriptName) => {
    const doc = DocWrapper.setup(JsPDF as any);

    doc.doc.setFont(name, style);

    expect(doc.doc.getFont()).toMatchObject({ fontName: name, fontStyle: style, postScriptName });
  });

  it('uses the intentionally widened flat metrics', () => {
    const doc = DocWrapper.setup(JsPDF as any);
    const flatWidth = doc.getTextWidth('♭', fallbackFont);
    const naturalWidth = doc.getTextWidth('♮', fallbackFont);

    expect(flatWidth).toBeGreaterThan(naturalWidth);
  });

  it.each(['normal', 'bold'])('keeps the raised sharp on the baseline in the %s face', (style) => {
    const doc = DocWrapper.setup(JsPDF as any);
    doc.doc.setFont('ChordSheetSymbols', style);
    const { metadata } = doc.doc.getFont();
    const glyphId = metadata.cmap.unicode.codeMap['♯'.codePointAt(0)!];
    const sharp = metadata.glyf.glyphFor(glyphId);

    expect(sharp.yMin).toBe(0);
    expect(metadata.hmtx.metrics[glyphId].advance).toBe(553);
  });

  it('uses distinct glyph IDs for each major-triangle code point', () => {
    const doc = DocWrapper.setup(JsPDF as any);
    doc.doc.setFont('ChordSheetSymbols', 'bold');
    const { codeMap } = doc.doc.getFont().metadata.cmap.unicode;
    const triangleGlyphs = [...'Δ∆△'].map((symbol) => codeMap[symbol.codePointAt(0)!]);

    expect(new Set(triangleGlyphs).size).toBe(3);
  });

  it('falls back to ASCII-only knowledge when font metadata is unavailable', () => {
    const doc = DocWrapper.setup(StubbedPdfDoc);

    expect(doc.hasGlyph('A'.codePointAt(0)!, fallbackFont)).toBe(true);
    expect(doc.hasGlyph('♯'.codePointAt(0)!, fallbackFont)).toBe(false);
  });
});
