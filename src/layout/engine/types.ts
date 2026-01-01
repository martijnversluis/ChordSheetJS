import ChordLyricsPair from '../../chord_sheet/chord_lyrics_pair';
import { FontConfiguration } from '../../formatter/configuration';
import Line from '../../chord_sheet/line';
import SoftLineBreak from '../../chord_sheet/soft_line_break';
import Tag from '../../chord_sheet/tag';

export interface Measurer {
  measureTextWidth(text: string, font: { size: number; lineHeight?: number }): number;
  measureTextHeight(text: string, font: { size: number; lineHeight?: number }): number;
  splitTextToSize(text: string, maxWidth: number, font: { size: number; lineHeight?: number }): string[];
}

/**
 * Represents a break point in text for line wrapping
 */
export interface BreakPoint {
  index: number;
  type: 'space' | 'hyphen' | 'comma' | 'other';
}

/**
 * Represents a measured chord-lyrics pair with position information
 */
export interface MeasuredItem {
  item: ChordLyricsPair | Tag | SoftLineBreak | null;
  width: number;
  chordHeight?: number;
  chordLyricWidthDifference?: number;
}

/**
 * Represents a single line in the layout
 */
export interface LineLayout {
  type: 'ChordLyricsPair' | 'Comment' | 'SectionLabel' | 'Tag' | 'Empty';
  lineHeight: number;
  items: MeasuredItem[];
  line: Line;
}

/**
 * Represents a paragraph in the layout
 */
// export interface ParagraphLayout {
//   paragraphIndex: number;
//   lines: LineLayout[];
//   totalHeight: number;
// }

/**
 * Complete layout for a song
 */
// export interface SongLayout {
//   paragraphs: ParagraphLayout[];
//   totalHeight: number;
// }

/**
 * Configuration for the layout engine
 */
export interface LayoutConfig {
  width: number;
  fonts: {
    chord: FontConfiguration;
    lyrics: FontConfiguration;
    comment: FontConfiguration;
    sectionLabel: FontConfiguration;
  };
  chordSpacing: number;
  chordLyricSpacing: number;
  linePadding: number;
  useUnicodeModifiers: boolean;
  normalizeChords: boolean;

  // Add column and page layout information
  minY: number;
  columnWidth: number;
  columnCount?: number;
  columnSpacing: number;
  minColumnWidth?: number;
  maxColumnWidth?: number;
  paragraphSpacing: number;
  columnBottomY: number;
  displayLyricsOnly?: boolean;
  decapo: boolean;
  repeatedSections?: 'hide' | 'title_only' | 'lyrics_only' | 'full';
}

export interface ParagraphLayoutResult {
  units: LineLayout[][];
  addSpacing: boolean;
  sectionType: string;
}

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
