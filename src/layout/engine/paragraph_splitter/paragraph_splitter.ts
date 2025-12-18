import { FiveOrMoreLinesParagraphSplitStrategy } from './strategies/five_or_more_lines_paragraph_split_strategy';
import { FourLinesParagraphSplitStrategy } from './strategies/four_lines_paragraph_split_strategy';
import { ThreeOrLessLinesParagraphSplitStrategy } from './strategies/three_or_less_lines_paragraph_split_strategy';
import { LineLayout, ParagraphSplitStrategy } from '../types';

export class ParagraphSplitter {
  splitParagraph(
    lineLayouts: LineLayout[][],
    currentY: number,
    columnStartY: number,
    columnBottomY: number,
    chordLyricLineCount: number,
  ): LineLayout[][] {
    const strategy = this.createStrategy(chordLyricLineCount);
    return strategy.splitParagraph(lineLayouts, currentY, columnStartY, columnBottomY);
  }

  private createStrategy(chordLyricLineCount: number): ParagraphSplitStrategy {
    if (chordLyricLineCount <= 3) {
      return new ThreeOrLessLinesParagraphSplitStrategy();
    } if (chordLyricLineCount === 4) {
      return new FourLinesParagraphSplitStrategy();
    }
    return new FiveOrMoreLinesParagraphSplitStrategy(chordLyricLineCount);
  }
}
