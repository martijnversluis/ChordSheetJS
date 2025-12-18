import { LineLayout } from '../types';

/**
 * Strategy interface for paragraph splitting
 */
export interface ParagraphSplitStrategy {
  /**
   * Split a paragraph into parts that fit within column constraints
   *
   * @param lineLayouts - The layout of the paragraph to split
   * @param currentY - Current vertical position in the column
   * @param columnStartY - The starting Y position of columns
   * @param columnBottomY - The bottom Y position of columns
   * @returns The layout with column breaks inserted as needed
   */
  splitParagraph(
    lineLayouts: LineLayout[][],
    currentY: number,
    columnStartY: number,
    columnBottomY: number
  ): LineLayout[][];
}
