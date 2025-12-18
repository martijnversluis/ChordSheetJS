import { createColumnBreakLineLayout } from '../../layout_helpers';
import { LineLayout, ParagraphSplitStrategy } from '../../types';

interface PartitionAccumulator {
  firstPart: LineLayout[][];
  secondPart: LineLayout[][];
  processed: number;
}

export class FiveOrMoreLinesParagraphSplitStrategy implements ParagraphSplitStrategy {
  private totalChordLyricPairLines!: number;

  constructor(
    private chordLyricLineCount: number,
  ) {
    this.totalChordLyricPairLines = chordLyricLineCount;
  }

  splitParagraph(
    lineLayouts: LineLayout[][],
    currentY: number,
    columnStartY: number,
    columnBottomY: number,
  ): LineLayout[][] {
    const flatLineLayouts = this.flattenLineLayouts(lineLayouts);
    const splitResult = this.trySplitParagraph(
      lineLayouts,
      flatLineLayouts,
      currentY,
      columnBottomY,
    );

    if (splitResult) {
      return splitResult;
    }

    if (currentY !== columnStartY) {
      return [[createColumnBreakLineLayout()], ...lineLayouts];
    }

    return lineLayouts;
  }

  private trySplitParagraph(
    lineLayouts: LineLayout[][],
    flatLineLayouts: LineLayout[],
    currentY: number,
    columnBottomY: number,
  ): LineLayout[][] | null {
    const acceptableSplits = this.findAcceptableSplits(flatLineLayouts);
    const selectedSplit = this.selectSplit(acceptableSplits, currentY, columnBottomY);

    if (selectedSplit) {
      return this.buildSplitResult(lineLayouts, selectedSplit.index);
    }

    return null;
  }

  private selectSplit(
    acceptableSplits: { index: number; heightFirstPart: number }[],
    currentY: number,
    columnBottomY: number,
  ): { index: number; heightFirstPart: number } | null {
    for (let i = acceptableSplits.length - 1; i >= 0; i -= 1) {
      const split = acceptableSplits[i];

      if (currentY + split.heightFirstPart <= columnBottomY) {
        return split;
      }
    }

    return null;
  }

  private buildSplitResult(
    lineLayouts: LineLayout[][],
    splitIndex: number,
  ): LineLayout[][] {
    const { firstPart, secondPart } = this.partitionLineLayouts(lineLayouts, splitIndex);
    return [...firstPart, [createColumnBreakLineLayout()], ...secondPart];
  }

  private flattenLineLayouts(lineLayouts: LineLayout[][]): LineLayout[] {
    const flatLineLayouts: LineLayout[] = [];

    lineLayouts.forEach((unit) => {
      unit.forEach((lineLayout) => {
        flatLineLayouts.push(lineLayout);
      });
    });

    return flatLineLayouts;
  }

  private findAcceptableSplits(flatLineLayouts: LineLayout[]): { index: number; heightFirstPart: number }[] {
    let heightFirstPart = 0;
    let chordCount = 0;

    return flatLineLayouts
      .slice(0, -1)
      .reduce<{ index: number; heightFirstPart: number }[]>((splits, lineLayout, index) => {
        heightFirstPart += lineLayout.lineHeight;
        chordCount += lineLayout.type === 'ChordLyricsPair' ? 1 : 0;

        const remaining = this.totalChordLyricPairLines - chordCount;
        if (chordCount >= 2 && remaining >= 2) {
          splits.push({ index: index + 1, heightFirstPart });
        }

        return splits;
      }, []);
  }

  private partitionLineLayouts(
    lineLayouts: LineLayout[][],
    splitIndex: number,
  ): { firstPart: LineLayout[][]; secondPart: LineLayout[][] } {
    const result = lineLayouts.reduce<PartitionAccumulator>(
      (accumulator, unit) => this.partitionReducer(accumulator, unit, splitIndex),
      { firstPart: [], secondPart: [], processed: 0 },
    );

    return { firstPart: result.firstPart, secondPart: result.secondPart };
  }

  private partitionReducer(
    accumulator: PartitionAccumulator,
    unit: LineLayout[],
    splitIndex: number,
  ): PartitionAccumulator {
    const unitLength = unit.length;
    const fitsBeforeSplit = accumulator.processed + unitLength <= splitIndex;
    const isAfterSplit = accumulator.processed >= splitIndex;

    if (fitsBeforeSplit) {
      accumulator.firstPart.push(unit);
    } else if (isAfterSplit) {
      accumulator.secondPart.push(unit);
    } else {
      const splitPoint = splitIndex - accumulator.processed;
      accumulator.firstPart.push(unit.slice(0, splitPoint));
      accumulator.secondPart.push(unit.slice(splitPoint));
    }

    accumulator.processed += unitLength;
    return accumulator;
  }
}
