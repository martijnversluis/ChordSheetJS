import Dimensions from '../../src/layout/engine/dimensions';
import MeasuredHtmlFormatter from '../../src/formatter/measured_html_formatter';
import Song from '../../src/chord_sheet/song';

import { LayoutConfig } from '../../src/layout/engine';

const mockLayoutConfigs: LayoutConfig[] = [];
let mockDimensions: Dimensions;

jest.mock('../../src/layout/engine', () => {
  const actual = jest.requireActual('../../src/layout/engine');

  return {
    ...actual,
    LayoutEngine: jest.fn().mockImplementation((_song, _measurer, config: LayoutConfig) => {
      mockLayoutConfigs.push(config);
      return {
        computeParagraphLayouts: () => [],
        getComputedPageCount: () => 1,
      };
    }),
  };
});

jest.mock('../../src/layout/measurement', () => ({
  DomMeasurer: jest.fn(),
}));

jest.mock('../../src/rendering/html/positioned_html_renderer', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    dispose: jest.fn(),
    getContentBottomY: () => 1_000,
    getContentStartY: () => 0,
    getDocumentMetadata: () => ({ dimensions: mockDimensions }),
    getHTML: () => ({}),
    initialize: jest.fn(),
    render: jest.fn(),
  })),
}));

describe('MeasuredHtmlFormatter', () => {
  beforeEach(() => {
    mockLayoutConfigs.length = 0;
  });

  it('uses the responsive renderer column count for layout simulation', () => {
    const formatter = new MeasuredHtmlFormatter({ firstChild: null } as any);
    formatter.configure({
      pageSize: { width: 832, height: 1_080 },
      layout: {
        global: {
          margins: {
            top: 18,
            left: 48,
            right: 32,
            bottom: 10,
          },
        },
        sections: {
          global: {
            columnSpacing: 48,
            minColumnWidth: 350,
            maxColumnWidth: 400,
          },
        },
      },
    });

    const { layout } = formatter.configuration;
    mockDimensions = new Dimensions(832, 1_080, layout, {
      columnCount: layout.sections.global.columnCount,
      columnSpacing: layout.sections.global.columnSpacing,
      minColumnWidth: layout.sections.global.minColumnWidth,
      maxColumnWidth: layout.sections.global.maxColumnWidth,
    });

    expect(layout.sections.global.columnCount).toBeUndefined();
    expect(mockDimensions.effectiveColumnCount).toBe(2);

    formatter.format(new Song());

    expect(mockLayoutConfigs).toHaveLength(1);
    expect(mockLayoutConfigs[0].columnCount).toBe(2);
  });
});
