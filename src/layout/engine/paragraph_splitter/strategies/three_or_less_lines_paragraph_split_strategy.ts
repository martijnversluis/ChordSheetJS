import { createColumnBreakLineLayout } from '../../layout_helpers';
import { LineLayout, ParagraphSplitStrategy } from '../../types';

export class ThreeOrLessLinesParagraphSplitStrategy implements ParagraphSplitStrategy {
  splitParagraph(
    lineLayouts: LineLayout[][],
    currentY: number,
    columnStartY: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    columnBottomY: number,
  ): LineLayout[][] {
    const newLineLayouts: LineLayout[][] = [];

    // Insert column break before the paragraph if not at the top of the column
    if (currentY !== columnStartY) {
      newLineLayouts.push([createColumnBreakLineLayout()]);
    }

    return newLineLayouts.concat(lineLayouts);
  }
}
