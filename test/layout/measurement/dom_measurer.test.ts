import { DomMeasurer } from '../../../src/layout/measurement/dom_measurer';
import { FontConfiguration } from '../../../src/formatter/configuration';

interface MockDOMRect {
  width: number;
  height: number;
}

interface MockSpanElement {
  style: Record<string, string>;
  textContent: string;
  parentNode: MockBodyElement | null;
  getBoundingClientRect: () => MockDOMRect;
}

interface MockBodyElement {
  appendChild: jest.Mock<void, [MockSpanElement]>;
  removeChild: jest.Mock<void, [MockSpanElement]>;
}

interface MockDocument {
  createElement: jest.Mock<MockSpanElement, [string]>;
  body: MockBodyElement;
}

const CHAR_WIDTH = 8;
const SPACE_WIDTH = 4;

let currentSpan: MockSpanElement;
let mockDocument: MockDocument;
let mockBody: MockBodyElement;

const computeCharWidth = (char: string): number => (char === ' ' ? SPACE_WIDTH : CHAR_WIDTH);

const parseFontSize = (fontSize: string | undefined): number => {
  if (!fontSize) return 14;
  const match = fontSize.toString().match(/([0-9]+(?:\.[0-9]+)?)/);
  return match ? Number(match[1]) : 14;
};

const computeLineHeight = (fontSize: number, lineHeight: string | undefined): number => {
  if (!lineHeight || lineHeight === 'normal') {
    return fontSize * 1.2;
  }
  const numeric = Number(lineHeight);
  return Number.isNaN(numeric) ? fontSize * 1.2 : fontSize * numeric;
};

const computeTextWidth = (text: string, letterSpacing = 'normal'): number => {
  if (!text) return 0;
  const spacingValue = letterSpacing !== 'normal' ? parseFloat(letterSpacing) || 0 : 0;
  const characters = Array.from(text);
  const baseWidth = characters.reduce((acc, char) => acc + computeCharWidth(char), 0);
  const spacingWidth = characters.length > 1 ? spacingValue * (characters.length - 1) : 0;
  return baseWidth + spacingWidth;
};

const createSpan = (): MockSpanElement => ({
  style: {},
  textContent: '',
  parentNode: null,
  getBoundingClientRect: () => {
    const fontSize = parseFontSize(currentSpan.style.fontSize);
    const lineHeight = computeLineHeight(fontSize, currentSpan.style.lineHeight);
    return {
      width: computeTextWidth(currentSpan.textContent, currentSpan.style.letterSpacing ?? 'normal'),
      height: lineHeight,
    };
  },
});

const createFontConfig = (overrides: Partial<FontConfiguration> = {}): FontConfiguration => ({
  name: 'Arial',
  style: 'normal',
  size: 14,
  color: '#000000',
  ...overrides,
});

describe('DomMeasurer', () => {
  const prevDoc = (global as any).document;

  beforeEach(() => {
    mockBody = {
      appendChild: jest.fn((element: MockSpanElement) => {
        Object.assign(element, { parentNode: mockBody });
      }),
      removeChild: jest.fn((element: MockSpanElement) => {
        Object.assign(element, { parentNode: null });
      }),
    };

    mockDocument = {
      createElement: jest.fn((tag: string) => {
        if (tag !== 'span') {
          throw new Error(`Unexpected tag: ${tag}`);
        }
        currentSpan = createSpan();
        return currentSpan;
      }),
      body: mockBody,
    };

    (global as unknown as { document: MockDocument }).document = mockDocument;
  });

  const getMockSpan = () => currentSpan;

  afterAll(() => {
    if (prevDoc === undefined) {
      delete (global as any).document;
    } else {
      (global as any).document = prevDoc;
    }
  });

  describe('constructor', () => {
    it('creates span element and adds to DOM', () => {
      const measurer = new DomMeasurer();
      expect(measurer).toBeInstanceOf(DomMeasurer);
      expect(mockDocument.createElement).toHaveBeenCalledWith('span');
      expect(mockBody.appendChild).toHaveBeenCalledWith(currentSpan);
    });

    it('sets required styles for accurate measurement', () => {
      const measurer = new DomMeasurer();
      expect(measurer).toBeInstanceOf(DomMeasurer);
      const span = getMockSpan();

      expect(span.style.position).toBe('absolute');
      expect(span.style.visibility).toBe('hidden');
      expect(span.style.whiteSpace).toBe('pre');
      expect(span.style.padding).toBe('0');
      expect(span.style.margin).toBe('0');
      expect(span.style.border).toBe('none');
      expect(span.style.left).toBe('-9999px');
      expect(span.style.top).toBe('-9999px');
    });
  });

  describe('dispose', () => {
    it('removes element from DOM', () => {
      const measurer = new DomMeasurer();
      const span = getMockSpan();

      expect(span.parentNode).toBe(mockBody);
      measurer.dispose();
      expect(mockBody.removeChild).toHaveBeenCalledWith(span);
      expect(span.parentNode).toBeNull();
    });

    it('handles dispose when element already removed', () => {
      const measurer = new DomMeasurer();
      const span = getMockSpan();

      span.parentNode = null;
      expect(() => measurer.dispose()).not.toThrow();
    });
  });

  describe('measureText', () => {
    it('measures text width and height correctly', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const result = measurer.measureText('Hello', fontConfig);

      expect(result.width).toBe(computeTextWidth('Hello'));
      const span = getMockSpan();
      const expectedHeight = computeLineHeight(parseFontSize(span.style.fontSize), span.style.lineHeight);
      expect(result.height).toBeCloseTo(expectedHeight);
    });

    it('handles empty string', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const result = measurer.measureText('', fontConfig);

      expect(result.width).toBe(0);
      const span = getMockSpan();
      const expectedHeight = computeLineHeight(parseFontSize(span.style.fontSize), span.style.lineHeight);
      expect(result.height).toBeCloseTo(expectedHeight);
    });

    it('applies font configuration to element style', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig({
        name: 'Times New Roman',
        size: 20,
        weight: '600',
        style: 'italic',
      });

      measurer.measureText('Test', fontConfig);
      const span = getMockSpan();

      expect(span.style.fontFamily).toBe('Times New Roman');
      expect(span.style.fontSize).toBe('20px');
      expect(span.style.fontWeight).toBe('600');
      expect(span.style.fontStyle).toBe('italic');
    });

    it('applies optional font properties', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig({
        lineHeight: 1.5,
        textTransform: 'uppercase',
        textDecoration: 'underline',
        letterSpacing: '1px',
      });

      measurer.measureText('Test', fontConfig);
      const span = getMockSpan();

      expect(String(span.style.lineHeight)).toBe('1.5');
      expect(span.style.textTransform).toBe('uppercase');
      expect(span.style.textDecoration).toBe('underline');
      expect(span.style.letterSpacing).toBe('1px');
    });

    it('uses default values for optional properties', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      measurer.measureText('Test', fontConfig);
      const span = getMockSpan();

      expect(String(span.style.lineHeight)).toBe('1');
      expect(span.style.textTransform).toBe('none');
      expect(span.style.textDecoration).toBe('none');
      expect(span.style.letterSpacing).toBe('normal');
    });

    it('handles special characters', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const result = measurer.measureText('Ñoño', fontConfig);

      expect(result.width).toBe(computeTextWidth('Ñoño'));
    });

    it('handles unicode characters including emoji', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const result = measurer.measureText('🎵 Music', fontConfig);

      expect(result.width).toBe(computeTextWidth('🎵 Music'));
    });
  });

  describe('measureTextWidth', () => {
    it('returns width from measureText', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const width = measurer.measureTextWidth('Hello', fontConfig);

      expect(width).toBe(computeTextWidth('Hello'));
    });

    it('handles empty string', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const width = measurer.measureTextWidth('', fontConfig);

      expect(width).toBe(0);
    });
  });

  describe('measureTextHeight', () => {
    it('returns height from measureText', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const height = measurer.measureTextHeight('Hello', fontConfig);

      const span = getMockSpan();
      const expectedHeight = computeLineHeight(parseFontSize(span.style.fontSize), span.style.lineHeight);
      expect(height).toBeCloseTo(expectedHeight);
    });

    it('height varies with font size', () => {
      const measurer = new DomMeasurer();

      const heightSmall = measurer.measureTextHeight('A', createFontConfig({ size: 12 }));
      const heightLarge = measurer.measureTextHeight('A', createFontConfig({ size: 24 }));

      expect(heightLarge).toBeGreaterThan(heightSmall);
    });
  });

  describe('splitTextToSize', () => {
    it('returns empty array for empty string', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('', 100, fontConfig);

      expect(lines).toEqual([]);
    });

    it('returns empty array for null text', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize(null as unknown as string, 100, fontConfig);

      expect(lines).toEqual([]);
    });

    it('returns single line when text fits', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('Hello', 100, fontConfig);

      expect(lines).toEqual(['Hello']);
    });

    it('splits text by words when exceeding maxWidth', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('Hello world test', 60, fontConfig);

      expect(lines.length).toBeGreaterThan(1);
      expect(lines.join(' ')).toBe('Hello world test');
      lines.forEach((line) => {
        expect(computeTextWidth(line)).toBeLessThanOrEqual(60);
      });
    });

    it('splits long word by characters', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();
      const text = 'Antidisestablishmentarianism';

      const lines = measurer.splitTextToSize(text, 50, fontConfig);

      expect(lines.length).toBeGreaterThan(1);
      expect(lines.join('')).toBe(text);
      lines.slice(0, -1).forEach((line) => {
        expect(computeTextWidth(line)).toBeLessThanOrEqual(50);
      });
    });

    it('handles single character that exceeds maxWidth', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('W', 5, fontConfig);

      expect(lines).toEqual(['W']);
    });

    it('preserves empty lines from line breaks', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('Line1\n\nLine3', 100, fontConfig);

      expect(lines).toEqual(['Line1', '', 'Line3']);
    });

    it('handles multiple consecutive line breaks', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('A\n\n\nB', 100, fontConfig);

      expect(lines).toEqual(['A', '', '', 'B']);
    });

    it('handles Windows line breaks', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('Line1\r\nLine2', 100, fontConfig);

      expect(lines).toEqual(['Line1', 'Line2']);
    });

    it('handles Mac line breaks', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('Line1\rLine2', 100, fontConfig);

      expect(lines).toEqual(['Line1', 'Line2']);
    });

    it('splits paragraph with multiple words and line breaks', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const text = 'First paragraph\nSecond paragraph with many words';
      const lines = measurer.splitTextToSize(text, 60, fontConfig);

      expect(lines.length).toBeGreaterThan(2);
      expect(lines.join(' ')).toBe('First paragraph Second paragraph with many words');
    });

    it('handles text with leading/trailing spaces', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('  Hello  ', 100, fontConfig);

      const reconstructed = lines.join('');
      expect(reconstructed.trim()).toBe('Hello');
      expect(reconstructed.endsWith('  ')).toBe(true);
    });

    it('handles text with only spaces', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('     ', 100, fontConfig);

      expect(lines.length).toBeLessThanOrEqual(1);
      expect(lines[0] ?? '     ').toBe('     ');
    });

    it('handles mixed content with punctuation', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('Hello, world! How are you?', 50, fontConfig);

      expect(lines.length).toBeGreaterThan(1);
      expect(lines.join(' ')).toBe('Hello, world! How are you?');
    });

    it('exact fit scenario', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();
      const text = 'Hello world';
      const maxWidth = computeTextWidth(text);

      const lines = measurer.splitTextToSize(text, maxWidth, fontConfig);

      expect(lines).toEqual(['Hello world']);
    });

    it('boundary case - slightly over maxWidth', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();
      const text = 'Hello world';
      const maxWidth = computeTextWidth(text) - 1;

      const lines = measurer.splitTextToSize(text, maxWidth, fontConfig);

      expect(lines.length).toBeGreaterThan(1);
    });

    it('very long text with no spaces', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();
      const text = 'a'.repeat(100);

      const lines = measurer.splitTextToSize(text, 50, fontConfig);

      expect(lines.length).toBeGreaterThan(1);
      expect(lines.join('')).toBe(text);
      lines.slice(0, -1).forEach((line) => {
        expect(computeTextWidth(line)).toBeLessThanOrEqual(50);
      });
    });

    it('alternating short and long words', () => {
      const measurer = new DomMeasurer();
      const fontConfig = createFontConfig();
      const text = 'I supercalifragilistic am here';

      const lines = measurer.splitTextToSize(text, 50, fontConfig);

      expect(lines.length).toBeGreaterThan(1);
      expect(lines.join(' ')).toBe(text);
    });
  });
});
