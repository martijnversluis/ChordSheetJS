import Line from '../../chord_sheet/line';
import Tag from '../../chord_sheet/tag';
import { isColumnBreak } from '../../template_helpers';
import { LayoutConfig, LineLayout } from './types';

/**
 * Create a column break line layout
 */
export function createColumnBreakLineLayout(): LineLayout {
  return {
    type: 'Tag',
    line: new Line(),
    items: [{ item: new Tag('column_break'), width: 0 }],
    lineHeight: 0,
  };
}

/**
 * Calculate the total height of a set of line layouts
 */
export function calculateTotalHeight(lineLayouts: LineLayout[][]): number {
  return lineLayouts.reduce((sum, layouts) => {
    const layoutHeight = layouts.reduce((lineSum, layout) => lineSum + layout.lineHeight, 0);
    return sum + layoutHeight;
  }, 0);
}

/**
 * Check if a line layout represents a column break
 */
export function isColumnBreakLayout(lineLayout: LineLayout[]): boolean {
  return lineLayout.length === 1 &&
         lineLayout[0].items.length === 1 &&
         lineLayout[0].items[0].item instanceof Tag &&
         isColumnBreak(lineLayout[0].items[0].item);
}

/**
 * Update the position based on layout content
 */
export function updatePosition(
  layout: LineLayout[],
  currentY: number,
  currentColumn: number,
  config: LayoutConfig,
): { newY: number; newColumn: number } {
  if (isColumnBreakLayout(layout)) {
    // Column break
    const newColumn = currentColumn + 1 > (config.columnCount || 1) ? 1 : currentColumn + 1;
    return {
      newY: config.minY,
      newColumn,
    };
  }
  // Normal layout
  const linesHeight = layout.reduce((sum, l) => sum + l.lineHeight, 0);
  return {
    newY: currentY + linesHeight,
    newColumn: currentColumn,
  };
}

/**
 * Count different types of lines within layouts
 */
export function countLineTypes(lineLayouts: LineLayout[][]) {
  const flattened = lineLayouts.flat();

  return {
    chordLyricPairLines: flattened.filter((ll) => ll.type === 'ChordLyricsPair').length,
    commentLines: flattened.filter((ll) => ll.type === 'Comment').length,
    sectionLabelLines: flattened.filter((ll) => ll.type === 'SectionLabel').length,
    tagLines: flattened.filter((ll) => ll.type === 'Tag').length,
    emptyLines: flattened.filter((ll) => ll.type === 'Empty').length,
    nonLyricLines: flattened.filter((ll) => ll.type === 'Comment' || ll.type === 'SectionLabel').length,
  };
}

/**
 * Determine if a paragraph should be skipped in lyrics-only mode
 */
export function shouldSkipParagraph(lineLayouts: LineLayout[][], lyricsOnly = false): boolean {
  if (!lyricsOnly) return false;

  const counts = countLineTypes(lineLayouts);

  return counts.nonLyricLines === 1 && counts.chordLyricPairLines === 0;
}
