import type { BaseFormatterConfiguration } from './base_configuration';
import type { DeepPartial } from '../../utilities';
import type { TerminalCellWidth } from '../../layout/measurement/terminal_measurer';
import type { TerminalStyle, TerminalStyleRole } from '../../rendering/terminal/types';

export interface TerminalMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Fixed reservation; templates use {metadata}, {page}, {pages}. No executable expressions. */
export interface TerminalTextBlock {
  height: number;
  text: string;
  align?: 'left' | 'center' | 'right';
  overflow?: 'wrap' | 'clip';
  condition?: 'all' | 'first' | 'last' | 'not-first';
}

export interface TerminalLayoutConfig {
  global: { margins: TerminalMargins; pageSpacing: number };
  header?: TerminalTextBlock;
  footer?: TerminalTextBlock;
  sections: {
    global: {
      columnCount?: number;
      columnSpacing: number;
      minColumnWidth?: number;
      maxColumnWidth?: number;
      chordSpacing: number;
      chordLyricSpacing: number;
      linePadding: number;
      paragraphSpacing: number;
    };
    base: {
      display: {
        showLabel: boolean;
        labelStyle?: 'uppercase';
        lyricsOnly: boolean;
        repeatedSections: 'full' | 'hide' | 'title_only' | 'lyrics_only';
      };
    };
  };
}

export interface TerminalFormatterConfiguration extends BaseFormatterConfiguration {
  width: number;
  height?: number;
  layout: TerminalLayoutConfig;
  styles: Partial<Record<TerminalStyleRole, TerminalStyle>>;
  cellWidth?: TerminalCellWidth;
}

/** Compatibility inputs only; never retained in formatter.configuration. */
export interface LegacyTerminalConfiguration {
  columnCount?: number;
  columnSpacing: number;
  minColumnWidth?: number;
  maxColumnWidth?: number;
  margins: TerminalMargins;
  chordSpacing: number;
  chordLyricSpacing: number;
  linePadding: number;
  paragraphSpacing: number;
  pageSpacing: number;
  lyricsOnly: boolean;
  showLabels: boolean;
  uppercaseLabels: boolean;
  repeatedSections: 'preserve' | 'hide' | 'title-only' | 'lyrics-only';
  header?: TerminalTextBlock;
  footer?: TerminalTextBlock;
}

export type TerminalConfigurationInput = DeepPartial<TerminalFormatterConfiguration> &
  DeepPartial<LegacyTerminalConfiguration>;

export const terminalSpecificDefaults = {
  width: 80,
  layout: {
    global: {
      margins: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      pageSpacing: 1,
    },
    sections: {
      global: {
        chordSpacing: 1,
        paragraphSpacing: 1,
        columnSpacing: 0,
        chordLyricSpacing: 0,
        linePadding: 0,
      },
      base: { display: { showLabel: true, lyricsOnly: false, repeatedSections: 'full' } },
    },
  },
  styles: {},
};
