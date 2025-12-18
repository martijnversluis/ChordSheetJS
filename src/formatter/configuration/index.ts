import {
  BaseFormatterConfiguration,
  ConfigurationProperties,
  Delegate,
  DelegatesConfiguration,
  InstrumentConfiguration,
  MetadataConfiguration,
  UserConfigurationProperties,
  defaultBaseConfiguration,
  defaultDelegate,
  defaultDelegatesConfiguration,
  defaultMetadataConfiguration,
} from './base_configuration';

import {
  CSS,
  HTMLConfigurationProperties,
  HTMLFormatterConfiguration,
  HtmlTemplateCssClasses,
  defaultCssClasses,
  htmlSpecificDefaults,
} from './html_configuration';

import {
  Alignment,
  ChordDiagramFontConfigurations,
  ChordDiagramOverrides,
  ChordDiagramsConfig,
  ColumnConfig,
  ConditionRule,
  ConditionalRule,
  Dimension,
  FontConfiguration,
  FontConfigurations,
  FontSection,
  ILayoutContentItem,
  LayoutContentItem,
  LayoutContentItemWithImage,
  LayoutContentItemWithLine,
  LayoutContentItemWithTemplate,
  LayoutContentItemWithText,
  LayoutContentItemWithValue,
  LayoutItem,
  LayoutSection,
  LineLayout,
  LineStyle,
  Margins,
  MeasuredItem,
  MeasurementBasedFormatterConfiguration,
  MeasurementBasedLayoutConfig,
  MeasurerType,
  Position,
  SectionDisplay,
  SectionTypeConfig,
  SectionsConfig,
  SingleCondition,
  defaultFontConfigurations,
  defaultMeasurementBasedLayout,
  measurementSpecificDefaults,
} from './measurement_based_configuration';

import {
  MeasuredHtmlConfigurationProperties,
  MeasuredHtmlFormatterConfiguration,
  MeasuredHtmlLayoutConfig,
  measuredHtmlSpecificDefaults,
} from './measured_html_configuration';

import {
  PDFConfigurationProperties,
  PDFFormatterConfiguration,
  PDFLayoutConfig,
  pdfSpecificDefaults,
} from './pdf_configuration';

import {
  getBaseDefaultConfig,
  getDefaultConfig,
  getHTMLDefaultConfig,
  getPDFDefaultConfig,
} from './default_config_manager';

import { mergeConfigs } from '../../utilities';

type Configuration = BaseFormatterConfiguration;

/**
 * Legacy configuration function for backward compatibility
 */
export function configure(config: ConfigurationProperties): Configuration {
  const defautlBaseConfig = getBaseDefaultConfig();
  return mergeConfigs(defautlBaseConfig, config);
}

export {
  Delegate,
  defaultDelegate,
  MetadataConfiguration,
  InstrumentConfiguration,
  UserConfigurationProperties,
  defaultMetadataConfiguration,
  DelegatesConfiguration,
  defaultDelegatesConfiguration,
  ConfigurationProperties,
  defaultBaseConfiguration,

  Margins,
  FontSection,
  LayoutSection,
  Alignment,
  MeasurerType,
  ConditionRule,
  SingleCondition,
  ConditionalRule,
  Position,
  Dimension,
  FontConfiguration,
  FontConfigurations,
  ChordDiagramFontConfigurations,
  defaultFontConfigurations,
  SectionDisplay,
  SectionTypeConfig,
  ColumnConfig,
  SectionsConfig,
  ILayoutContentItem,
  LayoutContentItem,
  LayoutContentItemWithText,
  LayoutContentItemWithValue,
  LayoutContentItemWithTemplate,
  LayoutContentItemWithImage,
  LineStyle,
  LayoutContentItemWithLine,
  LayoutItem,
  ChordDiagramOverrides,
  ChordDiagramsConfig,
  MeasuredItem,
  LineLayout,
  MeasurementBasedLayoutConfig,
  defaultMeasurementBasedLayout,
  measurementSpecificDefaults,
  MeasurementBasedFormatterConfiguration,

  MeasuredHtmlLayoutConfig,
  MeasuredHtmlFormatterConfiguration,
  MeasuredHtmlConfigurationProperties,
  measuredHtmlSpecificDefaults,

  CSS,
  HtmlTemplateCssClasses,
  HTMLFormatterConfiguration,
  defaultCssClasses,
  HTMLConfigurationProperties,
  htmlSpecificDefaults,

  PDFLayoutConfig,
  PDFFormatterConfiguration,
  PDFConfigurationProperties,
  pdfSpecificDefaults,

  BaseFormatterConfiguration,
  Configuration,
  getDefaultConfig,
  getHTMLDefaultConfig,
  getPDFDefaultConfig,
};

export default Configuration;
