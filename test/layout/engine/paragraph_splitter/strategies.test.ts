import * as FiveOrMoreStrategyModule
  from '../../../../src/layout/engine/paragraph_splitter/strategies/five_or_more_lines_paragraph_split_strategy';
import * as FourLinesStrategyModule
  from '../../../../src/layout/engine/paragraph_splitter/strategies/four_lines_paragraph_split_strategy';
import * as ThreeOrLessStrategyModule from
  '../../../../src/layout/engine/paragraph_splitter/strategies/three_or_less_lines_paragraph_split_strategy';
import ChordLyricsPair from '../../../../src/chord_sheet/chord_lyrics_pair';
import Line from '../../../../src/chord_sheet/line';
import Tag from '../../../../src/chord_sheet/tag';
import type { LineLayout, MeasuredItem } from '../../../../src/layout/engine/types';
import {
  createColumnBreakLineLayout,
  isColumnBreakLayout,
} from '../../../../src/layout/engine/layout_helpers';

const {
  FiveOrMoreLinesParagraphSplitStrategy,
} = FiveOrMoreStrategyModule;
const { FourLinesParagraphSplitStrategy } = FourLinesStrategyModule;
const {
  ThreeOrLessLinesParagraphSplitStrategy,
} = ThreeOrLessStrategyModule;

type LineLayoutUnit = LineLayout[][];

const DEFAULT_LINE_HEIGHT = 12;

const createMeasuredItem = (item: MeasuredItem['item'], width: number): MeasuredItem => ({
  item,
  width,
});

const createLineLayout = (
  type: LineLayout['type'],
  lineHeight: number,
  items: MeasuredItem[],
): LineLayout => ({
  type,
  lineHeight,
  items,
  line: new Line(),
});

const createChordLyricLineLayout = (
  lineHeight = DEFAULT_LINE_HEIGHT,
  chords = 'C',
  lyrics = 'Sample lyrics',
): LineLayout => createLineLayout(
  'ChordLyricsPair',
  lineHeight,
  [createMeasuredItem(new ChordLyricsPair(chords, lyrics), 50)],
);

const createCommentLineLayout = (
  lineHeight = DEFAULT_LINE_HEIGHT,
  comment = 'Sample comment',
): LineLayout => createLineLayout(
  'Comment',
  lineHeight,
  [createMeasuredItem(new Tag('comment', comment), 40)],
);

const createSectionLabelLineLayout = (
  lineHeight = DEFAULT_LINE_HEIGHT,
  label = 'Chorus 1',
): LineLayout => createLineLayout(
  'SectionLabel',
  lineHeight,
  [createMeasuredItem(new Tag('start_of_chorus', label), 40)],
);

const createEmptyLineLayout = (lineHeight = DEFAULT_LINE_HEIGHT): LineLayout => createLineLayout(
  'Empty',
  lineHeight,
  [createMeasuredItem(null, 0)],
);

const toUnits = (...lineLayouts: LineLayout[]): LineLayoutUnit => lineLayouts.map((lineLayout) => [lineLayout]);

const wrapUnit = (...lineLayouts: LineLayout[]): LineLayout[] => lineLayouts;

const countColumnBreaks = (lineLayouts: LineLayoutUnit): number => lineLayouts
  .filter((unit) => isColumnBreakLayout(unit))
  .length;

const getTotalHeight = (lineLayouts: LineLayoutUnit): number => lineLayouts
  .filter((unit) => !isColumnBreakLayout(unit))
  .reduce((sum, unit) => (
    sum + unit.reduce((innerSum, lineLayout) => innerSum + lineLayout.lineHeight, 0)
  ), 0);

const flattenLineLayouts = (lineLayouts: LineLayoutUnit): LineLayout[] => lineLayouts.flat();

describe('ThreeOrLessLinesParagraphSplitStrategy', () => {
  const strategy = new ThreeOrLessLinesParagraphSplitStrategy();
  const columnStartY = 0;
  const columnBottomY = 100;

  it('paragraph at top of column keeps layout unchanged', () => {
    const paragraph = toUnits(
      createChordLyricLineLayout(),
      createChordLyricLineLayout(),
      createChordLyricLineLayout(),
    );

    const result = strategy.splitParagraph(paragraph, columnStartY, columnStartY, columnBottomY);

    expect(result).toEqual(paragraph);
    expect(countColumnBreaks(result)).toBe(0);
  });

  it('paragraph not at top inserts column break first', () => {
    const paragraph = toUnits(
      createChordLyricLineLayout(),
      createChordLyricLineLayout(),
    );

    const result = strategy.splitParagraph(paragraph, 24, columnStartY, columnBottomY);

    expect(result[0]).toEqual([createColumnBreakLineLayout()]);
    expect(result.slice(1)).toEqual(paragraph);
    expect(countColumnBreaks(result)).toBe(1);
  });

  it('handles mixed line types correctly', () => {
    const paragraph = [
      wrapUnit(createSectionLabelLineLayout()),
      wrapUnit(createChordLyricLineLayout()),
      wrapUnit(createCommentLineLayout()),
      wrapUnit(createChordLyricLineLayout()),
    ];

    const result = strategy.splitParagraph(paragraph, 36, columnStartY, columnBottomY);

    expect(isColumnBreakLayout(result[0])).toBe(true);
    expect(result.slice(1)).toEqual(paragraph);
  });

  it('handles empty paragraph gracefully', () => {
    const paragraph: LineLayoutUnit = [];

    const result = strategy.splitParagraph(paragraph, columnStartY, columnStartY, columnBottomY);

    expect(result).toEqual([]);
  });

  it('handles single line paragraph column break logic', () => {
    const paragraph = toUnits(createChordLyricLineLayout());

    const atTopResult = strategy.splitParagraph(paragraph, columnStartY, columnStartY, columnBottomY);
    const midColumnResult = strategy.splitParagraph(paragraph, 20, columnStartY, columnBottomY);

    expect(atTopResult).toEqual(paragraph);
    expect(isColumnBreakLayout(midColumnResult[0])).toBe(true);
    expect(midColumnResult.slice(1)).toEqual(paragraph);
  });

  it('treats paragraphs with only comments like other paragraphs', () => {
    const paragraph = toUnits(createCommentLineLayout());

    const result = strategy.splitParagraph(paragraph, 20, columnStartY, columnBottomY);

    expect(isColumnBreakLayout(result[0])).toBe(true);
    expect(result.slice(1)).toEqual(paragraph);
  });
});

describe('FourLinesParagraphSplitStrategy', () => {
  const strategy = new FourLinesParagraphSplitStrategy();
  const columnStartY = 0;

  const createFourLineParagraph = (): LineLayoutUnit => toUnits(
    createChordLyricLineLayout(),
    createChordLyricLineLayout(),
    createChordLyricLineLayout(),
    createChordLyricLineLayout(),
  );

  it('splits after 2nd chord line when first part fits', () => {
    const paragraph = createFourLineParagraph();
    const columnBottomY = 40 + (DEFAULT_LINE_HEIGHT * 4);

    const result = strategy.splitParagraph(paragraph, 0, columnStartY, columnBottomY);

    expect(result).toHaveLength(5);
    expect(countColumnBreaks(result)).toBe(1);
    expect(result.slice(0, 2)).toEqual(paragraph.slice(0, 2));
    expect(isColumnBreakLayout(result[2])).toBe(true);
    expect(result.slice(3)).toEqual(paragraph.slice(2));
  });

  it('moves entire paragraph when first part does not fit and not at top', () => {
    const paragraph = createFourLineParagraph();
    const columnBottomY = DEFAULT_LINE_HEIGHT + 5;

    const result = strategy.splitParagraph(paragraph, 10, columnStartY, columnBottomY);

    expect(result[0]).toEqual([createColumnBreakLineLayout()]);
    expect(result.slice(1)).toEqual(paragraph);
  });

  it('keeps paragraph together at top when first part does not fit', () => {
    const paragraph = createFourLineParagraph();
    const columnBottomY = DEFAULT_LINE_HEIGHT - 1;

    const result = strategy.splitParagraph(paragraph, columnStartY, columnStartY, columnBottomY);

    expect(result).toEqual(paragraph);
    expect(countColumnBreaks(result)).toBe(0);
  });

  it('counts only chord lines when comments included', () => {
    const paragraph: LineLayoutUnit = [
      wrapUnit(createCommentLineLayout()),
      wrapUnit(createChordLyricLineLayout()),
      wrapUnit(createCommentLineLayout()),
      wrapUnit(createChordLyricLineLayout()),
      wrapUnit(createChordLyricLineLayout()),
      wrapUnit(createChordLyricLineLayout()),
    ];

    const columnBottomY = 100;

    const result = strategy.splitParagraph(paragraph, 0, columnStartY, columnBottomY);

    expect(countColumnBreaks(result)).toBe(1);
    expect(result.slice(0, 4)).toEqual(paragraph.slice(0, 4));
    expect(result.slice(5)).toEqual(paragraph.slice(4));
  });

  it('keeps section label with initial portion', () => {
    const paragraph: LineLayoutUnit = [
      wrapUnit(createSectionLabelLineLayout()),
      wrapUnit(createChordLyricLineLayout()),
      wrapUnit(createChordLyricLineLayout()),
      wrapUnit(createChordLyricLineLayout()),
      wrapUnit(createChordLyricLineLayout()),
    ];

    const columnBottomY = 120;

    const result = strategy.splitParagraph(paragraph, 0, columnStartY, columnBottomY);

    expect(countColumnBreaks(result)).toBe(1);
    expect(result[0]).toEqual(paragraph[0]);
    expect(result.slice(1, 3)).toEqual(paragraph.slice(1, 3));
  });

  it('preserves nested structures when splitting', () => {
    const firstUnit = wrapUnit(createChordLyricLineLayout(), createChordLyricLineLayout());
    const secondUnit = wrapUnit(createChordLyricLineLayout(), createChordLyricLineLayout());
    const paragraph: LineLayoutUnit = [firstUnit, secondUnit];

    const columnBottomY = 120;

    const result = strategy.splitParagraph(paragraph, 0, columnStartY, columnBottomY);

    expect(result[0]).toBe(firstUnit);
    expect(isColumnBreakLayout(result[1])).toBe(true);
    expect(result[2]).toBe(secondUnit);
  });

  it('splits when exact fit on first part', () => {
    const paragraph = createFourLineParagraph();
    const heightFirstPart = paragraph.slice(0, 2).reduce((sum, unit) => sum + unit[0].lineHeight, 0);
    const columnBottomY = heightFirstPart;

    const result = strategy.splitParagraph(paragraph, 0, columnStartY, columnBottomY);

    expect(countColumnBreaks(result)).toBe(1);
  });

  it('behaves with three chord-lyric lines boundary case', () => {
    const paragraph = toUnits(
      createChordLyricLineLayout(),
      createChordLyricLineLayout(),
      createChordLyricLineLayout(),
    );

    const columnBottomY = 100;

    const result = strategy.splitParagraph(paragraph, 0, columnStartY, columnBottomY);

    expect(countColumnBreaks(result)).toBe(1);
  });
});

describe('FiveOrMoreLinesParagraphSplitStrategy', () => {
  const columnStartY = 0;

  const createParagraph = (count: number, lineHeight = DEFAULT_LINE_HEIGHT): LineLayoutUnit => {
    const lines = Array.from({ length: count }, (_, idx) => (
      createChordLyricLineLayout(lineHeight, `C${idx + 1}`, `Lyrics ${idx + 1}`)
    ));
    return toUnits(...lines);
  };

  it('constructor stores chord lyric line count', () => {
    const paragraph = createParagraph(5);
    const currentY = 10;
    const heightFirstThree = paragraph.slice(0, 3).reduce((sum, unit) => sum + unit[0].lineHeight, 0);
    const columnBottomY = currentY + heightFirstThree;

    const incorrectStrategy = new FiveOrMoreLinesParagraphSplitStrategy(3);
    const incorrectResult = incorrectStrategy.splitParagraph(paragraph, currentY, columnStartY, columnBottomY);

    expect(countColumnBreaks(incorrectResult)).toBe(1);
    expect(incorrectResult[0]).toEqual([createColumnBreakLineLayout()]);
    expect(incorrectResult.slice(1)).toEqual(paragraph);

    const correctStrategy = new FiveOrMoreLinesParagraphSplitStrategy(5);
    const correctResult = correctStrategy.splitParagraph(paragraph, currentY, columnStartY, columnBottomY);

    expect(countColumnBreaks(correctResult)).toBe(1);
    const breakIndex = correctResult.findIndex((unit) => isColumnBreakLayout(unit));
    expect(breakIndex).toBeGreaterThan(0);
    expect(correctResult.slice(0, breakIndex)).toEqual(paragraph.slice(0, 3));
    expect(correctResult.slice(breakIndex + 1)).toEqual(paragraph.slice(3));
  });

  it('splits five-line paragraph at optimal point when fits', () => {
    const paragraph = createParagraph(5);
    const heightFirstThree = paragraph.slice(0, 3).reduce((sum, unit) => sum + unit[0].lineHeight, 0);
    const strategy = new FiveOrMoreLinesParagraphSplitStrategy(5);

    const result = strategy.splitParagraph(paragraph, 0, columnStartY, heightFirstThree + 5);

    expect(countColumnBreaks(result)).toBe(1);
    expect(result.slice(0, 3)).toEqual(paragraph.slice(0, 3));
    expect(isColumnBreakLayout(result[3])).toBe(true);
    expect(result.slice(4)).toEqual(paragraph.slice(3));
  });

  it('chooses split with most lines in first part when multiple fit', () => {
    const paragraph = createParagraph(6);
    const heightFirstFour = paragraph.slice(0, 4).reduce((sum, unit) => sum + unit[0].lineHeight, 0);
    const strategy = new FiveOrMoreLinesParagraphSplitStrategy(6);

    const result = strategy.splitParagraph(paragraph, 0, columnStartY, heightFirstFour + 2);

    expect(countColumnBreaks(result)).toBe(1);
    expect(result.slice(0, 4)).toEqual(paragraph.slice(0, 4));
    expect(result.slice(5)).toEqual(paragraph.slice(4));
  });

  it('handles paragraphs with seven or more lines', () => {
    const paragraph = createParagraph(8);
    const heightFirstFive = paragraph.slice(0, 5).reduce((sum, unit) => sum + unit[0].lineHeight, 0);
    const strategy = new FiveOrMoreLinesParagraphSplitStrategy(8);

    const result = strategy.splitParagraph(paragraph, 0, columnStartY, heightFirstFive + 1);

    expect(countColumnBreaks(result)).toBe(1);
    expect(result.slice(0, 5)).toEqual(paragraph.slice(0, 5));
    expect(result.slice(6)).toEqual(paragraph.slice(5));
  });

  it('moves entire paragraph when no split fits and not at top', () => {
    const paragraph = createParagraph(5, 30);
    const strategy = new FiveOrMoreLinesParagraphSplitStrategy(5);

    const columnBottomY = 65;

    const result = strategy.splitParagraph(paragraph, 10, columnStartY, columnBottomY);

    expect(result[0]).toEqual([createColumnBreakLineLayout()]);
    expect(result.slice(1)).toEqual(paragraph);
  });

  it('keeps paragraph at top when no split fits', () => {
    const paragraph = createParagraph(5, 30);
    const strategy = new FiveOrMoreLinesParagraphSplitStrategy(5);

    const columnBottomY = 59;

    const result = strategy.splitParagraph(paragraph, columnStartY, columnStartY, columnBottomY);

    expect(result).toEqual(paragraph);
  });

  it('handles mixed line types without counting comments', () => {
    const paragraph: LineLayoutUnit = [
      wrapUnit(createSectionLabelLineLayout()),
      wrapUnit(createChordLyricLineLayout()),
      wrapUnit(createCommentLineLayout()),
      wrapUnit(createChordLyricLineLayout()),
      wrapUnit(createEmptyLineLayout()),
      wrapUnit(createChordLyricLineLayout()),
      wrapUnit(createChordLyricLineLayout()),
    ];
    const strategy = new FiveOrMoreLinesParagraphSplitStrategy(4);

    const heightFirstFour = paragraph.slice(0, 4).reduce((sum, unit) => sum + unit[0].lineHeight, 0);

    const result = strategy.splitParagraph(paragraph, 0, columnStartY, heightFirstFour + 1);

    expect(countColumnBreaks(result)).toBe(1);
    expect(result.slice(0, 4)).toEqual(paragraph.slice(0, 4));
    expect(result.slice(5)).toEqual(paragraph.slice(4));
  });

  it('preserves nested layout structure during splitting', () => {
    const firstUnit = wrapUnit(createChordLyricLineLayout(), createCommentLineLayout());
    const secondUnit = wrapUnit(createChordLyricLineLayout(), createChordLyricLineLayout());
    const thirdUnit = wrapUnit(createChordLyricLineLayout());
    const paragraph: LineLayoutUnit = [firstUnit, secondUnit, thirdUnit];
    const strategy = new FiveOrMoreLinesParagraphSplitStrategy(4);

    const heightFirstFour = [firstUnit, secondUnit]
      .flat()
      .filter((line) => line.type === 'ChordLyricsPair')
      .length * DEFAULT_LINE_HEIGHT;

    const result = strategy.splitParagraph(paragraph, 0, columnStartY, heightFirstFour + DEFAULT_LINE_HEIGHT);

    expect(countColumnBreaks(result)).toBe(1);
    expect(result[0]).toBe(firstUnit);

    const breakIndex = result.findIndex((unit) => isColumnBreakLayout(unit));
    expect(breakIndex).toBeGreaterThan(0);

    const beforeBreakUnit = result[breakIndex - 1];
    expect(beforeBreakUnit).toEqual([secondUnit[0]]);

    const afterBreakUnit = result[breakIndex + 1];
    expect(afterBreakUnit).toEqual([secondUnit[1]]);

    expect(result[breakIndex + 2]).toBe(thirdUnit);
  });

  it('splits at unit boundary when acceptable split aligns', () => {
    const firstUnit = wrapUnit(createChordLyricLineLayout(), createChordLyricLineLayout());
    const secondUnit = wrapUnit(createChordLyricLineLayout(), createChordLyricLineLayout());
    const thirdUnit = wrapUnit(createChordLyricLineLayout());
    const paragraph: LineLayoutUnit = [firstUnit, secondUnit, thirdUnit];
    const strategy = new FiveOrMoreLinesParagraphSplitStrategy(5);

    const firstUnitHeight = firstUnit.reduce((sum, line) => sum + line.lineHeight, 0);

    const result = strategy.splitParagraph(paragraph, 0, columnStartY, firstUnitHeight);

    expect(countColumnBreaks(result)).toBe(1);
    expect(result[0]).toBe(firstUnit);

    const breakIndex = result.findIndex((unit) => isColumnBreakLayout(unit));
    expect(breakIndex).toBe(1);
    expect(result[breakIndex + 1]).toBe(secondUnit);
    expect(result[breakIndex + 2]).toBe(thirdUnit);
  });

  it('does not split when minimum chord line constraint not met', () => {
    const paragraph = createParagraph(3);
    const strategy = new FiveOrMoreLinesParagraphSplitStrategy(3);

    const result = strategy.splitParagraph(paragraph, 10, columnStartY, 200);

    expect(result[0]).toEqual([createColumnBreakLineLayout()]);
    expect(result.slice(1)).toEqual(paragraph);
  });

  it('uses first acceptable split when only option fits', () => {
    const paragraph = createParagraph(8);
    const strategy = new FiveOrMoreLinesParagraphSplitStrategy(8);
    const columnBottomY = (2 * DEFAULT_LINE_HEIGHT) + 1;

    const result = strategy.splitParagraph(paragraph, 0, columnStartY, columnBottomY);

    expect(countColumnBreaks(result)).toBe(1);

    const breakIndex = result.findIndex((unit) => isColumnBreakLayout(unit));
    expect(breakIndex).toBeGreaterThan(0);

    const preBreakUnits = result.slice(0, breakIndex);
    preBreakUnits.forEach((unit, index) => {
      expect(unit).toBe(paragraph[index]);
    });

    const chordLinesBeforeBreak = flattenLineLayouts(preBreakUnits)
      .filter((line) => line.type === 'ChordLyricsPair')
      .length;
    expect(chordLinesBeforeBreak).toBe(2);
  });

  it('chooses split with most lines when all acceptable fits', () => {
    const paragraph = createParagraph(6);
    const heightFirstFour = paragraph.slice(0, 4).reduce((sum, unit) => sum + unit[0].lineHeight, 0);
    const strategy = new FiveOrMoreLinesParagraphSplitStrategy(6);

    const result = strategy.splitParagraph(paragraph, 0, columnStartY, heightFirstFour + DEFAULT_LINE_HEIGHT);

    expect(countColumnBreaks(result)).toBe(1);
    expect(result.slice(0, 4)).toEqual(paragraph.slice(0, 4));
  });

  it('handles exact boundary case with five lines', () => {
    const paragraph = createParagraph(5);
    const heightFirstThree = paragraph.slice(0, 3).reduce((sum, unit) => sum + unit[0].lineHeight, 0);
    const strategy = new FiveOrMoreLinesParagraphSplitStrategy(5);

    const result = strategy.splitParagraph(paragraph, 0, columnStartY, heightFirstThree);

    expect(countColumnBreaks(result)).toBe(1);
    expect(result.slice(0, 3)).toEqual(paragraph.slice(0, 3));
  });

  it('respects section labels at paragraph boundaries', () => {
    const paragraph: LineLayoutUnit = [
      wrapUnit(createSectionLabelLineLayout(DEFAULT_LINE_HEIGHT, 'Chorus 1')),
      wrapUnit(createChordLyricLineLayout()),
      wrapUnit(createChordLyricLineLayout()),
      wrapUnit(createChordLyricLineLayout()),
      wrapUnit(createChordLyricLineLayout()),
      wrapUnit(createSectionLabelLineLayout(DEFAULT_LINE_HEIGHT, 'End Chorus')),
      wrapUnit(createChordLyricLineLayout()),
      wrapUnit(createChordLyricLineLayout()),
    ];
    const strategy = new FiveOrMoreLinesParagraphSplitStrategy(6);

    const heightFirstFive = paragraph.slice(0, 5).reduce((sum, unit) => sum + unit[0].lineHeight, 0);

    const result = strategy.splitParagraph(paragraph, 0, columnStartY, heightFirstFive + 1);

    expect(countColumnBreaks(result)).toBe(1);
    expect(result[0]).toEqual(paragraph[0]);
    expect(result.slice(1, 5)).toEqual(paragraph.slice(1, 5));
  });
});

describe('Strategy Integration', () => {
  const columnStartY = 0;
  const columnBottomY = 1000;

  it('all strategies handle empty paragraphs', () => {
    const cases = [
      {
        strategy: new ThreeOrLessLinesParagraphSplitStrategy(),
        expected: [],
      },
      {
        strategy: new FourLinesParagraphSplitStrategy(),
        expected: [],
      },
      {
        strategy: new FiveOrMoreLinesParagraphSplitStrategy(5),
        expected: [],
      },
    ];

    cases.forEach(({ strategy, expected }) => {
      expect(strategy.splitParagraph([], columnStartY, columnStartY, columnBottomY)).toEqual(expected);
    });
  });

  it('all strategies respect column boundaries when paragraph fits', () => {
    const cases = [
      {
        strategy: new ThreeOrLessLinesParagraphSplitStrategy(),
        paragraph: toUnits(createChordLyricLineLayout()),
        expectedBreaks: 0,
      },
      {
        strategy: new FourLinesParagraphSplitStrategy(),
        paragraph: toUnits(
          createChordLyricLineLayout(),
          createChordLyricLineLayout(),
          createChordLyricLineLayout(),
          createChordLyricLineLayout(),
        ),
        expectedBreaks: 1,
      },
      {
        strategy: new FiveOrMoreLinesParagraphSplitStrategy(5),
        paragraph: toUnits(
          createChordLyricLineLayout(),
          createChordLyricLineLayout(),
          createChordLyricLineLayout(),
          createChordLyricLineLayout(),
          createChordLyricLineLayout(),
        ),
        expectedBreaks: 1,
      },
    ];

    cases.forEach(({ strategy, paragraph, expectedBreaks }) => {
      const result = strategy.splitParagraph(paragraph, columnStartY, columnStartY, columnBottomY);
      expect(countColumnBreaks(result)).toBe(expectedBreaks);
      expect(getTotalHeight(result)).toBe(getTotalHeight(paragraph));
    });
  });

  it('column breaks share consistent format', () => {
    const strategies = [
      new ThreeOrLessLinesParagraphSplitStrategy(),
      new FourLinesParagraphSplitStrategy(),
      new FiveOrMoreLinesParagraphSplitStrategy(5),
    ];

    const paragraph = toUnits(
      createChordLyricLineLayout(),
      createChordLyricLineLayout(),
      createChordLyricLineLayout(),
      createChordLyricLineLayout(),
      createChordLyricLineLayout(),
    );

    strategies.forEach((strategy) => {
      const result = strategy.splitParagraph(paragraph, 50, columnStartY, 80);
      const breakUnits = result.filter((unit) => isColumnBreakLayout(unit));
      breakUnits.forEach((unit) => expect(unit).toEqual([createColumnBreakLineLayout()]));
    });
  });

  it('calculates heights accurately against column bottom', () => {
    const paragraph = toUnits(
      createChordLyricLineLayout(20),
      createChordLyricLineLayout(30),
      createChordLyricLineLayout(40),
    );
    const localColumnBottomY = 55;

    const strategy = new FourLinesParagraphSplitStrategy();
    const result = strategy.splitParagraph(paragraph, 10, columnStartY, localColumnBottomY);

    const expectedHeight = paragraph.slice(0, 2).reduce((sum, unit) => sum + unit[0].lineHeight, 0);
    expect(result[0]).toEqual([createColumnBreakLineLayout()]);
    expect(getTotalHeight(result.slice(1))).toBe(paragraph.reduce((sum, unit) => sum + unit[0].lineHeight, 0));
    expect(expectedHeight).toBe(50);
  });
});
