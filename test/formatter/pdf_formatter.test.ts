import '../util/matchers';
import PdfFormatter from '../../src/formatter/pdf_formatter';
import Song from '../../src/chord_sheet/song';
import StubbedPdfDoc from '../util/stubbed_pdf_doc';

import { exampleSongSymbol } from '../fixtures/song';
import { LayoutConfig, LayoutEngine } from '../../src/layout/engine';
import { PDFConfigurationProperties, defaultUnicodeFallbackConfig } from '../../src/formatter/configuration';
import { chordLyricsPair, createSongFromAst } from '../util/utilities';

describe('PdfFormatter', () => {
  it('uses neutral chord rendering in its default configuration', () => {
    const formatter = new PdfFormatter();

    expect(formatter.configuration.chordRendering).toEqual({});
  });

  it('keeps responsive renderer and layout pagination in sync', () => {
    const computeLayouts = LayoutEngine.prototype.computeParagraphLayouts;
    let layoutConfig: LayoutConfig | undefined;
    const computeSpy = jest.spyOn(LayoutEngine.prototype, 'computeParagraphLayouts')
      .mockImplementation(function captureConfig(this: LayoutEngine) {
        layoutConfig = (this as any).config;
        return computeLayouts.call(this);
      });
    const formatter = new PdfFormatter({
      layout: {
        chordDiagrams: { enabled: false },
        sections: {
          global: {
            columnSpacing: 20,
            minColumnWidth: 150,
            maxColumnWidth: 200,
          },
        },
      },
    });
    const song = createSongFromAst(Array.from({ length: 100 }, (_, index) => [
      chordLyricsPair('C', `Line ${index + 1}`),
    ]).flatMap((line) => [line, []]));

    try {
      formatter.format(song, StubbedPdfDoc);

      const { renderer } = formatter as any;
      expect(renderer.dimensions.effectiveColumnCount).toBe(3);
      expect(layoutConfig?.columnCount).toBe(3);
      expect(renderer.currentPage).toBeGreaterThan(1);
      expect(renderer.totalPagesHint).toBe(renderer.currentPage);
    } finally {
      computeSpy.mockRestore();
    }
  });

  it('renders independently styled chord qualities and extensions end to end', () => {
    const song = createSongFromAst([[chordLyricsPair('Cmaj7/E', 'word')]]);
    const formatter = new PdfFormatter({
      chordRendering: {
        quality: { font: { weight: 500 }, fontSizeRatio: 0.84 },
        extensions: { baselineShiftRatio: 0.35, fontSizeRatio: 0.7 },
      },
      layout: { chordDiagrams: { enabled: false } },
      normalizeChordSuffix: false,
    });

    formatter.format(song, StubbedPdfDoc);
    const doc = formatter.getDocumentWrapper().doc as StubbedPdfDoc;
    const chordRuns = doc.renderedItems.filter((item) => (
      item.type === 'text' && ['C', 'maj', '7', '/E'].includes(item.text)
    )) as any[];

    expect(chordRuns.map(({ text }) => text)).toEqual(['C', 'maj', '7', '/E']);
    expect(chordRuns.map(({ fontSize }) => fontSize)).toEqual([9, 7.56, 6.3, 9]);
    expect(chordRuns[1]).toMatchObject({ fontName: 'NimbusSansL-Bol', fontStyle: 'normal' });
    expect(chordRuns[2].y).toBeLessThan(chordRuns[0].y);
  });

  it('uses bundled fallback fonts for Unicode accidentals end to end', () => {
    const song = createSongFromAst([[chordLyricsPair('F#7b9/C#', 'word')]]);
    const formatter = new PdfFormatter({
      useUnicodeModifiers: true,
      unicodeFallback: { ...defaultUnicodeFallbackConfig, warnOnMissingGlyph: false },
      layout: { chordDiagrams: { enabled: false } },
    });

    formatter.format(song, StubbedPdfDoc);
    const doc = formatter.getDocumentWrapper().doc as StubbedPdfDoc;
    const accidentals = doc.renderedItems.filter((item) => (
      item.type === 'text' && (item.text === '♯' || item.text === '♭')
    )) as any[];

    expect(accidentals.map(({ text }) => text)).toEqual(['♯', '♭', '♯']);
    expect(accidentals.every(({ fontName }) => fontName === 'ChordSheetSymbols')).toBe(true);
  });

  it('deep-merges partial Unicode fallback configuration', () => {
    const formatter = new PdfFormatter({
      unicodeFallback: { warnOnMissingGlyph: false },
    });

    expect(formatter.configuration.unicodeFallback).toEqual({
      ...defaultUnicodeFallbackConfig,
      warnOnMissingGlyph: false,
    });
  });

  it('deep-merges partial Unicode fallback font configuration', () => {
    const formatter = new PdfFormatter({
      unicodeFallback: { fallbackFonts: { bold: 'CustomBoldSymbols' } },
    });

    expect(formatter.configuration.unicodeFallback?.fallbackFonts).toEqual({
      ...defaultUnicodeFallbackConfig.fallbackFonts,
      bold: 'CustomBoldSymbols',
    });
  });

  it('deep-merges independent quality and extension rendering styles', () => {
    const formatter = new PdfFormatter({
      chordRendering: {
        quality: { font: { weight: 500 }, fontSizeRatio: 0.84 },
      },
    });

    formatter.configure({ chordRendering: { extensions: { baselineShiftRatio: 0.35 } } });

    expect(formatter.configuration.chordRendering).toEqual({
      quality: { font: { weight: 500 }, fontSizeRatio: 0.84 },
      extensions: { baselineShiftRatio: 0.35 },
    });
  });

  it('correctly formats a basic song', () => {
    const formatter = new PdfFormatter();
    formatter.format(exampleSongSymbol, StubbedPdfDoc);
    const doc = formatter.getDocumentWrapper().doc as StubbedPdfDoc;

    expect(doc).toHaveText('Written by: ', 45, 95);
    expect(doc).toHaveText('Verse 1', 45, 119);
    expect(doc).toHaveText('Let it ', 45, 144);
    expect(doc).toHaveText('Am', 69, 133);
    expect(doc).toHaveText('be,', 69, 144);
    expect(doc).toHaveText(' ', 84, 144);
    expect(doc).toHaveText('let it ', 87, 144);
    expect(doc).toHaveText('C/G', 108, 133);
    expect(doc).toHaveText('be,', 108, 144);
    expect(doc).toHaveText(' ', 129, 144);
    expect(doc).toHaveText('let it ', 132, 144);
    expect(doc).toHaveText('F', 153, 133);
    expect(doc).toHaveText('be,', 153, 144);
    expect(doc).toHaveText(' ', 167, 144);
    expect(doc).toHaveText('let it ', 169, 144);
    expect(doc).toHaveText('C', 191, 133);
    expect(doc).toHaveText('be', 191, 144);
    expect(doc).toHaveText('C', 45, 158);
    expect(doc).toHaveText('Whisper ', 45, 169);
    expect(doc).toHaveText('words of ', 84, 169);

    // Annotations like [*strong] not currently supported in PDF renderer

    // expect(doc).toHaveText('G', 125, 158);
    // expect(doc).toHaveText('wis', 125, 169);
    // expect(doc).toHaveText('A', 139, 158);
    // expect(doc).toHaveText('dom,', 139, 169);
    // expect(doc).toHaveText(' ', 162, 169);
    // expect(doc).toHaveText('let it ', 164, 169);
    // expect(doc).toHaveText('G', 186, 158);
    // expect(doc).toHaveText('be ', 186, 169);
    // expect(doc).toHaveText('D/F#', 199, 158);
    // expect(doc).toHaveText('Em', 224, 158);
    // expect(doc).toHaveText('D', 243, 158);
    // expect(doc).toHaveText('Breakdown', 45, 193);
    // expect(doc).toHaveText('Em', 45, 207);
    // expect(doc).toHaveText('Whisper words of ', 45, 218);
    // expect(doc).toHaveText('F', 125, 207);
    // expect(doc).toHaveText('wisdom,', 125, 218);
    // expect(doc).toHaveText(' ', 162, 218);
    // expect(doc).toHaveText('let it ', 164, 218);
    // expect(doc).toHaveText('C', 186, 207);
    // expect(doc).toHaveText('be ', 186, 218);
    // expect(doc).toHaveText('G', 199, 207);
    // expect(doc).toHaveText('Chorus 2', 45, 242);
    // expect(doc).toHaveText('G', 45, 256);
    // expect(doc).toHaveText('Whisper words of ', 45, 267);
    // expect(doc).toHaveText('F', 125, 256);
    // expect(doc).toHaveText('wisdom,', 125, 267);
    // expect(doc).toHaveText(' ', 162, 267);
    // expect(doc).toHaveText('let it ', 164, 267);
    // expect(doc).toHaveText('C', 186, 256);
    // expect(doc).toHaveText('be ', 186, 267);
    // expect(doc).toHaveText('G', 199, 256);
    // expect(doc).toHaveText('Solo 1', 45, 291);
    // expect(doc).toHaveText('G', 45, 305);
    // expect(doc).toHaveText('Solo line 1', 45, 316);
    // expect(doc).toHaveText('C', 45, 330);
    // expect(doc).toHaveText('Solo line 2', 45, 341);
    // expect(doc).toHaveText('Tab 1', 45, 365);
    // expect(doc).toHaveText('ABC 1', 45, 397);
    // expect(doc).toHaveText('LY 1', 45, 429);
    // expect(doc).toHaveText('Bridge 1', 45, 461);
    // expect(doc).toHaveText('Bridge line', 45, 475);
    // expect(doc).toHaveText('Grid 1', 45, 499);

    // Chord Diagrams
    expect(doc).toHaveText('Am', 54, 570);
    expect(doc).toHaveText('C/G', 95, 570);
    expect(doc).toHaveText('F', 142, 570);
    expect(doc).toHaveText('C', 184, 570);
    expect(doc).toHaveText('G', 225, 570);
    expect(doc).toHaveText('C/E', 263, 570);
    // Moved to next column
    expect(doc).toHaveText('Dm', 54, 640);
  });

  it('renders header content', () => {
    const formatter = new PdfFormatter();

    const song = new Song({
      key: 'Ab',
      tempo: '140',
      time: '7/8',
    });

    const config: PDFConfigurationProperties = {
      layout: {
        header: {
          height: 60,
          content: [
            {
              type: 'text',
              template: 'Key of %{key} - BPM %{tempo} - Time %{time}',
              style: {
                name: 'NimbusSansL-Reg', style: 'normal', size: 12, color: 100,
              },
              position: { x: 'left', y: 28 },
            },
          ],
        },
      },
    };

    formatter.configure(config).format(song, StubbedPdfDoc);
    const doc = formatter.getDocumentWrapper().doc as StubbedPdfDoc;

    expect(doc).toHaveText('Key of Ab - BPM 140 - Time 7/8', 45, 63);
  });

  it('renders footer content', () => {
    const formatter = new PdfFormatter();
    const song = new Song();

    const config: PDFConfigurationProperties = {
      layout: {
        header: {
          height: 60,
          content: [],
        },
        footer: {
          height: 60,
          content: [
            {
              type: 'text',
              template: 'Page %{page} of %{pages}',
              style: {
                name: 'NimbusSansL-Reg', style: 'normal', size: 12, color: 100,
              },
              position: { x: 'center', y: 28 },
            },
          ],
        },
      },
    };

    formatter.configure(config).format(song, StubbedPdfDoc);
    const doc = formatter.getDocumentWrapper().doc as StubbedPdfDoc;

    expect(doc.renderedItems).toHaveLength(1);

    expect(doc).toHaveText('Page 1 of 1', 275, 750);
  });

  it('uses an extra layout pass only for auto-height sections with total-page conditions', () => {
    const computeSpy = jest.spyOn(LayoutEngine.prototype, 'computeParagraphLayouts');
    const formatter = new PdfFormatter();
    const song = new Song();

    formatter.configure({
      layout: {
        footer: {
          height: 'auto',
          content: [
            {
              type: 'text',
              value: 'Last page footer',
              style: {
                name: 'NimbusSansL-Reg', style: 'normal', size: 12, color: 100,
              },
              position: { x: 'center', y: 28, height: 12 },
              condition: { page: { last: true } },
            },
          ],
        },
      },
    }).format(song, StubbedPdfDoc);

    expect(computeSpy).toHaveBeenCalledTimes(2);

    computeSpy.mockRestore();
  });

  it('keeps one layout pass for auto-height sections without total-page conditions', () => {
    const computeSpy = jest.spyOn(LayoutEngine.prototype, 'computeParagraphLayouts');
    const formatter = new PdfFormatter();
    const song = new Song();

    formatter.configure({
      layout: {
        header: {
          height: 'auto',
          content: [
            {
              type: 'text',
              value: 'First page header',
              style: {
                name: 'NimbusSansL-Reg', style: 'normal', size: 12, color: 100,
              },
              position: { x: 'left', y: 0, height: 12 },
              condition: { page: { first: true } },
            },
          ],
        },
      },
    }).format(song, StubbedPdfDoc);

    expect(computeSpy).toHaveBeenCalledTimes(1);

    computeSpy.mockRestore();
  });

  it('renders conditional content when the condition matches', () => {
    const formatter = new PdfFormatter();
    const song = new Song();

    const config: PDFConfigurationProperties = {
      layout: {
        header: {
          height: 60,
          content: [],
        },
        footer: {
          height: 60,
          content: [
            {
              type: 'text',
              template: 'Page %{page} of %{pages}',
              style: {
                name: 'NimbusSansL-Reg', style: 'normal', size: 12, color: 100,
              },
              position: { x: 'center', y: 28 },
              condition: {
                page: {
                  equals: 1,
                },
              },
            },
          ],
        },
      },
    };

    formatter.configure(config).format(song, StubbedPdfDoc);
    const doc = formatter.getDocumentWrapper().doc as StubbedPdfDoc;

    expect(doc.renderedItems).toHaveLength(1);

    expect(doc).toHaveText('Page 1 of 1', 275, 750);
  });

  it('does not render conditional content when the condition does not match', () => {
    const formatter = new PdfFormatter();
    const song = new Song();

    const config: PDFConfigurationProperties = {
      layout: {
        header: {
          height: 60,
          content: [],
        },
        footer: {
          height: 60,
          content: [
            {
              type: 'text',
              template: 'Page %{page} of %{pages}',
              style: {
                name: 'NimbusSansL-Reg', style: 'normal', size: 12, color: 100,
              },
              position: { x: 'center', y: 28 },
              condition: {
                page: { equals: 2 },
              },
            },
          ],
        },
      },
    };

    formatter.configure(config).format(song, StubbedPdfDoc);
    const doc = formatter.getDocumentWrapper().doc as StubbedPdfDoc;

    expect(doc.renderedItems).toHaveLength(0);
  });

  it('hides spefcific chord diagrams when using the global override', () => {
    const formatter = new PdfFormatter();
    const config: PDFConfigurationProperties = {
      layout: {
        chordDiagrams: {
          enabled: true,
          renderingConfig: {
            titleY: 28,
            neckWidth: 120,
            neckHeight: 160,
            nutThickness: 10,
            fretThickness: 4,
            nutColor: 0,
            fretColor: '#929292',
            stringIndicatorSize: 14,
            fingerIndicatorSize: 16,
            stringColor: 0,
            fingerIndicatorOffset: 0,
            stringThickness: 3,
            fretLineThickness: 4,
            openStringIndicatorThickness: 2,
            unusedStringIndicatorThickness: 2,
            markerThickness: 2,
            barreThickness: 2,
            titleFontSize: 48,
            baseFretFontSize: 8,
            fingerNumberFontSize: 28,
            showFingerNumbers: true,
            diagramSpacing: 7,
          },
          fonts: {
            title: {
              name: 'NimbusSansL-Bol', style: 'bold', size: 9, color: 'black',
            },
            fingerings: {
              name: 'NimbusSansL-Bol', style: 'bold', size: 6, color: 'black',
            },
            baseFret: {
              name: 'NimbusSansL-Bol', style: 'bold', size: 6, color: 'black',
            },
          },
          overrides: {
            global: {
              'G': {
                hide: true,
              },
            },
          },
        },
      },
    };
    formatter.configure(config).format(exampleSongSymbol, StubbedPdfDoc);
    const doc = formatter.getDocumentWrapper().doc as StubbedPdfDoc;

    expect(doc).toHaveText('Am', 54, 570);
    expect(doc).toHaveText('C/G', 95, 570);
    expect(doc).toHaveText('F', 142, 570);
    expect(doc).toHaveText('C', 184, 570);
    // expect(doc).toHaveText('G', 225, 570);
    expect(doc).toHaveText('C/E', 221, 570);
    // Moved to next column
    expect(doc).toHaveText('Dm', 264, 570);
  });
});
