import DocWrapper from '../../../src/formatter/pdf_formatter/doc_wrapper';
import { FontConfiguration } from '../../../src/formatter/configuration';
import { JsPdfMeasurer } from '../../../src/layout/measurement/js_pdf_measurer';

type MockDocWrapper = jest.Mocked<
  Pick<DocWrapper, 'withFontConfiguration' | 'getTextDimensions' | 'splitTextToSize'>
> & {
  fontConfigHistory: FontConfiguration[];
  lastCallbackResult: unknown;
};

const CHAR_WIDTH = 6;
const SPACE_WIDTH = 3;

const computeCharWidth = (char: string): number => (char === ' ' ? SPACE_WIDTH : CHAR_WIDTH);

const computeTextWidth = (text: string): number => {
  if (!text) return 0;
  return Array.from(text).reduce((total, char) => total + computeCharWidth(char), 0);
};

const computeTextHeight = (fontSize: number): number => fontSize * 1.1;

const createFontConfig = (overrides: Partial<FontConfiguration> = {}): FontConfiguration => ({
  name: 'Helvetica',
  style: 'normal',
  size: 12,
  color: '#000000',
  ...overrides,
});

const splitUsingMockLogic = (text: string, maxWidth: number): string[] => {
  if (!text) {
    return [];
  }
  const lines: string[] = [];
  const paragraphs = text.split(/\r?\n/);

  paragraphs.forEach((paragraph) => {
    if (!paragraph) {
      lines.push('');
      return;
    }
    const words = paragraph.split(' ');
    let currentLine = '';

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (computeTextWidth(testLine) <= maxWidth) {
        currentLine = testLine;
      } else if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        let partial = '';
        Array.from(word).forEach((char) => {
          const nextPartial = partial + char;
          if (computeTextWidth(nextPartial) <= maxWidth) {
            partial = nextPartial;
          } else if (partial) {
            lines.push(partial);
            partial = char;
          } else {
            lines.push(char);
            partial = '';
          }
        });
        if (partial) {
          currentLine = partial;
        }
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }
  });

  return lines;
};

const createMockDocWrapper = (): MockDocWrapper => {
  let activeFontConfig: FontConfiguration | null = null;
  const history: FontConfiguration[] = [];
  let lastResult: unknown;

  const mock = {
    withFontConfiguration: jest.fn<
      ReturnType<DocWrapper['withFontConfiguration']>,
      Parameters<DocWrapper['withFontConfiguration']>
    >((fontConfig, callback) => {
      if (fontConfig) {
        history.push(fontConfig);
        activeFontConfig = fontConfig;
      }
      lastResult = callback();
      activeFontConfig = null;
      mock.lastCallbackResult = lastResult;
      return lastResult;
    }),
    getTextDimensions: jest.fn<
      ReturnType<DocWrapper['getTextDimensions']>,
      Parameters<DocWrapper['getTextDimensions']>
    >((text: string, fontStyle?: FontConfiguration) => {
      const fontSize = (fontStyle ?? activeFontConfig ?? history[history.length - 1] ?? createFontConfig()).size;
      return {
        w: computeTextWidth(text),
        h: computeTextHeight(fontSize),
      };
    }),
    splitTextToSize: jest.fn<
      ReturnType<DocWrapper['splitTextToSize']>,
      Parameters<DocWrapper['splitTextToSize']>
    >((text: string | null, maxWidth: number) => splitUsingMockLogic(text ?? '', maxWidth)),
    fontConfigHistory: history,
    lastCallbackResult: lastResult,
  } satisfies MockDocWrapper;

  return mock;
};

describe('JsPdfMeasurer', () => {
  let mockDoc: MockDocWrapper;
  let measurer: JsPdfMeasurer;

  beforeEach(() => {
    mockDoc = createMockDocWrapper();
    measurer = new JsPdfMeasurer(mockDoc as unknown as DocWrapper);
  });

  describe('constructor', () => {
    it('stores DocWrapper instance', () => {
      expect(measurer).toBeInstanceOf(JsPdfMeasurer);
    });

    it('extends BaseMeasurer with width and height helpers', () => {
      expect(typeof measurer.measureTextWidth).toBe('function');
      expect(typeof measurer.measureTextHeight).toBe('function');
    });
  });

  describe('measureText', () => {
    it('delegates to DocWrapper.getTextDimensions', () => {
      const fontConfig = createFontConfig();

      const result = measurer.measureText('Hello', fontConfig);

      expect(mockDoc.withFontConfiguration).toHaveBeenCalledWith(fontConfig, expect.any(Function));
      expect(mockDoc.getTextDimensions).toHaveBeenCalledWith('Hello');
      expect(result).toEqual({
        width: computeTextWidth('Hello'),
        height: computeTextHeight(fontConfig.size),
      });
    });

    it('transforms jsPDF dimensions format', () => {
      const fontConfig = createFontConfig();
      mockDoc.getTextDimensions.mockReturnValueOnce({ w: 50, h: 12 });

      const result = measurer.measureText('Test', fontConfig);

      expect(result).toEqual({ width: 50, height: 12 });
    });

    it('handles empty string', () => {
      const fontConfig = createFontConfig();

      const result = measurer.measureText('', fontConfig);

      expect(result).toEqual({
        width: 0,
        height: computeTextHeight(fontConfig.size),
      });
    });

    it('applies font configuration via withFontConfiguration', () => {
      const fontConfig = createFontConfig({ size: 18, style: 'italic', weight: 'bold' });

      measurer.measureText('Styled text', fontConfig);

      expect(mockDoc.withFontConfiguration).toHaveBeenCalledWith(fontConfig, expect.any(Function));
      expect(mockDoc.fontConfigHistory).toContain(fontConfig);
    });

    it('handles special characters', () => {
      const fontConfig = createFontConfig();

      const result = measurer.measureText('Ñoño', fontConfig);

      expect(result.width).toBe(computeTextWidth('Ñoño'));
    });

    it('handles multi-line text', () => {
      const fontConfig = createFontConfig();

      const result = measurer.measureText('Line1\nLine2', fontConfig);

      expect(mockDoc.getTextDimensions).toHaveBeenCalledWith('Line1\nLine2');
      expect(result.height).toBe(computeTextHeight(fontConfig.size));
    });

    it('returns result from withFontConfiguration callback', () => {
      const fontConfig = createFontConfig();
      mockDoc.withFontConfiguration.mockImplementation((config, callback) => {
        if (!config) {
          throw new Error('Expected font configuration');
        }
        expect(config).toBe(fontConfig);
        const value = callback();
        return value;
      });

      const result = measurer.measureText('Callback', fontConfig);

      expect(result.width).toBeGreaterThan(0);
    });
  });

  describe('measureTextWidth', () => {
    it('returns width from measureText', () => {
      const fontConfig = createFontConfig();
      const spy = jest.spyOn(measurer, 'measureText');

      const width = measurer.measureTextWidth('Hello', fontConfig);

      expect(spy).toHaveBeenCalledWith('Hello', fontConfig);
      expect(width).toBe(computeTextWidth('Hello'));
    });

    it('handles empty string', () => {
      const fontConfig = createFontConfig();

      const width = measurer.measureTextWidth('', fontConfig);

      expect(width).toBe(0);
    });
  });

  describe('measureTextHeight', () => {
    it('returns height from measureText', () => {
      const fontConfig = createFontConfig();
      const spy = jest.spyOn(measurer, 'measureText');

      const height = measurer.measureTextHeight('Hello', fontConfig);

      expect(spy).toHaveBeenCalledWith('Hello', fontConfig);
      expect(height).toBe(computeTextHeight(fontConfig.size));
    });

    it('height is consistent for same font config', () => {
      const fontConfig = createFontConfig();

      const heightA = measurer.measureTextHeight('A', fontConfig);
      const heightB = measurer.measureTextHeight('Z', fontConfig);

      expect(heightA).toBe(heightB);
    });
  });

  describe('splitTextToSize', () => {
    it('delegates to DocWrapper.splitTextToSize', () => {
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('Hello world', 60, fontConfig);

      expect(mockDoc.withFontConfiguration).toHaveBeenCalledWith(fontConfig, expect.any(Function));
      expect(mockDoc.splitTextToSize).toHaveBeenCalledWith('Hello world', 60);
      expect(lines.join(' ')).toBe('Hello world');
    });

    it('returns array of strings from DocWrapper', () => {
      const fontConfig = createFontConfig();
      mockDoc.splitTextToSize.mockReturnValueOnce(['Hello', 'world']);

      const lines = measurer.splitTextToSize('Hello world', 60, fontConfig);

      expect(lines).toEqual(['Hello', 'world']);
    });

    it('handles empty string', () => {
      const fontConfig = createFontConfig();
      mockDoc.splitTextToSize.mockReturnValueOnce([]);

      const lines = measurer.splitTextToSize('', 100, fontConfig);

      expect(lines).toEqual([]);
    });

    it('handles null text', () => {
      const fontConfig = createFontConfig();
      mockDoc.splitTextToSize.mockImplementationOnce((text) => {
        expect(text).toBeNull();
        return [];
      });

      const lines = measurer.splitTextToSize(null as unknown as string, 100, fontConfig);

      expect(lines).toEqual([]);
    });

    it('applies font configuration via withFontConfiguration', () => {
      const fontConfig = createFontConfig({ size: 20 });

      measurer.splitTextToSize('Test text', 70, fontConfig);

      expect(mockDoc.withFontConfiguration).toHaveBeenCalledWith(fontConfig, expect.any(Function));
    });

    it('passes maxWidth to DocWrapper', () => {
      const fontConfig = createFontConfig();

      measurer.splitTextToSize('Long text here', 75, fontConfig);

      expect(mockDoc.splitTextToSize).toHaveBeenCalledWith('Long text here', 75);
    });

    it('handles single line result', () => {
      const fontConfig = createFontConfig();
      mockDoc.splitTextToSize.mockReturnValueOnce(['Short']);

      const lines = measurer.splitTextToSize('Short', 100, fontConfig);

      expect(lines).toEqual(['Short']);
    });

    it('handles multi-line result', () => {
      const fontConfig = createFontConfig();
      mockDoc.splitTextToSize.mockReturnValueOnce(['Line 1', 'Line 2', 'Line 3']);

      const lines = measurer.splitTextToSize('Long text that wraps', 50, fontConfig);

      expect(lines).toEqual(['Line 1', 'Line 2', 'Line 3']);
    });

    it('handles text with line breaks', () => {
      const fontConfig = createFontConfig();
      mockDoc.splitTextToSize.mockImplementationOnce((text, maxWidth) => {
        expect(text).toBe('Line1\nLine2');
        expect(maxWidth).toBe(90);
        return ['Line1', 'Line2'];
      });

      const lines = measurer.splitTextToSize('Line1\nLine2', 90, fontConfig);

      expect(lines).toEqual(['Line1', 'Line2']);
    });

    it('handles special characters', () => {
      const fontConfig = createFontConfig();

      const lines = measurer.splitTextToSize('Ñoño test', 50, fontConfig);

      expect(lines.join(' ')).toBe('Ñoño test');
    });

    it('handles very long text', () => {
      const fontConfig = createFontConfig();
      const text = 'a'.repeat(200);
      const lines = measurer.splitTextToSize(text, 60, fontConfig);

      expect(lines.length).toBeGreaterThan(1);
      expect(lines.join('')).toBe(text);
    });

    it('returns result from withFontConfiguration callback', () => {
      const fontConfig = createFontConfig();
      mockDoc.withFontConfiguration.mockImplementation((config, callback) => {
        if (!config) {
          throw new Error('Expected font configuration');
        }
        expect(config).toBe(fontConfig);
        const value = callback();
        return value;
      });

      const lines = measurer.splitTextToSize('Callback', 40, fontConfig);

      expect(Array.isArray(lines)).toBe(true);
    });
  });

  describe('integration with DocWrapper', () => {
    it('font configuration is applied before measurement', () => {
      const fontConfig = createFontConfig({ size: 18 });
      const callOrder: string[] = [];

      mockDoc.withFontConfiguration.mockImplementation((config, callback) => {
        if (!config) {
          throw new Error('Expected font configuration');
        }
        callOrder.push(`withFont:${config.size}`);
        return callback();
      });
      mockDoc.getTextDimensions.mockImplementation((text) => {
        callOrder.push(`dimensions:${text}`);
        return { w: computeTextWidth(text), h: computeTextHeight(fontConfig.size) };
      });

      measurer.measureText('Order', fontConfig);

      expect(callOrder[0]).toBe(`withFont:${fontConfig.size}`);
      expect(callOrder[1]).toBe('dimensions:Order');
    });

    it('font configuration is applied before splitting', () => {
      const fontConfig = createFontConfig({ size: 16 });
      const callOrder: string[] = [];

      mockDoc.withFontConfiguration.mockImplementation((config, callback) => {
        if (!config) {
          throw new Error('Expected font configuration');
        }
        callOrder.push(`withFont:${config.size}`);
        return callback();
      });
      mockDoc.splitTextToSize.mockImplementation((text, limit) => {
        callOrder.push(`split:${limit}`);
        return splitUsingMockLogic(text ?? '', limit);
      });

      measurer.splitTextToSize('Order', 80, fontConfig);

      expect(callOrder[0]).toBe(`withFont:${fontConfig.size}`);
      expect(callOrder[1]).toBe('split:80');
    });

    it('multiple measurements with different font configs', () => {
      const fontConfig1 = createFontConfig({ size: 12 });
      const fontConfig2 = createFontConfig({ size: 20 });

      measurer.measureText('Test', fontConfig1);
      measurer.measureText('Test', fontConfig2);

      expect(mockDoc.fontConfigHistory).toEqual([fontConfig1, fontConfig2]);
    });

    it('withFontConfiguration callback is executed synchronously', () => {
      const fontConfig = createFontConfig();
      let callbackCompleted = false;

      mockDoc.withFontConfiguration.mockImplementation((config, callback) => {
        if (!config) {
          throw new Error('Expected font configuration');
        }
        expect(config).toBe(fontConfig);
        const value = callback();
        callbackCompleted = true;
        return value;
      });

      const result = measurer.measureText('Sync', fontConfig);

      expect(callbackCompleted).toBe(true);
      expect(result.width).toBeGreaterThan(0);
    });
  });
});
