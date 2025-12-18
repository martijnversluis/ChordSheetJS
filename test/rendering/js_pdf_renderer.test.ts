import ChordDefinition from '../../src/chord_definition/chord_definition';
import JsPdfRenderer from '../../src/rendering/pdf/js_pdf_renderer';
import LayoutSectionRenderer from '../../src/rendering/shared/layout_section_renderer';
import Song from '../../src/chord_sheet/song';
import StubbedPdfDoc from '../util/stubbed_pdf_doc';

import { ParagraphLayout } from '../../src/rendering/renderer';
import {
  PDFFormatterConfiguration,
  getPDFDefaultConfig,
} from '../../src/formatter/configuration';

interface ConditionCall {
  rule: any;
  metadata: Record<string, any>;
  evaluate: jest.Mock;
}

interface RendererSetup {
  renderer: JsPdfRenderer;
  song: Song;
  config: PDFFormatterConfiguration;
  doc: any;
  pageSize: { width: number; height: number };
}

const parseMock = jest.fn();
const formatMock = jest.fn();
const getCaposMock = jest.fn();
const conditionCalls: ConditionCall[] = [];
let conditionEvaluator: ((rule: any, metadata: Record<string, any>) => boolean) | null = null;

jest.mock('../../src/index', () => {
  const chordLyricsPair = jest.requireActual('../../src/chord_sheet/chord_lyrics_pair').default;
  const softLineBreak = jest.requireActual('../../src/chord_sheet/soft_line_break').default;
  const tag = jest.requireActual('../../src/chord_sheet/tag').default;

  return {
    __esModule: true,
    ChordLyricsPair: chordLyricsPair,
    SoftLineBreak: softLineBreak,
    Tag: tag,
  } as const;
});

jest.mock('../../src/parser/chord_pro_parser', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    parse: parseMock,
  })),
}));

jest.mock('../../src/formatter/text_formatter', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    format: formatMock,
  })),
}));

jest.mock('../../src/helpers', () => ({
  getCapos: (key: string) => getCaposMock(key),
}));

jest.mock('../../src/layout/engine/condition', () => ({
  __esModule: true,
  default: jest.fn((rule: any, metadata: Record<string, any>) => {
    const evaluate = jest.fn(() => (conditionEvaluator ?
      conditionEvaluator(rule, metadata) :
      true));
    conditionCalls.push({ rule, metadata, evaluate });
    return { evaluate };
  }),
}));

function deepMerge<T>(target: T, source: Partial<T>): T {
  const result: any = Array.isArray(target) ? [...(target as any)] : { ...(target as any) };

  Object.entries(source).forEach(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const baseValue = result[key] ?? {};
      result[key] = deepMerge(baseValue, value as any);
    } else {
      result[key] = value;
    }
  });

  return result;
}

function createBaseConfig(): PDFFormatterConfiguration {
  const defaults = getPDFDefaultConfig();
  const clone = JSON.parse(JSON.stringify(defaults)) as PDFFormatterConfiguration;

  return deepMerge(clone, {
    fonts: {
      text: {
        name: 'TestText', style: 'normal', size: 12, color: '#111111',
      },
      chord: {
        name: 'TestChord', style: 'bold', size: 10, color: '#222222',
      },
      sectionLabel: {
        name: 'TestSection', style: 'bold', size: 11, color: '#333333', underline: true,
      },
      comment: {
        name: 'TestComment', style: 'italic', size: 10, color: '#444444',
      },
      metadata: {
        name: 'TestMeta', style: 'normal', size: 9, color: '#555555',
      },
      subtitle: {
        name: 'TestSubtitle', style: 'normal', size: 9, color: '#666666',
      },
      title: {
        name: 'TestTitle', style: 'bold', size: 18, color: '#777777',
      },
      annotation: {
        name: 'TestAnnotation', style: 'normal', size: 8, color: '#888888',
      },
    },
    layout: {
      global: {
        margins: {
          top: 40,
          bottom: 30,
          left: 36,
          right: 36,
        },
      },
      header: {
        height: 50,
        content: [],
      },
      footer: {
        height: 40,
        content: [],
      },
      sections: {
        global: {
          paragraphSpacing: 12,
          linePadding: 4,
          chordLyricSpacing: 6,
          chordSpacing: 3,
          columnCount: 2,
          columnWidth: 0,
          columnSpacing: 18,
          minColumnWidth: 150,
          maxColumnWidth: 260,
        },
        base: {
          display: {
            lyricsOnly: false,
            repeatedSections: 'full',
          },
        },
      },
      chordDiagrams: {
        enabled: true,
        fonts: {
          title: {
            name: 'DiagramTitle', style: 'bold', size: 8, color: '#000000',
          },
          fingerings: {
            name: 'DiagramFinger', style: 'bold', size: 6, color: '#000000',
          },
          baseFret: {
            name: 'DiagramBase', style: 'bold', size: 6, color: '#000000',
          },
        },
        overrides: {
          global: {},
          byKey: {},
        },
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
          titleFontSize: 32,
          baseFretFontSize: 10,
          fingerNumberFontSize: 16,
          showFingerNumbers: true,
          diagramSpacing: 10,
          maxDiagramsPerRow: 3,
        },
      },
    },
    normalizeChords: false,
    useUnicodeModifiers: false,
    measurer: 'jspdf',
  });
}

function createRenderer(
  overrides: Partial<PDFFormatterConfiguration> = {},
): RendererSetup {
  const config = deepMerge(createBaseConfig(), overrides);
  const song = new Song({
    title: 'Test Song',
    artist: 'Tester',
    key: 'C',
    capo: '1',
  });

  song.metadata.set('capo', '1');
  song.metadata.set('key', 'C');

  const renderer = new JsPdfRenderer(song, StubbedPdfDoc as any, config);
  const doc = renderer.getDoc();
  const pageSize = { width: 600, height: 800 };
  const pageSizeInternal = (doc as any).doc.internal.pageSize;
  pageSizeInternal.width = pageSize.width;
  pageSizeInternal.height = pageSize.height;

  return {
    renderer,
    song,
    config,
    doc,
    pageSize,
  };
}

function createParagraphLayouts(units: any[][] = []): ParagraphLayout[] {
  return [
    {
      units: units as any,
      addSpacing: false,
      sectionType: 'verse',
    },
  ];
}

function getStubDoc(doc: any): StubbedPdfDoc {
  return (doc as any).doc as StubbedPdfDoc;
}

describe('JsPdfRenderer', () => {
  beforeEach(() => {
    parseMock.mockReset();
    parseMock.mockImplementation((template: string) => ({ template }));

    formatMock.mockReset();
    formatMock.mockImplementation((parsed: { template: string }) => parsed.template.replace('%{title}', 'Test Song'));

    getCaposMock.mockReset();
    getCaposMock.mockImplementation(() => ({
      0: 'C',
      1: 'Db',
      2: 'D',
      3: 'Eb',
      4: 'E',
    }));

    conditionCalls.length = 0;
    conditionEvaluator = null;
  });

  it('instantiates with doc wrapper and exposes fonts', () => {
    const {
      renderer,
      doc,
      config,
      pageSize,
    } = createRenderer();

    expect(renderer.getDoc()).toBe(doc);
    expect(doc.pageSize.width).toBe(pageSize.width);
    expect(doc.pageSize.height).toBe(pageSize.height);
    expect(renderer.getFontConfiguration('chord')).toEqual(config.fonts.chord);
    expect(renderer.getFontConfiguration('text')).toEqual(config.fonts.text);
  });

  describe('metadata and configuration', () => {
    it('provides document metadata after render', () => {
      const {
        renderer,
        doc,
        pageSize,
      } = createRenderer();

      const layouts = createParagraphLayouts();
      renderer.render(layouts);

      const metadata = renderer.getDocumentMetadata();
      const { dimensions } = renderer as any;

      expect(metadata.pageWidth).toBe(pageSize.width);
      expect(metadata.pageHeight).toBe(pageSize.height);
      expect(metadata.marginLeft).toBe(dimensions.margins.left);
      expect(metadata.marginRight).toBe(dimensions.margins.right);
      expect(metadata.marginTop).toBe(dimensions.margins.top);
      expect(metadata.marginBottom).toBe(dimensions.margins.bottom);
      expect(metadata.columnWidth).toBe(dimensions.columnWidth);
      expect(metadata.columnCount).toBe(dimensions.effectiveColumnCount);
      expect(metadata.currentPage).toBe(doc.currentPage);
      expect(metadata.totalPages).toBe(doc.totalPages);
      expect(metadata.renderTime).toBe(renderer.getRenderTime());
      expect(metadata.dimensions).toBe(dimensions);
    });
  });

  describe('backend operations', () => {
    it('initializes backend without throwing', () => {
      const { renderer } = createRenderer();
      expect(() => (renderer as any).initializeBackend()).not.toThrow();
    });

    it('creates new pages via doc wrapper', () => {
      const { renderer, doc } = createRenderer();
      const originalTotalPages = doc.totalPages;

      (renderer as any).createNewPage();

      expect(doc.totalPages).toBe(originalTotalPages + 1);
      expect(doc.currentPage).toBe(originalTotalPages + 1);
    });

    it('saves PDFs through the wrapper', () => {
      const { renderer, doc } = createRenderer();
      const stubDoc = getStubDoc(doc);

      renderer.save('file.pdf');

      expect(stubDoc.filename).toBe('file.pdf');
    });

    it('generates a PDF blob with output()', async () => {
      const { renderer } = createRenderer();

      const blob = await renderer.generatePDF();

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThanOrEqual(0);
    });
  });

  describe('chord diagrams', () => {
    it('renders diagrams with spacing and wrapping across rows and columns', () => {
      const diagramOverrides = {
        layout: {
          chordDiagrams: {
            renderingConfig: {
              diagramSpacing: 12,
              maxDiagramsPerRow: 2,
            },
          },
        },
      } as Partial<PDFFormatterConfiguration>;

      const {
        renderer,
        doc,
      } = createRenderer(diagramOverrides);

      const definitions = [
        ChordDefinition.parse('C base-fret 1 frets x 3 2 0 1 0 fingers x 3 2 0 1 0'),
        ChordDefinition.parse('G base-fret 1 frets 3 2 0 0 0 3 fingers 2 1 0 0 0 3'),
        ChordDefinition.parse('Am base-fret 1 frets x 0 2 2 1 0 fingers x 0 2 3 1 0'),
        ChordDefinition.parse('F base-fret 1 frets 1 3 3 2 1 1 fingers 1 3 4 2 1 1'),
      ];

      // Mock song.getChords to return our test chords
      (renderer as any).song.getChords = jest.fn(() => definitions.map((d) => d.name));
      (renderer as any).song.chordDefinitions.withDefaults = jest.fn(() => ({
        get: (name: string) => definitions.find((d) => d.name === name) || null,
      }));

      (renderer as any).renderChordDiagrams();

      const stubDoc = getStubDoc(doc);
      const textRenderItems = stubDoc.renderedItems.filter((item) => item.type === 'text') as any[];
      const definedChordNames = new Set(definitions.map((definition) => definition.name));
      const titleItems = textRenderItems.filter((item) => definedChordNames.has(item.text));

      expect(titleItems).toHaveLength(definitions.length);
      const firstRowY = titleItems[0].y as number;
      const secondRowY = titleItems[2].y as number;
      const horizontalSpacing = (titleItems[1].x as number) - (titleItems[0].x as number);

      expect(horizontalSpacing).toBeGreaterThan(12);
      expect(secondRowY).toBeGreaterThan(firstRowY);

      const {
        renderer: nearBottomRenderer,
      } = createRenderer(diagramOverrides);

      (nearBottomRenderer as any).y = (nearBottomRenderer as any).getColumnBottomY() - 5;
      (nearBottomRenderer as any).getChordDefinitions = jest.fn(() => definitions.slice(0, 1));

      (nearBottomRenderer as any).renderChordDiagrams();

      expect((nearBottomRenderer as any).currentColumn).toBeGreaterThan(1);
    });

    it('applies chord overrides for hiding and custom definitions', () => {
      const overrides = {
        layout: {
          chordDiagrams: {
            overrides: {
              global: {
                C: {
                  hide: true,
                  definition: 'C base-fret 1 frets x 3 2 0 1 0 fingers x 3 2 0 1 0',
                },
                Am: {
                  hide: true,
                },
              },
              byKey: {
                G: {
                  C: {
                    hide: false,
                    definition: 'C base-fret 3 frets x 3 5 5 5 3 fingers x 1 3 4 5 1',
                  },
                },
              },
            },
          },
        },
      } as any;

      const setup = createRenderer(overrides);
      const { renderer, doc, song } = setup;
      song.metadata.set('key', 'G');

      const definitions = [
        ChordDefinition.parse('C base-fret 1 frets x 3 2 0 1 0 fingers x 3 2 0 1 0'),
        ChordDefinition.parse('G base-fret 1 frets 3 2 0 0 0 3 fingers 2 1 0 0 0 3'),
        ChordDefinition.parse('Am base-fret 1 frets x 0 2 2 1 0 fingers x 0 2 3 1 0'),
      ];

      // Mock song.getChords to return our test chords
      (renderer as any).song.getChords = jest.fn(() => definitions.map((d) => d.name));
      (renderer as any).song.chordDefinitions.withDefaults = jest.fn(() => ({
        get: (name: string) => definitions.find((d) => d.name === name) || null,
      }));

      (renderer as any).renderChordDiagrams();

      // Verify that diagrams were rendered (Am should be hidden, C and G should be shown)
      const renderedChordNames = getStubDoc(doc).renderedItems
        .filter((item) => item.type === 'text')
        .map((item: any) => item.text);

      expect(renderedChordNames).toContain('C');
      expect(renderedChordNames).toContain('G');
      expect(renderedChordNames).not.toContain('Am');
    });
  });

  describe('headers and footers', () => {
    it('renders header and footer layouts for each page', () => {
      const baseLayout = createBaseConfig().layout;
      const overrides: Partial<PDFFormatterConfiguration> = {
        layout: {
          ...baseLayout,
          header: {
            ...baseLayout.header,
            height: 30,
            content: [
              {
                type: 'text',
                value: 'Header',
                style: {
                  name: 'Test', style: 'normal', size: 12, color: '#000',
                },
                position: { x: 'left', y: 5 },
              },
            ],
          },
          footer: {
            ...baseLayout.footer,
            height: 20,
            content: [
              {
                type: 'text',
                value: 'Footer',
                style: {
                  name: 'Test', style: 'normal', size: 10, color: '#000',
                },
                position: { x: 'left', y: 5 },
              },
            ],
          },
        } as any,
      };

      const { renderer, doc } = createRenderer(overrides);
      const docWrapper = renderer.getDoc();
      docWrapper.totalPages = 3;

      (renderer as any).renderHeadersAndFooters();

      // Verify that headers and footers were rendered for each page
      const stubDoc = getStubDoc(doc);
      const textItems = stubDoc.renderedItems.filter((item) => item.type === 'text') as any[];
      const headerItems = textItems.filter((item) => item.text === 'Header');
      const footerItems = textItems.filter((item) => item.text === 'Footer');

      expect(headerItems).toHaveLength(3);
      expect(footerItems).toHaveLength(3);
    });

    it('evaluates layout content conditions before rendering', () => {
      const conditionRule = { capoKey: { equals: 'Db' } };
      const baseLayout = createBaseConfig().layout;
      const layoutOverrides: Partial<PDFFormatterConfiguration> = {
        layout: {
          ...baseLayout,
          header: {
            ...baseLayout.header,
            height: 25,
            content: [
              {
                type: 'text',
                value: 'Capo Info',
                style: {
                  name: 'TestTitle',
                  style: 'bold',
                  size: 16,
                  color: '#777777',
                },
                position: {
                  x: 10,
                  y: 5,
                  width: 200,
                },
                condition: conditionRule,
              },
            ],
          },
        } as any,
      };

      const {
        renderer, doc, config, song,
      } = createRenderer(layoutOverrides);
      const stubDoc = getStubDoc(doc);
      conditionEvaluator = (rule, metadata) => {
        expect(rule).toBe(conditionRule);
        expect(metadata.capoKey).toBe('Db');
        return false;
      };

      // Create a LayoutSectionRenderer and test it directly
      const layoutRenderer = new LayoutSectionRenderer(
        {
          pageSize: renderer.getDoc().pageSize,
          currentPage: 1,
          totalPages: 1,
          text: (content, x, y) => renderer.getDoc().text(content, x, y),
          getTextWidth: (text) => renderer.getDoc().getTextWidth(text),
          splitTextToSize: (text, maxWidth) => renderer.getDoc().splitTextToSize(text, maxWidth),
          setFontStyle: (style) => renderer.getDoc().setFontStyle(style),
          addImage: () => {},
          line: () => {},
          setLineStyle: () => {},
          resetDash: () => {},
        },
        {
          metadata: song.metadata,
          margins: config.layout.global.margins,
          extraMetadata: { capoKey: 'Db' },
        },
      );

      layoutRenderer.renderLayout(config.layout.header, 'header');

      expect(conditionCalls).toHaveLength(1);
      expect(stubDoc.renderedItems.filter((item) => item.type === 'text')).toHaveLength(0);
    });
  });

  describe('text rendering', () => {
    it('renders multiline text with spacing based on font settings', () => {
      const {
        renderer, doc, config, song,
      } = createRenderer();
      const stubDoc = getStubDoc(doc);

      // Create a LayoutSectionRenderer to test text rendering
      const layoutRenderer = new LayoutSectionRenderer(
        {
          pageSize: renderer.getDoc().pageSize,
          currentPage: 1,
          totalPages: 1,
          text: (content, x, y) => renderer.getDoc().text(content, x, y),
          getTextWidth: (text) => renderer.getDoc().getTextWidth(text),
          splitTextToSize: (text, maxWidth) => renderer.getDoc().splitTextToSize(text, maxWidth),
          setFontStyle: (style) => renderer.getDoc().setFontStyle(style),
          addImage: () => {},
          line: () => {},
          setLineStyle: () => {},
          resetDash: () => {},
        },
        {
          metadata: song.metadata,
          margins: config.layout.global.margins,
          extraMetadata: {},
        },
      );

      const headerWithText = {
        height: 50,
        content: [
          {
            type: 'text' as const,
            value: 'This is a long line of text that should wrap into multiple lines when rendered.',
            style: {
              ...config.fonts.title,
              size: 14,
              lineHeight: 1.4,
            },
            position: {
              x: 20 as any,
              y: 15,
              width: 120,
            },
          },
        ],
      };

      layoutRenderer.renderLayout(headerWithText, 'header');

      const textItems = stubDoc.renderedItems.filter((item) => item.type === 'text');

      expect(textItems.length).toBeGreaterThan(1);
      const [firstLine, secondLine] = textItems as any[];
      expect(firstLine.x).toBe(56);
      const expectedSpacing = 14 * 1.4;
      expect(secondLine.y - firstLine.y).toBeCloseTo(expectedSpacing, 0);
    });

    it('clips overflowing text with ellipsis when requested', () => {
      const {
        renderer, doc, config, song,
      } = createRenderer();
      const stubDoc = getStubDoc(doc);

      // Create a LayoutSectionRenderer to test text clipping
      const layoutRenderer = new LayoutSectionRenderer(
        {
          pageSize: renderer.getDoc().pageSize,
          currentPage: 1,
          totalPages: 1,
          text: (content, x, y) => renderer.getDoc().text(content, x, y),
          getTextWidth: (text) => renderer.getDoc().getTextWidth(text),
          splitTextToSize: (text, maxWidth) => renderer.getDoc().splitTextToSize(text, maxWidth),
          setFontStyle: (style) => renderer.getDoc().setFontStyle(style),
          addImage: () => {},
          line: () => {},
          setLineStyle: () => {},
          resetDash: () => {},
        },
        {
          metadata: song.metadata,
          margins: config.layout.global.margins,
          extraMetadata: {},
        },
      );

      const headerWithClippedText = {
        height: 60,
        content: [
          {
            type: 'text' as const,
            value: 'This sentence is intentionally very long to ensure clipping occurs.',
            style: {
              ...config.fonts.metadata,
              size: 12,
            },
            position: {
              x: 0 as any,
              y: 20,
              width: 40,
              clip: true,
              ellipsis: true,
            },
          },
        ],
      };

      layoutRenderer.renderLayout(headerWithClippedText, 'header');

      const textItems = stubDoc.renderedItems.filter((item) => item.type === 'text') as any[];
      expect(textItems).toHaveLength(1);
      const originalValue = 'This sentence is intentionally very long to ensure clipping occurs.';
      expect(textItems[0].text.length).toBeLessThan(originalValue.length);
      expect(textItems[0].text.endsWith('...')).toBe(true);
    });
  });

  describe('finalization and drawing', () => {
    it('adds pages as needed and draws elements during finalizeRendering', () => {
      const { renderer, doc, config } = createRenderer();
      const docWrapper = renderer.getDoc();
      const stubDoc = getStubDoc(doc);

      (renderer as any).elements = [
        {
          x: 40,
          y: 120,
          width: 0,
          height: 0,
          content: 'First line',
          type: 'lyrics',
          page: 1,
          column: 1,
        },
        {
          x: 60,
          y: 220,
          width: 0,
          height: 0,
          content: 'Second line',
          type: 'sectionLabel',
          style: config.fonts.sectionLabel,
          page: 2,
          column: 1,
        },
      ];

      (renderer as any).currentPage = 2;
      docWrapper.totalPages = 1;
      docWrapper.currentPage = 1;

      const drawSpy = jest.spyOn(renderer as any, 'drawElement');

      (renderer as any).finalizeRendering();

      expect(docWrapper.totalPages).toBe(2);
      expect(drawSpy).toHaveBeenCalledTimes(2);

      const renderedTexts = stubDoc.renderedItems.filter((item) => item.type === 'text') as any[];
      expect(renderedTexts.map((item) => item.text)).toEqual(['First line', 'Second line']);

      const underlineLines = stubDoc.renderedItems.filter((item) => item.type === 'line');
      expect(underlineLines.length).toBeGreaterThanOrEqual(1);

      drawSpy.mockRestore();
    });
  });

  describe('measurement and baseline', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('delegates measureText to the doc wrapper and maps dimensions', () => {
      const { renderer } = createRenderer();
      const docWrapper = renderer.getDoc();
      const chordFont = renderer.getFontConfiguration('chord');
      const dimensionSpy = jest
        .spyOn(docWrapper, 'getTextDimensions')
        .mockReturnValue({ w: 42, h: 18 });

      const result = (renderer as any).measureText('Sample', chordFont);

      expect(dimensionSpy).toHaveBeenCalledWith('Sample', chordFont);
      expect(result).toEqual({ width: 42, height: 18 });
    });

    it('calculates chord baseline using tallest chord height and measured text height', () => {
      const { renderer } = createRenderer();
      const docWrapper = renderer.getDoc();
      const chordFont = renderer.getFontConfiguration('chord');
      const items = [
        { chordHeight: 12 },
        { chordHeight: 16 },
      ];

      const dimensionSpy = jest
        .spyOn(docWrapper, 'getTextDimensions')
        .mockReturnValue({ w: 10, h: 8 });

      const result = (renderer as any).calculateChordBaseline(100, items as any, 'C');

      expect(dimensionSpy).toHaveBeenCalledWith('C', chordFont);
      expect(result).toBe(108);
    });
  });
});
