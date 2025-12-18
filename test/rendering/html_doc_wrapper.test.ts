import { FontConfiguration } from '../../src/formatter/configuration';
import HtmlDocWrapper from '../../src/rendering/html/html_doc_wrapper';

interface MeasurerMocks {
  measureText: jest.Mock;
  splitTextToSize: jest.Mock;
  dispose: jest.Mock;
}

type MockElementChild = MockElement | null;

class MockElement {
  public style: Record<string, string> = {};

  public children: MockElement[] = [];

  public className = '';

  public textContent = '';

  public parentNode: MockElementChild = null;

  private rect = { width: 0, height: 0 };

  constructor(public readonly tagName: string) {}

  appendChild<T extends MockElement>(child: T): T {
    child.setParent(this);
    this.children.push(child);
    return child;
  }

  removeChild(child: MockElement): void {
    this.children = this.children.filter((node) => node !== child);
    child.setParent(null);
  }

  setBoundingRect(width: number, height: number): void {
    this.rect = { width, height };
  }

  getBoundingClientRect(): { width: number; height: number } {
    return this.rect;
  }

  setParent(parent: MockElementChild): void {
    this.parentNode = parent;
  }
}

jest.mock('../../src/layout/measurement', () => ({
  DomMeasurer: jest.fn(),
}));

const { DomMeasurer: mockDomMeasurer } = jest.requireMock('../../src/layout/measurement') as {
  DomMeasurer: jest.Mock;
};

describe('HtmlDocWrapper', () => {
  const globalAny = globalThis as typeof globalThis & { document: any };

  let container: MockElement;
  let pageSize: { width: number; height: number };
  let measurer: MeasurerMocks;

  const createDocument = () => {
    const elements: MockElement[] = [];

    const doc = {
      head: new MockElement('head'),
      body: new MockElement('body'),
      createElement: jest.fn((tag: string) => {
        const element = new MockElement(tag);
        elements.push(element);
        return element;
      }),
    };

    // Provide basic DOM tree behaviour for head and body
    doc.head.appendChild = doc.head.appendChild.bind(doc.head);
    doc.body.appendChild = doc.body.appendChild.bind(doc.body);

    return doc;
  };

  const createWrapper = (): HtmlDocWrapper => new HtmlDocWrapper(container as unknown as any, pageSize);

  const fontConfig: FontConfiguration = {
    name: 'Helvetica',
    size: 12,
    style: 'normal',
    color: '#000000',
  };

  beforeEach(() => {
    container = new MockElement('div');
    pageSize = { width: 500, height: 700 };

    const documentMock = createDocument();
    globalAny.document = documentMock;

    measurer = {
      measureText: jest.fn().mockReturnValue({ width: 42, height: 18 }),
      splitTextToSize: jest.fn().mockReturnValue(['line 1', 'line 2']),
      dispose: jest.fn(),
    };

    mockDomMeasurer.mockReset();
    mockDomMeasurer.mockImplementation(() => measurer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initialises container, creates first page, and instantiates measurer', () => {
    const wrapper = createWrapper();

    expect(container.style.width).toBe('100%');
    expect(container.style.margin).toBe('0 auto');
    expect(container.children).toHaveLength(1);
    expect(wrapper.getCurrentPage()).toBe(container.children[0]);
    expect(mockDomMeasurer).toHaveBeenCalledTimes(1);
    expect(wrapper.totalPages).toBe(1);
    expect(wrapper.currentPage).toBe(1);
  });

  it('creates pages with correct class and styles', () => {
    const wrapper = createWrapper();
    const page = wrapper.createPage();

    expect(page.className).toBe('chord-sheet-page');
    expect(page.style.position).toBe('relative');
    expect(wrapper.pageStyles).toMatchObject({
      width: `${pageSize.width}px`,
      height: `${pageSize.height}px`,
      overflow: 'hidden',
      boxSizing: 'border-box',
      backgroundColor: 'var(--studio-display-background-color)',
    });

    Object.entries(wrapper.pageStyles).forEach(([key, value]) => {
      expect(page.style[key]).toBe(value);
    });

    expect(container.children).toHaveLength(2);
  });

  it('advances pages with newPage and setPage', () => {
    const wrapper = createWrapper();

    wrapper.newPage();
    expect(wrapper.currentPage).toBe(2);
    expect(wrapper.totalPages).toBe(2);
    expect(container.children).toHaveLength(2);

    wrapper.setPage(3);
    expect(wrapper.currentPage).toBe(3);
    expect(wrapper.totalPages).toBe(3);
    expect(container.children).toHaveLength(3);
  });

  it('adds elements to the active page at the specified position', () => {
    const wrapper = createWrapper();
    const element = new MockElement('span');

    wrapper.addElement(element as unknown as any, 25, 60);

    const currentPage = wrapper.getCurrentPage();
    expect(currentPage.children).toContain(element);
    expect(element.style.position).toBe('absolute');
    expect(element.style.left).toBe('25px');
    expect(element.style.top).toBe('60px');
  });

  it('delegates text measurement to the DOM measurer', () => {
    const wrapper = createWrapper();
    const dimensions = wrapper.getTextDimensions('hello', fontConfig);

    expect(measurer.measureText).toHaveBeenCalledWith('hello', fontConfig);
    expect(dimensions).toEqual({ w: 42, h: 18 });

    measurer.measureText.mockReturnValue({ width: 30, height: 10 });
    const width = wrapper.getTextWidth('world', fontConfig);
    expect(measurer.measureText).toHaveBeenCalledWith('world', fontConfig);
    expect(width).toBe(30);

    measurer.splitTextToSize.mockReturnValue(['a', 'b', 'c']);
    const split = wrapper.splitTextToSize('text', 100, fontConfig);
    expect(measurer.splitTextToSize).toHaveBeenCalledWith('text', 100, fontConfig);
    expect(split).toEqual(['a', 'b', 'c']);
  });

  it('provides no-op style methods without throwing', () => {
    const wrapper = createWrapper();

    expect(() => wrapper.setFontStyle(fontConfig)).not.toThrow();
    expect(() => wrapper.setLineStyle({})).not.toThrow();
    expect(() => wrapper.resetDash()).not.toThrow();
  });

  it('iterates each page and maintains current page index', () => {
    const wrapper = createWrapper();
    wrapper.newPage();
    wrapper.newPage();

    const visited: number[] = [];
    wrapper.eachPage((page, index) => {
      visited.push(index);
      expect(page).toBe(wrapper.pages[index]);
      expect(wrapper.currentPage).toBe(index + 1);
    });

    expect(visited).toEqual([0, 1, 2]);
    expect(wrapper.currentPage).toBe(3);
  });

  it('returns the container element', () => {
    const wrapper = createWrapper();
    expect(wrapper.getContainer()).toBe(container);
  });

  it('disposes measurer resources', () => {
    const wrapper = createWrapper();
    wrapper.dispose();
    expect(measurer.dispose).toHaveBeenCalledTimes(1);
  });

  it('exposes pageStyles including required CSS entries', () => {
    const wrapper = createWrapper();
    const styles = wrapper.pageStyles;

    expect(styles.width).toBe(`${pageSize.width}px`);
    expect(styles.height).toBe(`${pageSize.height}px`);
    expect(styles.overflow).toBe('hidden');
    expect(styles.boxSizing).toBe('border-box');
    expect(styles.backgroundColor).toBe('var(--studio-display-background-color)');
  });
});
