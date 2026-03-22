import {
  BaseFormatterConfiguration,
  ConfigurationProperties,
} from './base_configuration';

import { PangoRenderer } from '../../pango/pango_helpers';

export type CSS = Record<string, string | number>;

export interface HtmlTemplateCssClasses {
  annotation: string,
  chord: string,
  chordSheet: string,
  column: string,
  comment: string,
  emptyLine: string,
  image: string,
  label: string,
  labelWrapper: string,
  line: string,
  literal: string,
  literalContents: string,
  lyrics: string,
  paragraph: string,
  row: string,
  subtitle: string,
  title: string,
}

// HTML formatter configuration
export interface HTMLFormatterConfiguration extends BaseFormatterConfiguration {
  cssClasses: HtmlTemplateCssClasses;
  customCSS?: CSS;
  pangoRenderer?: PangoRenderer;
  renderBlankLines?: boolean;
}

// Default CSS classes

export const defaultCssClasses: HtmlTemplateCssClasses = {
  annotation: 'annotation',
  chord: 'chord',
  chordSheet: 'chord-sheet',
  column: 'column',
  comment: 'comment',
  emptyLine: 'empty-line',
  image: 'image',
  label: 'label',
  labelWrapper: 'label-wrapper',
  line: 'line',
  literal: 'literal',
  literalContents: 'contents',
  lyrics: 'lyrics',
  paragraph: 'paragraph',
  row: 'row',
  subtitle: 'subtitle',
  title: 'title',
};

// HTML ConfigurationProperties type
export interface HTMLConfigurationProperties extends ConfigurationProperties {
  cssClasses?: Partial<HtmlTemplateCssClasses>;
  customCSS?: CSS;
  pangoRenderer?: PangoRenderer;
  renderBlankLines?: boolean;
}

export const htmlSpecificDefaults: Partial<HTMLFormatterConfiguration> = {
  cssClasses: {
    annotation: 'annotation',
    chord: 'chord',
    chordSheet: 'chord-sheet',
    column: 'column',
    comment: 'comment',
    emptyLine: 'empty-line',
    image: 'image',
    label: 'label',
    labelWrapper: 'label-wrapper',
    line: 'line',
    literal: 'literal',
    literalContents: 'contents',
    lyrics: 'lyrics',
    paragraph: 'paragraph',
    row: 'row',
    subtitle: 'subtitle',
    title: 'title',
  },
};
