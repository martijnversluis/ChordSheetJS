import ChordLyricsPair from '../../src/chord_sheet/chord_lyrics_pair';
import Line from '../../src/chord_sheet/line';
import PositionedHtmlRenderer from '../../src/rendering/html/positioned_html_renderer';
import Song from '../../src/chord_sheet/song';
import Tag from '../../src/chord_sheet/tag';
import {
  FontConfiguration,
  LayoutContentItemWithLine,
  LayoutContentItemWithText,
  MeasuredHtmlFormatterConfiguration,
  measuredHtmlSpecificDefaults,
} from '../../src/formatter/configuration';

const HtmlDocWrapperMock = jest.fn();
const ConditionMock = jest.fn();
const ChordProParserMock = jest.fn();
const TextFormatterMock = jest.fn();
const getCaposMock = jest.fn();

jest.mock('../../src/rendering/html/html_doc_wrapper', () => ({
  __esModule: true,
  default: function HtmlDocWrapperStub(...args: any[]) {
    return HtmlDocWrapperMock(...args);
  },
}));

jest.mock('../../src/template_helpers', () => ({
  renderChord: (chords: string) => chords,
  isColumnBreak: (tag: any) => tag?.name === 'column_break' || tag?.type === 'column_break',
  isComment: (tag: any) => tag?.name === 'comment' || tag?.type === 'comment',
}));

jest.mock('../../src/rendering/pdf/js_pdf_renderer', () => ({
  __esModule: true,
  default: function JsPdfRendererStub() {},
}));

jest.mock('../../src/layout/engine/condition', () => ({
  __esModule: true,
  default: function ConditionStub(...args: any[]) {
    return ConditionMock(...args);
  },
}));

jest.mock('../../src/parser/chord_pro_parser', () => ({
  __esModule: true,
  default: () => ChordProParserMock(),
}));

jest.mock('../../src/formatter/text_formatter', () => ({
  __esModule: true,
  default: () => TextFormatterMock(),
}));

jest.mock('../../src/helpers', () => ({
  getCapos: () => getCaposMock(),
}));

interface ConditionCall {
  rule: any;
  metadata: Record<string, any>;
}

interface AddedElement {
  element: MockElement;
  x: number;
  y: number;
}

interface DocStub {
  pageSize: { width: number; height: number };
  currentPage: number;
  totalPages: number;
  pages: MockElement[];
  addedElements: AddedElement[];
  newPage: jest.Mock;
  setPage: jest.Mock;
  createPage: jest.Mock;
  eachPage: jest.Mock;
  addElement: jest.Mock;
  getTextDimensions: jest.Mock;
  getTextWidth: jest.Mock;
  splitTextToSize: jest.Mock;
  dispose: jest.Mock;
}

interface RendererSetup {
  renderer: PositionedHtmlRenderer;
  song: Song;
  container: MockElement;
  config: MeasuredHtmlFormatterConfiguration;
  doc: DocStub;
}

interface TestParagraphLayout {
  units: any[][];
  addSpacing: boolean;
  sectionType: string;
}

class MockElement {
  public style: Record<string, string> = {};

  public className = '';

  public textContent = '';

  public src = '';

  public children: MockElement[] = [];

  public parentNode: MockElement | null = null;

  private readonly classSet = new Set<string>();

  public classList = {
    add: (...classes: string[]) => {
      classes.forEach((cls) => this.classSet.add(cls));
    },
    contains: (cls: string) => this.classSet.has(cls),
  };

  constructor(public readonly tagName: string) {}

  appendChild<T extends MockElement>(child: T): T {
    const node = child;
    node.parentNode = this;
    this.children.push(node);
    return node;
  }

  removeChild(child: MockElement): void {
    const node = child;
    this.children = this.children.filter((current) => current !== node);
    node.parentNode = null;
  }
}

const globalAny = globalThis as typeof globalThis & { document: any };

describe('PositionedHtmlRenderer', () => {
  let parseMock: jest.Mock;
  let formatMock: jest.Mock;
  let conditionReturnValue: boolean;
  let conditionCalls: ConditionCall[];

  beforeEach(() => {
    HtmlDocWrapperMock.mockReset();
    ConditionMock.mockReset();
    ChordProParserMock.mockReset();
    TextFormatterMock.mockReset();
    getCaposMock.mockReset();

    parseMock = jest.fn();
    formatMock = jest.fn();

    ChordProParserMock.mockReturnValue({ parse: parseMock });
    TextFormatterMock.mockReturnValue({ format: formatMock });

    getCaposMock.mockReturnValue({
      0: 'C',
      1: 'Db',
      2: 'D',
      3: 'Eb',
      4: 'E',
    });

    conditionReturnValue = true;
    conditionCalls = [];

    ConditionMock.mockImplementation((rule: any, metadata: Record<string, any>) => ({
      evaluate: () => {
        conditionCalls.push({ rule, metadata });
        return conditionReturnValue;
      },
    }));

    const head = new MockElement('head');
    const body = new MockElement('body');

    globalAny.document = {
      head,
      body,
      createElement: jest.fn((tag: string) => new MockElement(tag)),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function cloneDefaults(): MeasuredHtmlFormatterConfiguration {
    return JSON.parse(JSON.stringify(measuredHtmlSpecificDefaults)) as MeasuredHtmlFormatterConfiguration;
  }

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

  function createConfig(
    overrides: Partial<MeasuredHtmlFormatterConfiguration> = {},
  ): MeasuredHtmlFormatterConfiguration {
    const config = cloneDefaults();
    return deepMerge(config, overrides);
  }

  function createDocStub(): DocStub {
    const doc: DocStub = {
      pageSize: { width: 600, height: 800 },
      currentPage: 1,
      totalPages: 1,
      pages: [new MockElement('div')],
      addedElements: [],
      newPage: jest.fn(() => {
        doc.currentPage += 1;
        if (doc.currentPage > doc.totalPages) {
          const page = new MockElement('div');
          doc.pages.push(page);
          doc.totalPages = doc.pages.length;
        }
      }),
      setPage: jest.fn((page: number) => {
        doc.currentPage = page;
        while (doc.totalPages < page) {
          doc.pages.push(new MockElement('div'));
          doc.totalPages = doc.pages.length;
        }
      }),
      createPage: jest.fn(() => {
        const page = new MockElement('div');
        doc.pages.push(page);
        doc.totalPages = doc.pages.length;
        return page;
      }),
      eachPage: jest.fn((callback: (page: MockElement, index: number) => void) => {
        doc.pages.forEach((page, index) => {
          doc.currentPage = index + 1;
          callback(page, index);
        });
      }),
      addElement: jest.fn((element: MockElement, x: number, y: number) => {
        doc.addedElements.push({ element, x, y });
      }),
      getTextDimensions: jest.fn((text: string, font: FontConfiguration) => ({
        w: text.length * (font.size || 1),
        h: font.size || 1,
      })),
      getTextWidth: jest.fn((text: string, font: FontConfiguration) => text.length * (font.size || 1)),
      splitTextToSize: jest.fn((text: string) => text.split('\n')),
      dispose: jest.fn(),
    };

    return doc;
  }

  function createRenderer(overrides: Partial<MeasuredHtmlFormatterConfiguration> = {}): RendererSetup {
    const container = new MockElement('div');
    const baseOverrides: Partial<MeasuredHtmlFormatterConfiguration> = {
      pageSize: { width: 600, height: 800 },
      layout: {
        global: {
          margins: {
            top: 40,
            bottom: 30,
            left: 50,
            right: 40,
          },
        },
        sections: {
          global: {
            columnCount: 2,
            columnWidth: 240,
            columnSpacing: 18,
            chordLyricSpacing: 6,
            paragraphSpacing: 12,
            chordSpacing: 3,
            linePadding: 4,
            minColumnWidth: 150,
            maxColumnWidth: 260,
          },
          base: {
            display: {
              lyricsOnly: false,
            },
          },
        },
        header: {
          height: 45,
          content: [],
        },
        footer: {
          height: 25,
          content: [],
        },
      },
      cssClassPrefix: 'test-',
      cssClasses: {
        chord: 'chord-class',
        lyrics: 'lyrics-class',
        sectionLabel: 'section-class',
        comment: 'comment-class',
        header: 'header-class',
        footer: 'footer-class',
      },
    };

    const config = createConfig(deepMerge(baseOverrides, overrides));

    const song = new Song({ title: 'Test Song', artist: 'Tester', key: 'C' });
    song.metadata.set('capo', '1');
    song.metadata.set('key', 'C');

    const doc = createDocStub();
    HtmlDocWrapperMock.mockImplementation(() => doc);

    const renderer = new PositionedHtmlRenderer(song, container as unknown as any, config);

    return {
      renderer,
      song,
      container,
      config,
      doc,
    };
  }

  describe('construction and configuration', () => {
    it('instantiates HtmlDocWrapper and exposes container', () => {
      const {
        renderer,
        container,
        config,
        doc,
      } = createRenderer();

      expect(HtmlDocWrapperMock).toHaveBeenCalledWith(container, {
        width: config.pageSize.width,
        height: config.pageSize.height,
      });
      expect(renderer.getDoc()).toBe(doc);
      expect(renderer.getHTML()).toBe(container);
    });

    it('returns font configuration for a given object type', () => {
      const { renderer, config } = createRenderer();
      expect(renderer.getFontConfiguration('chord')).toEqual(config.fonts.chord);
      expect(renderer.getFontConfiguration('text')).toEqual(config.fonts.text);
    });

    it('provides document metadata including dimensions and page info', () => {
      const { renderer, doc } = createRenderer();
      (renderer as any).renderTime = 3.5;
      doc.currentPage = 2;
      doc.totalPages = 3;

      const metadata = renderer.getDocumentMetadata();

      expect(metadata.pageWidth).toBe(doc.pageSize.width);
      expect(metadata.pageHeight).toBe(doc.pageSize.height);
      expect(metadata.marginLeft).toBe(renderer.dimensions.margins.left);
      expect(metadata.marginRight).toBe(renderer.dimensions.margins.right);
      expect(metadata.currentPage).toBe(2);
      expect(metadata.totalPages).toBe(3);
      expect(metadata.renderTime).toBe(3.5);
      expect(metadata.dimensions).toBe(renderer.dimensions);
    });
  });

  describe('backend lifecycle', () => {
    it('injects additional CSS on initialization', () => {
      const css = '.test { color: red; }';
      const { renderer } = createRenderer({ additionalCss: css });
      const { document } = globalAny;

      (renderer as any).initializeBackend();

      expect(document.createElement).toHaveBeenCalledWith('style');
      const styleElement = (document.createElement as jest.Mock).mock.results[0].value as MockElement;
      expect(styleElement.textContent).toBe(css);
      expect(document.head.children).toContain(styleElement);
    });

    it('delegates new page creation and disposal to HtmlDocWrapper', () => {
      const { renderer, doc } = createRenderer();
      (renderer as any).createNewPage();
      expect(doc.newPage).toHaveBeenCalledTimes(1);

      renderer.dispose();
      expect(doc.dispose).toHaveBeenCalledTimes(1);
    });
  });

  describe('paragraph and line rendering', () => {
    it('groups paragraph elements by page and preserves spacing', () => {
      const { renderer, doc } = createRenderer();
      const layouts: TestParagraphLayout[] = [
        {
          units: [[{} as any]],
          addSpacing: true,
          sectionType: 'verse',
        },
        {
          units: [[{} as any]],
          addSpacing: false,
          sectionType: 'chorus',
        },
      ];

      const originalY = (renderer as any).y;
      (renderer as any).y = 120;

      const renderLinesSpy = jest.spyOn(renderer as any, 'renderLineItems').mockImplementation(() => {
        (renderer as any).elements.push(
          {
            x: 20,
            y: 140,
            width: 60,
            height: 14,
            content: 'Lyric',
            type: 'lyrics',
            page: 1,
            column: 1,
          },
          {
            x: 40,
            y: 160,
            width: 50,
            height: 10,
            content: 'Chord',
            type: 'chord',
            page: 2,
            column: 1,
          },
        );
      });

      (renderer as any).renderParagraphs(layouts);

      expect(renderLinesSpy).toHaveBeenCalledTimes(2);
      expect(doc.setPage).toHaveBeenNthCalledWith(1, 1);
      expect(doc.setPage).toHaveBeenNthCalledWith(2, 2);
      expect(doc.addElement).toHaveBeenCalledTimes(4);

      const paragraphDiv = doc.addElement.mock.calls[0][0] as MockElement;
      expect(paragraphDiv.style.left).toBe('20px');
      expect(paragraphDiv.style.top).toBe('140px');
      expect(paragraphDiv.children).toHaveLength(1);
      expect(paragraphDiv.children[0].style.left).toBe('0px');
      expect(paragraphDiv.children[0].style.top).toBe('0px');

      const paragraphSpacing = (renderer as any).getParagraphSpacing();
      expect((renderer as any).y).toBe(120 + paragraphSpacing);
      (renderer as any).y = originalY;
    });

    it('renders chords, lyrics, comments, and handles column breaks', () => {
      const { renderer } = createRenderer();
      renderer.initialize();

      const chordPair = new ChordLyricsPair('C', 'Hello');
      const commentTag = new Tag('comment', 'Note');
      const columnBreakTag = new Tag('column_break');
      const line = new Line();
      line.addItem(chordPair);
      line.addItem(commentTag);

      const lineLayouts = [
        {
          type: 'ChordLyricsPair',
          lineHeight: 20,
          items: [
            { item: chordPair, width: 50, chordHeight: 10 },
            { item: commentTag, width: 40 },
          ],
          line,
        },
        {
          type: 'Tag',
          lineHeight: 0,
          items: [{ item: columnBreakTag, width: 0 }],
        },
      ];

      (renderer as any).renderLines(lineLayouts);

      const { elements, currentColumn, currentPage } = renderer as any;
      expect(elements.some((el: any) => el.type === 'chord')).toBe(true);
      expect(elements.some((el: any) => el.type === 'lyrics')).toBe(true);
      expect(elements.some((el: any) => el.type === 'comment')).toBe(true);
      expect(currentColumn).toBe(2);
      expect(currentPage).toBe(1);
    });

    it('delegates measurements and calculates chord baseline', () => {
      const { renderer, doc } = createRenderer();
      const font = renderer.getFontConfiguration('text');
      const result = (renderer as any).measureText('Measure', font);
      expect(doc.getTextDimensions).toHaveBeenCalledWith('Measure', font);
      expect(result).toEqual({ width: expect.any(Number), height: expect.any(Number) });

      const items = [
        { item: new ChordLyricsPair('C', 'Lyric'), width: 50, chordHeight: 12 },
        { item: new ChordLyricsPair('G', 'Word'), width: 40, chordHeight: 16 },
      ];
      const baseline = (renderer as any).calculateChordBaseline(100, items, 'C');
      const chordHeight = (renderer as any).measureText('C', renderer.getFontConfiguration('chord')).height;
      expect(baseline).toBe(100 + 16 - chordHeight);
    });

    it('finalizes rendering across multiple pages', () => {
      const { renderer, doc } = createRenderer();

      (renderer as any).elements = [
        {
          x: 10,
          y: 20,
          width: 30,
          height: 10,
          content: 'A',
          type: 'lyrics',
          page: 1,
          column: 1,
          style: renderer.getFontConfiguration('text'),
        },
        {
          x: 15,
          y: 25,
          width: 30,
          height: 10,
          content: 'B',
          type: 'lyrics',
          page: 2,
          column: 1,
          style: renderer.getFontConfiguration('text'),
        },
      ];

      (renderer as any).currentPage = 2;
      doc.totalPages = 1;

      (renderer as any).finalizeRendering();

      expect(doc.createPage).toHaveBeenCalled();
      expect(doc.setPage).toHaveBeenNthCalledWith(1, 1);
      expect(doc.setPage).toHaveBeenNthCalledWith(2, 2);
      expect(doc.addElement).toHaveBeenCalledTimes(2);
    });
  });

  describe('layout content', () => {
    it('renders headers and footers with metadata-aware conditions', () => {
      const headerContent: LayoutContentItemWithText[] = [
        {
          type: 'text',
          value: 'Header text',
          style: {
            name: 'HeaderFont',
            style: 'normal',
            size: 14,
            color: '#000000',
          },
          position: {
            x: 'center',
            y: 10,
          },
          condition: { key: 'page', equals: '1' } as any,
        },
      ];

      const footerContent: LayoutContentItemWithLine[] = [
        {
          type: 'line',
          style: { width: 2, dash: [], color: '#333333' },
          position: {
            x: 0,
            y: 5,
            width: 'auto',
            height: 1,
          },
        },
      ];

      const { renderer, doc, song } = createRenderer({
        layout: {
          ...measuredHtmlSpecificDefaults.layout,
          header: {
            height: 45,
            content: headerContent,
          },
          footer: {
            height: 30,
            content: footerContent as any,
          },
        } as any,
      });

      doc.pages = [new MockElement('div'), new MockElement('div')];

      (renderer as any).renderHeadersAndFooters();

      expect(doc.eachPage).toHaveBeenCalledTimes(2);
      expect(doc.addElement).toHaveBeenCalled();
      expect(conditionCalls[0].metadata.page).toBe('1');
      expect(conditionCalls[0].metadata.pages).toBe(doc.totalPages.toString());
      expect(conditionCalls[0].metadata.capoKey).toBeDefined();
      expect(song.metadata.getSingle('key')).toBe('C');
    });
  });

  describe('caching and metadata', () => {
    it('reuses cached dimensions until page size changes', () => {
      const { renderer, doc } = createRenderer();
      const buildSpy = jest.spyOn(renderer as any, 'buildDimensions');

      const firstDimensions = renderer.dimensions;
      const secondDimensions = renderer.dimensions;
      expect(firstDimensions).toBe(secondDimensions);
      expect(buildSpy).toHaveBeenCalledTimes(1);

      doc.pageSize.width = 620;
      const thirdDimensions = renderer.dimensions;
      expect(thirdDimensions).not.toBe(firstDimensions);
      expect(buildSpy).toHaveBeenCalledTimes(2);
    });

    it('merges extra metadata including capo information', () => {
      const { renderer } = createRenderer();
      (renderer as any).renderTime = 7.25;
      const metadata = (renderer as any).getExtraMetadata(2, 4);
      expect(metadata.page).toBe('2');
      expect(metadata.pages).toBe('4');
      expect(metadata.capoKey).toBeDefined();
      expect(metadata.renderTime).toBe('7.25');
    });
  });

  describe('title separator styling', () => {
    it('renders title separator without underline', () => {
      const { renderer } = createRenderer();
      const mockTag = {
        isSectionDelimiter: () => false,
        name: 'comment',
        value: ' > ',
        label: null,
        attributes: { __titleSeparator: 'true' },
      };

      // Call the private method directly
      (renderer as any).renderTagItem(
        mockTag,
        100,
        200,
        { column: 1, page: 1 },
      );

      const { elements } = renderer as any;
      const separatorElement = elements.find((el: any) => el.content === ' > ');

      expect(separatorElement).toBeDefined();
      expect(separatorElement.style.underline).toBe(false);
    });
  });
});
