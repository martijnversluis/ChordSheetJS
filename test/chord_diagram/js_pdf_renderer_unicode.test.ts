import DocWrapper from '../../src/formatter/pdf_formatter/doc_wrapper';
import JsPDFDiagramRenderer from '../../src/chord_diagram/js_pdf_renderer';
import StubbedPdfDoc from '../util/stubbed_pdf_doc';
import { defaultUnicodeFallbackConfig } from '../../src/formatter/configuration';

const titleFont = {
  name: 'NimbusSansL-Bol',
  style: 'bold',
  size: 9,
  color: 'black',
};

describe('JsPDF chord diagram Unicode rendering', () => {
  it('uses Unicode fallback runs for diagram titles', () => {
    const doc = DocWrapper.setup(StubbedPdfDoc);
    const renderer = new JsPDFDiagramRenderer(doc, {
      x: 0,
      y: 0,
      width: 150,
      fonts: {
        title: titleFont,
        fingerings: titleFont,
        baseFret: titleFont,
      },
      unicodeFallback: { ...defaultUnicodeFallbackConfig, warnOnMissingGlyph: false },
      useUnicodeModifiers: true,
    });

    renderer.text('F#7b9', { fontSize: 9, x: 75, y: 20 });
    const rendered = (doc.doc as StubbedPdfDoc).renderedItems.filter((item) => item.type === 'text') as any[];

    expect(rendered.map(({ text }) => text)).toEqual(['F', '♯', '7', '♭', '9']);
    expect(rendered.filter(({ text }) => text === '♯' || text === '♭')
      .every(({ fontName }) => fontName === 'NotoSansSymbols-Bold')).toBe(true);
  });
});
