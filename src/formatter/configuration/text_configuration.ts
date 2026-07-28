import { SectionTypeConfig } from './measurement_based_configuration';
import { BaseFormatterConfiguration, ConfigurationProperties } from './base_configuration';

export interface TextLayoutContentItemWithText {
  type: 'text';
  value?: string;
  template?: string;
}

export interface TextLayoutItem {
  content: TextLayoutContentItemWithText[];
}

export interface TextLayoutConfig {
  header: TextLayoutItem;
  footer: TextLayoutItem;
  sections?: {
    base?: SectionTypeConfig;
  };
}

export const defaultTextLayout: TextLayoutConfig = {
  header: {
    content: [],
  },
  footer: {
    content: [],
  },
};

export const textSpecificDefaults = {
  layout: defaultTextLayout,
};

export interface TextFormatterConfiguration extends BaseFormatterConfiguration {
  layout: TextLayoutConfig;
}

export interface TextConfigurationProperties extends ConfigurationProperties {
  layout?: Partial<TextLayoutConfig>;
}
