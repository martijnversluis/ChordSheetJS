import '../matchers';
import { exampleSongSymbol } from '../fixtures/song';
import PdfFormatter from '../../src/formatter/pdf_formatter';
import defaultConfiguration from '../../src/formatter/pdf_formatter/default_configuration';
import StubbedPdfDoc from './stubbed_pdf_doc';

type ExpectedText = [string, number, number];
type ExpectedLine = [number, number, number, number];

describe('PdfFormatter', () => {
  it('correctly formats a basic song', () => {
    const formatter = new PdfFormatter();
    formatter.format(exampleSongSymbol, defaultConfiguration, StubbedPdfDoc);
    const document = formatter.doc as StubbedPdfDoc;

    const expectedText: ExpectedText[] = [
      ['Let it be', 25, 40],
      ['Key of C - BPM  - Time', 25, 53],
      ['By  ChordSheetJS example version', 25, 63],
      ['©2024 My Music Publishing', 25, 554],
      ['Written by: ', 25, 85],
      ['Verse 1', 25, 108],
      ['Let it ', 25, 138],
      ['Am', 54, 126],
      ['be', 54, 138],
      [', ', 79, 138],
      ['let it ', 25, 163],
      ['C/G', 50, 151],
      ['be', 50, 163],
      [', ', 78, 163],
      ['let it ', 85, 163],
      ['F', 110, 151],
      ['F', 110, 151],
      ['be', 110, 163],
      [', ', 124, 163],
      ['let it ', 130, 163],
      ['C', 156, 151],
      ['be', 156, 163],
      ['C', 25, 169],
      ['Whisper ', 25, 181],
      ['words of ', 72, 181],
      ['F', 121, 169],
      ['wis', 121, 181],
      ['G', 138, 169],
      ['dom', 138, 181],
      [', ', 161, 181],
      ['let it ', 168, 181],
      ['F', 193, 169],
      ['be ', 193, 181],
      ['C/E', 25, 194],
      ['Dm', 52, 194],
      ['C', 77, 194],
      ['Breakdown', 25, 217],
      ['Am', 25, 235],
      ['Whisper words of ', 25, 247],
      ['Bb', 121, 235],
      ['wisdom', 121, 247],
      [', ', 161, 247],
      ['let it ', 168, 247],
      ['F', 193, 235],
      ['be ', 193, 247],
      ['C', 25, 260],
      ['Tab 1', 25, 283],
      ['ABC 1', 25, 342],
      ['LY 1', 25, 401],
      ['Bridge 1', 25, 460],
      ['Bridge line', 25, 478],
      ['Grid 1', 25, 501],
    ];

    const expectedLines: ExpectedLine[] = [
      [25, 109, 65, 109],
      [25, 218, 85, 218],
      [25, 284, 54, 284],
      [25, 343, 59, 343],
      [25, 402, 48, 402],
      [25, 461, 69, 461],
      [25, 502, 58, 502],
    ];

    expectedText.forEach(([text, x, y]: ExpectedText) => {
      expect(document).toHaveText({ text, x, y });
    });

    expectedLines.forEach(([x1, y1, x2, y2]: ExpectedLine) => {
      expect(document).toHaveLine({ x1, y1, x2, y2 });
    });
  });
});
