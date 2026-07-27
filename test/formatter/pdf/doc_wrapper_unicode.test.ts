import JsPDF from 'jspdf';

import DocWrapper from '../../../src/formatter/pdf_formatter/doc_wrapper';
import StubbedPdfDoc from '../../util/stubbed_pdf_doc';

const fallbackFont = {
  name: 'NotoSansSymbols-Bold',
  style: 'bold',
  size: 9,
  color: 'black',
};

describe('DocWrapper Unicode glyph support', () => {
  it('registers the bundled symbol font with sharp and flat glyphs', () => {
    const doc = DocWrapper.setup(JsPDF as any);

    expect(doc.hasGlyph('♯'.codePointAt(0)!, fallbackFont)).toBe(true);
    expect(doc.hasGlyph('♭'.codePointAt(0)!, fallbackFont)).toBe(true);
  });

  it('falls back to ASCII-only knowledge when font metadata is unavailable', () => {
    const doc = DocWrapper.setup(StubbedPdfDoc);

    expect(doc.hasGlyph('A'.codePointAt(0)!, fallbackFont)).toBe(true);
    expect(doc.hasGlyph('♯'.codePointAt(0)!, fallbackFont)).toBe(false);
  });
});
