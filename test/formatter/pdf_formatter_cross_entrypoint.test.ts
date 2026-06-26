import '../util/matchers';
import ChordProParser from '../../src/parser/chord_pro_parser';
import PdfFormatter from '../../src/formatter/pdf_formatter';
import StubbedPdfDoc from '../util/stubbed_pdf_doc';
import type { RenderedItem, RenderedText } from '../util/stubbed_pdf_doc';

function loadIsolatedParser(): typeof ChordProParser {
  let Parser!: typeof ChordProParser;

  jest.isolateModules(() => {
    Parser = jest.requireActual('../../src/parser/chord_pro_parser').default;
  });

  return Parser;
}

function loadIsolatedFormatter(): typeof PdfFormatter {
  let Formatter!: typeof PdfFormatter;

  jest.isolateModules(() => {
    Formatter = jest.requireActual('../../src/formatter/pdf_formatter').default;
  });

  return Formatter;
}

function renderedText(doc: StubbedPdfDoc): string {
  return doc.renderedItems
    .filter((item: RenderedItem): item is RenderedText => item.type === 'text')
    .map((item: RenderedText) => item.text)
    .join(' ');
}

describe('PdfFormatter across package entrypoints', () => {
  it('formats body content from a song parsed by a different module instance', () => {
    const Parser = loadIsolatedParser();
    const Formatter = loadIsolatedFormatter();
    const song = new Parser().parse(`
{title: Cross-entry PDF}
{start_of_verse: Verse 1}
[A]Let it [C]render
{end_of_verse}
`, { softLineBreaks: true });

    const formatter = new Formatter();
    formatter.format(song, StubbedPdfDoc);
    const doc = formatter.getDocumentWrapper().doc as StubbedPdfDoc;
    const text = renderedText(doc);

    expect(text).toContain('Cross-entry PDF');
    expect(text).toContain('Verse 1');
    expect(text).toContain('Let');
    expect(text).toContain('it');
    expect(text).toContain('render');
    expect(text).toContain('A');
    expect(text).toContain('C');
  });
});
