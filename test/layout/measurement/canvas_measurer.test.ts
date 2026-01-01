import { CanvasMeasurer } from '../../../src/layout/measurement/canvas_measurer';
import { FontConfiguration } from '../../../src/formatter/configuration';

interface MockTextMetrics {
  width: number;
  fontBoundingBoxAscent?: number;
  fontBoundingBoxDescent?: number;
  actualBoundingBoxAscent?: number;
  actualBoundingBoxDescent?: number;
}

interface MockCanvasRenderingContext2D {
  font: string;
  letterSpacing: string;
  measureText: jest.Mock<MockTextMetrics, [string]>;
}

interface MockCanvasElement {
  getContext: jest.Mock<MockCanvasRenderingContext2D | null, [string]>;
}

interface MockDocument {
  createElement: jest.Mock<MockCanvasElement, [string]>;
}

const CHAR_WIDTH = 10;
const SPACE_WIDTH = 5;

let metricsMode: 'font' | 'actual' | 'fallback';
let metricsValues: {
  fontAscent: number;
  fontDescent: number;
  actualAscent: number;
  actualDescent: number;
};
let mockContext: MockCanvasRenderingContext2D;
let mockCanvasElement: MockCanvasElement;
let mockDocument: MockDocument;
let shouldReturnContext: boolean;

const computeCharWidth = (char: string): number => (char === ' ' ? SPACE_WIDTH : CHAR_WIDTH);

const computeTextWidth = (text: string, letterSpacing = 'normal'): number => {
  if (!text) return 0;
  const spacingValue = letterSpacing !== 'normal' ? parseFloat(letterSpacing) || 0 : 0;
  const characters = Array.from(text);
  const baseWidth = characters.reduce((acc, char) => acc + computeCharWidth(char), 0);
  const spacingWidth = characters.length > 1 ? spacingValue * (characters.length - 1) : 0;
  return baseWidth + spacingWidth;
};

const createMockContext = (): MockCanvasRenderingContext2D => ({
  font: '',
  letterSpacing: 'normal',
  measureText: jest.fn((text: string) => {
    const width = computeTextWidth(text, mockContext.letterSpacing);
    if (metricsMode === 'font') {
      return {
        width,
        fontBoundingBoxAscent: metricsValues.fontAscent,
        fontBoundingBoxDescent: metricsValues.fontDescent,
        actualBoundingBoxAscent: metricsValues.actualAscent,
        actualBoundingBoxDescent: metricsValues.actualDescent,
      };
    }
    if (metricsMode === 'actual') {
      return {
        width,
        actualBoundingBoxAscent: metricsValues.actualAscent,
        actualBoundingBoxDescent: metricsValues.actualDescent,
      };
    }
    return { width };
  }),
});

const createMockCanvasElement = (): MockCanvasElement => ({
  getContext: jest.fn((type: string) => (type === '2d' && shouldReturnContext ? mockContext : null)),
});

const createFontConfig = (overrides: Partial<FontConfiguration> = {}): FontConfiguration => ({
  name: 'Helvetica',
  style: 'normal',
  size: 12,
  color: '#000000',
  ...overrides,
});

const getMockContext = (): MockCanvasRenderingContext2D => mockContext;

describe('CanvasMeasurer', () => {
  const prevDoc = (global as any).document;

  beforeEach(() => {
    metricsMode = 'font';
    metricsValues = {
      fontAscent: 10,
      fontDescent: 3,
      actualAscent: 9,
      actualDescent: 2,
    };
    mockContext = createMockContext();
    shouldReturnContext = true;
    mockCanvasElement = createMockCanvasElement();
    mockDocument = {
      createElement: jest.fn((tag: string) => {
        if (tag !== 'canvas') {
          throw new Error(`Unsupported tag: ${tag}`);
        }
        mockCanvasElement = createMockCanvasElement();
        return mockCanvasElement;
      }),
    };
    (global as unknown as { document: MockDocument }).document = mockDocument;
  });

  afterAll(() => {
    if (prevDoc === undefined) {
      delete (global as any).document;
    } else {
      (global as any).document = prevDoc;
    }
  });

  describe('constructor', () => {
    it('creates canvas element and gets 2D context', () => {
      const measurer = new CanvasMeasurer();
      expect(measurer).toBeInstanceOf(CanvasMeasurer);
      expect(mockDocument.createElement).toHaveBeenCalledWith('canvas');
      expect(mockCanvasElement.getContext).toHaveBeenCalledWith('2d');
    });

    it('throws error when 2D context is not available', () => {
      shouldReturnContext = false;
      mockCanvasElement = createMockCanvasElement();
      (mockDocument.createElement as jest.Mock).mockImplementation(() => mockCanvasElement);

      expect(() => new CanvasMeasurer()).toThrow('Canvas 2D context not available');
    });
  });

  describe('measureText', () => {
    it('measures text width and height correctly', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      const result = measurer.measureText('Hello', fontConfig);

      expect(result.width).toBe(computeTextWidth('Hello'));
      expect(result.height).toBe(metricsValues.fontAscent + metricsValues.fontDescent);
    });

    it('handles empty string', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      const result = measurer.measureText('', fontConfig);

      expect(result.width).toBe(0);
      expect(result.height).toBe(metricsValues.fontAscent + metricsValues.fontDescent);
    });

    it('applies font configuration to context', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig({
        name: 'Times',
        size: 18,
        style: 'italic',
        weight: 'bold',
      });

      measurer.measureText('Test', fontConfig);

      expect(getMockContext().font).toBe('italic bold 18px Times');
    });

    it('applies letter spacing when provided', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig({ letterSpacing: '2px' });

      measurer.measureText('Test', fontConfig);

      expect(getMockContext().letterSpacing).toBe('2px');
    });

    it('uses fontBoundingBox metrics when available', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      metricsValues = {
        fontAscent: 12,
        fontDescent: 4,
        actualAscent: 9,
        actualDescent: 2,
      };

      const result = measurer.measureText('Test', fontConfig);

      expect(result.height).toBe(16);
    });

    it('falls back to actualBoundingBox metrics', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      metricsMode = 'actual';
      metricsValues = {
        fontAscent: 0,
        fontDescent: 0,
        actualAscent: 9,
        actualDescent: 2,
      };

      const result = measurer.measureText('Test', fontConfig);

      expect(result.height).toBe(11);
    });

    it('falls back to font size approximation', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig({ size: 12 });

      metricsMode = 'fallback';

      const result = measurer.measureText('Test', fontConfig);

      expect(result.height).toBeCloseTo(14.4);
    });

    it('handles special characters with diacritics', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      const result = measurer.measureText('Ñoño', fontConfig);

      expect(result.width).toBe(computeTextWidth('Ñoño'));
      expect(result.height).toBe(metricsValues.fontAscent + metricsValues.fontDescent);
    });

    it('handles unicode characters', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      const result = measurer.measureText('日本語', fontConfig);

      expect(result.width).toBe(computeTextWidth('日本語'));
      expect(result.height).toBe(metricsValues.fontAscent + metricsValues.fontDescent);
    });
  });

  describe('measureTextWidth', () => {
    it('returns width from measureText', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      const width = measurer.measureTextWidth('Hello', fontConfig);

      expect(width).toBe(computeTextWidth('Hello'));
    });

    it('handles empty string', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      const width = measurer.measureTextWidth('', fontConfig);

      expect(width).toBe(0);
    });
  });

  describe('measureTextHeight', () => {
    it('returns height from measureText', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      const height = measurer.measureTextHeight('Hello', fontConfig);

      expect(height).toBe(metricsValues.fontAscent + metricsValues.fontDescent);
    });

    it('height is consistent for same font config', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      const heightA = measurer.measureTextHeight('A', fontConfig);
      const heightZ = measurer.measureTextHeight('Z', fontConfig);

      expect(heightA).toBe(heightZ);
    });
  });

  describe('splitTextToSize', () => {
    it('returns empty array for empty string', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('', 100, fontConfig);

      expect(lines).toEqual([]);
    });

    it('returns empty array for null text', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize(null as unknown as string, 100, fontConfig);

      expect(lines).toEqual([]);
    });

    it('returns single line when text fits', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('Hello', 100, fontConfig);

      expect(lines).toEqual(['Hello']);
    });

    it('splits text by words when exceeding maxWidth', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('Hello world test', 60, fontConfig);

      expect(lines.length).toBeGreaterThan(1);
      lines.forEach((line) => {
        expect(computeTextWidth(line)).toBeLessThanOrEqual(60);
      });
      expect(lines.join(' ')).toBe('Hello world test');
    });

    it('splits long word by characters', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      const text = 'Supercalifragilisticexpialidocious';
      const lines = measurer.splitTextToSize(text, 50, fontConfig);

      expect(lines.length).toBeGreaterThan(1);
      expect(lines.join('')).toBe(text);
      lines.slice(0, -1).forEach((line) => {
        expect(computeTextWidth(line)).toBeLessThanOrEqual(50);
      });
    });

    it('handles single character that exceeds maxWidth', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('W', 5, fontConfig);

      expect(lines).toEqual(['W']);
    });

    it('preserves empty lines from line breaks', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('Line1\n\nLine3', 100, fontConfig);

      expect(lines).toEqual(['Line1', '', 'Line3']);
    });

    it('handles multiple line breaks', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('A\nB\nC', 100, fontConfig);

      expect(lines).toEqual(['A', 'B', 'C']);
    });

    it('handles Windows line breaks', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('Line1\r\nLine2', 100, fontConfig);

      expect(lines).toEqual(['Line1', 'Line2']);
    });

    it('splits paragraph with multiple words and line breaks', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      const text = 'First line\nSecond line with more words';
      const lines = measurer.splitTextToSize(text, 60, fontConfig);

      expect(lines.length).toBeGreaterThan(2);
      expect(lines.join(' ')).toBe('First line Second line with more words');
      lines.forEach((line) => {
        expect(computeTextWidth(line)).toBeLessThanOrEqual(60);
      });
    });

    it('handles text with only spaces', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('   ', 100, fontConfig);

      expect(lines.length).toBeLessThanOrEqual(1);
      expect(lines[0] ?? '   ').toBe('   ');
    });

    it('handles mixed content with special characters', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();
      const text = 'Hello! How are you?';
      const maxWidth = computeTextWidth('Hello! How');

      const lines = measurer.splitTextToSize(text, maxWidth, fontConfig);

      expect(lines.join(' ')).toBe(text);
      lines.forEach((line) => {
        expect(computeTextWidth(line)).toBeLessThanOrEqual(maxWidth);
      });
    });

    it('exact fit scenario', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();
      const text = 'Hello world';
      const maxWidth = computeTextWidth(text);

      const lines = measurer.splitTextToSize(text, maxWidth, fontConfig);

      expect(lines).toEqual(['Hello world']);
    });

    it('boundary case - one pixel over', () => {
      const measurer = new CanvasMeasurer();
      const fontConfig = createFontConfig();
      const text = 'Hello world';
      const maxWidth = computeTextWidth(text) - 1;

      const lines = measurer.splitTextToSize(text, maxWidth, fontConfig);

      expect(lines.length).toBeGreaterThan(1);
      lines.forEach((line) => {
        expect(computeTextWidth(line)).toBeLessThanOrEqual(maxWidth + 1);
      });
    });
  });
});
