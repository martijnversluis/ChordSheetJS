import { createColumnBreakLineLayout } from '../../layout_helpers';
import { LineLayout, ParagraphSplitStrategy } from '../../types';

export class FourLinesParagraphSplitStrategy implements ParagraphSplitStrategy {
  splitParagraph(
    lineLayouts: LineLayout[][],
    currentY: number,
    columnStartY: number,
    columnBottomY: number,
  ): LineLayout[][] {
    if (lineLayouts.length === 0) {
      return [];
    }

    const { splitIndex, heightFirstPart } = this.findSplitMetadata(lineLayouts);

    if (splitIndex === null) {
      return this.prependColumnBreakIfNeeded(lineLayouts, currentY, columnStartY);
    }

    if (currentY + heightFirstPart <= columnBottomY) {
      return this.buildSplitResult(lineLayouts, splitIndex);
    }

    return this.prependColumnBreakIfNeeded(lineLayouts, currentY, columnStartY);
  }

  private findSplitMetadata(lineLayouts: LineLayout[][]): { splitIndex: number | null; heightFirstPart: number } {
    let chordLyricPairLinesSeen = 0;
    let heightFirstPart = 0;

    for (let i = 0; i < lineLayouts.length; i += 1) {
      const { height, chordCount } = this.summarizeLineLayout(lineLayouts[i]);

      chordLyricPairLinesSeen += chordCount;
      heightFirstPart += height;

      if (chordLyricPairLinesSeen >= 2) {
        return { splitIndex: i + 1, heightFirstPart };
      }
    }

    return { splitIndex: null, heightFirstPart };
  }

  private summarizeLineLayout(lines: LineLayout[]): { height: number; chordCount: number } {
    return lines.reduce<{ height: number; chordCount: number }>((acc, lineLayout) => ({
      height: acc.height + lineLayout.lineHeight,
      chordCount: acc.chordCount + (lineLayout.type === 'ChordLyricsPair' ? 1 : 0),
    }), { height: 0, chordCount: 0 });
  }

  private buildSplitResult(lineLayouts: LineLayout[][], splitIndex: number): LineLayout[][] {
    const firstPart = lineLayouts.slice(0, splitIndex);
    const secondPart = lineLayouts.slice(splitIndex);

    return firstPart
      .concat([[createColumnBreakLineLayout()]])
      .concat(secondPart);
  }

  private prependColumnBreakIfNeeded(
    lineLayouts: LineLayout[][],
    currentY: number,
    columnStartY: number,
  ): LineLayout[][] {
    if (currentY === columnStartY) {
      return lineLayouts;
    }

    return [[createColumnBreakLineLayout()]].concat(lineLayouts);
  }
}
