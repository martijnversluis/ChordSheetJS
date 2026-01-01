import { ImageCompression } from 'jspdf';

import { ChordDiagramRenderingConfig } from '../../chord_diagram/chord_diagram';
import Item from '../../chord_sheet/item';
import { ParagraphType } from '../../constants';
import { BaseFormatterConfiguration, ConfigurationProperties } from './base_configuration';

import {
  ChordLyricsPair,
  Comment,
  Line,
  SoftLineBreak,
  Tag,
} from '../../index';

export interface Margins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

// Font and layout types
export type FontSection =
  'title' |
  'subtitle' |
  'metadata' |
  'text' |
  'chord' |
  'comment' |
  'annotation' |
  'sectionLabel';

export type LayoutSection = 'header' | 'footer';
export type Alignment = 'left' | 'center' | 'right';
export type MeasurerType = 'canvas' | 'dom' | 'jspdf';

// Condition rules for conditional rendering
export type ConditionRule = Partial<{
  equals: any;
  not_equals: any;
  greater_than: number;
  greater_than_equal: number;
  less_than: number;
  less_than_equal: number;
  like: string;
  contains: string;
  in: any[];
  not_in: any[];
  all: any[];
  exists: boolean;
  first: boolean;
  last: boolean;
}>;

export type SingleCondition = Record<string, ConditionRule>;

export type ConditionalRule = Partial<{
  and: SingleCondition[];
  or: SingleCondition[];
}> | SingleCondition;

// Basic layout types
export interface Position {
  x: Alignment,
  y: number,
  width?: number,
  height?: number,
  clip?: boolean,
  ellipsis?: boolean,
}

export interface Dimension {
  width: number,
  height: number,
}

// Font configuration
export interface FontConfiguration {
  name: string;
  style: string;
  weight?: string | number;
  size: number;
  lineHeight?: number;
  color: string | number;
  underline?: boolean;
  inherit?: string;
  textTransform?: string;
  textDecoration?: string;
  letterSpacing?: string;
}

export type FontConfigurations = Record<FontSection, FontConfiguration>;
export type ChordDiagramFontConfigurations = Record<'title' | 'fingerings' | 'baseFret', FontConfiguration>;

export const defaultFontConfigurations: FontConfigurations = {
  title: {
    name: 'Helvetica',
    style: 'bold',
    size: 18,
    color: '#000000',
  },
  subtitle: {
    name: 'Helvetica',
    style: 'normal',
    size: 14,
    color: '#000000',
  },
  chord: {
    name: 'Helvetica',
    style: 'bold',
    size: 13,
    color: '#000000',
  },
  comment: {
    name: 'Helvetica',
    style: 'italic',
    size: 13,
    color: '#666666',
  },
  metadata: {
    name: 'Helvetica',
    style: 'normal',
    size: 11,
    color: '#555555',
  },
  text: {
    name: 'Helvetica',
    style: 'normal',
    size: 12,
    color: '#000000',
  },
  annotation: {
    name: 'Helvetica',
    style: 'normal',
    size: 10,
    color: '#000000',
  },
  sectionLabel: {
    name: 'Helvetica',
    style: 'bold',
    size: 14,
    color: '#000000',
  },
};

// Section display configuration
export interface SectionDisplay {
  labelStyle?: 'uppercase';
  showLabel?: boolean;
  lyricsOnly?: boolean;
  indent?: number;
  compact?: boolean;
  repeatedSections?: 'hide' | 'title_only' | 'lyrics_only' | 'full';
}

export interface SectionTypeConfig {
  fonts?: FontConfigurations;
  display?: SectionDisplay;
  overrides?: {
    condition: ConditionalRule;
    display: Partial<SectionDisplay>;
  }[];
}

// Column configuration
export interface ColumnConfig {
  columnCount?: number;
  columnSpacing: number;
  minColumnWidth?: number;
  maxColumnWidth?: number;
}

// Sections configuration
export interface SectionsConfig {
  global: {
    columnWidth: number;
    spacingBottom?: number;
    spacingAfter?: number;
    chordLyricSpacing: number;
    linePadding: number;
    paragraphSpacing?: number;
    chordSpacing: number;
  } & ColumnConfig;
  base: SectionTypeConfig;
  types?: Record<ParagraphType, SectionTypeConfig | undefined>;
}

// Layout content items
export interface ILayoutContentItem {
  type: string,
  position: Position,
  condition?: ConditionalRule,
}

export interface LayoutContentItemWithText extends ILayoutContentItem {
  type: 'text',
  style: FontConfiguration,
  value?: string,
  template?: string,
}

export interface LayoutContentItemWithValue extends LayoutContentItemWithText {
  value: string,
}

export interface LayoutContentItemWithTemplate extends LayoutContentItemWithText {
  template: string,
}

export interface LayoutContentItemWithImage extends ILayoutContentItem {
  type: 'image',
  src: string,
  position: Position,
  compression: ImageCompression,
  size: Dimension,
  alias?: string,
  rotation?: number,
}

export interface LineStyle {
  color: string;
  width: number;
  dash?: number[];
}

export interface LayoutContentItemWithLine {
  type: 'line';
  style: LineStyle;
  position: {
    x?: number;
    y: number;
    width: number | 'auto';
    height?: number;
  };
  condition?: ConditionalRule;
}

export type LayoutContentItem =
  | LayoutContentItemWithValue
  | LayoutContentItemWithTemplate
  | LayoutContentItemWithImage
  | LayoutContentItemWithLine;

export interface LayoutItem {
  height: number,
  content: LayoutContentItem[],
}

// Chord diagram configuration
export interface ChordDiagramOverrides {
  hide?: boolean;
  definition?: string;
}

export interface ChordDiagramsConfig {
  enabled: boolean;
  renderingConfig?: ChordDiagramRenderingConfig;
  definitions?: {
    hiddenChords: string[];
  };
  overrides?: {
    global?: Record<string, ChordDiagramOverrides>;
    byKey?: Record<string, Record<string, ChordDiagramOverrides>>;
  };
  fonts: ChordDiagramFontConfigurations;
}

// Measurement items
export interface MeasuredItem {
  item: ChordLyricsPair | Comment | SoftLineBreak | Tag | Item | null,
  width: number,
  chordLyricWidthDifference?: number,
  chordHeight?: number,
  adjustedChord?: string,
}

export interface LineLayout {
  type: 'ChordLyricsPair' | 'Comment' | 'Tag' | 'ColumnBreak' | 'SectionLabel'
  items: MeasuredItem[];
  lineHeight: number;
  line?: Line
}

// Combined layout configuration
export interface MeasurementBasedLayoutConfig {
  // Common layout settings
  global: {
    margins: Margins;
  };

  // // Line breaking settings
  // lineBreaking: {
  //   enabled: boolean;
  //   preferredBreakPoints: string[];
  //   capitalizeFirstWord: boolean;
  // };

  // // Paragraph splitting settings
  // paragraphSplitting: {
  //   enabled: boolean;
  // };

  // Optional header and footer
  header: LayoutItem;
  footer: LayoutItem;

  // Optional sections configuration
  sections?: SectionsConfig;

  // Optional chord diagrams configuration
  chordDiagrams?: ChordDiagramsConfig;
}

// Default layout configuration for measurement-based formatters
export const defaultMeasurementBasedLayout: MeasurementBasedLayoutConfig = {
  global: {
    margins: {
      top: 40, right: 40, bottom: 40, left: 40,
    },
  },
  header: {
    height: 0,
    content: [],
  },
  footer: {
    height: 0,
    content: [],
  },
};

export const measurementSpecificDefaults = {
  fonts: defaultFontConfigurations,
  measurer: 'canvas',
  layout: defaultMeasurementBasedLayout,
};

// Base measurement-based formatter configuration
export interface MeasurementBasedFormatterConfiguration extends BaseFormatterConfiguration {
  fonts: FontConfigurations;
  measurer: MeasurerType;
  layout: MeasurementBasedLayoutConfig;
}

// Configuration properties type for measurement-based formatters
export interface MeasurementBasedConfigurationProperties extends ConfigurationProperties {
  fonts?: Partial<FontConfigurations>;
  measurer?: MeasurerType;
  layout?: Partial<MeasurementBasedLayoutConfig>;
}
