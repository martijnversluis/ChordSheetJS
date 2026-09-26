import type { ChordLineStyleRole, ChordLineTokenKind, ChordLineTokenVariant } from '../../chord_sheet/chord_line_token';

import type { LayoutSource } from '../../layout/engine/placement_planner';

export type TerminalStyleRole = ChordLineStyleRole | 'lyrics' | 'comment' | 'section-label' | 'header' | 'footer';

export interface TerminalStyle {
  foreground?: string;
  background?: string;
  bold?: boolean;
  dim?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface TerminalSpan {
  x: number;
  width: number;
  text: string;
  kind: ChordLineTokenKind | 'lyrics' | 'comment' | 'section-label' | 'header' | 'footer';
  styleRole?: TerminalStyleRole;
  tokenVariant?: ChordLineTokenVariant;
  style?: TerminalStyle;
  column?: number;
  source?: LayoutSource;
}

export interface TerminalRow {
  y: number;
  spans: TerminalSpan[];
}

export interface TerminalColumn {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  usedHeight: number;
}

export interface TerminalPage {
  index: number;
  width: number;
  height: number;
  columns: TerminalColumn[];
  rows: TerminalRow[];
}

export interface TerminalGeometry {
  columnCount: number;
  columnWidth: number;
  columnSpacing: number;
  contentX: number;
  contentY: number;
  contentWidth: number;
  contentHeight: number | null;
}

export interface TerminalDiagnostic {
  code: 'unsupported-content' | 'horizontal-overflow';
  message: string;
  source?: LayoutSource;
}

/** Page-local cells; rows is the mechanically derived page-stacked compatibility view. */
export interface TerminalDocument {
  width: number;
  height: number;
  geometry: TerminalGeometry;
  pages: TerminalPage[];
  rows: TerminalRow[];
  diagnostics: TerminalDiagnostic[];
}
