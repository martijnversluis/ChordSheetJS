import { mergeConfigs } from '../../utilities';
import {
  BaseFormatterConfiguration,
  defaultBaseConfiguration,
} from './base_configuration';
import { HTMLFormatterConfiguration, htmlSpecificDefaults } from './html_configuration';
import { MeasuredHtmlFormatterConfiguration, measuredHtmlSpecificDefaults } from './measured_html_configuration';
import {
  MeasurementBasedFormatterConfiguration,
  measurementSpecificDefaults,
} from './measurement_based_configuration';
import { PDFFormatterConfiguration, pdfSpecificDefaults } from './pdf_configuration';

const formatterDefaultParts: Record<string, any> = {
  'base': {},
  'html': htmlSpecificDefaults,
  'measurement': measurementSpecificDefaults,
  'pdf': pdfSpecificDefaults,
  'measured_html': measuredHtmlSpecificDefaults,
};

const inheritanceMap: Record<string, string[]> = {
  base: ['base'],
  html: ['base', 'html'],
  measurement: ['base', 'measurement'],
  pdf: ['base', 'measurement', 'pdf'],
  measured_html: ['base', 'measurement', 'measured_html'],
};

/**
 * Build the inheritance chain for a formatter type
 * @param formatterType The formatter type to build the chain for
 * @returns Array of formatter types in inheritance order (base first)
 */
export const buildInheritanceChain = (formatterType: string): string[] => {
  const chain = inheritanceMap[formatterType] || [];
  return [...chain];
};

/**
 * Get the default configuration for a specific formatter type
 * This dynamically composes the full default configuration by merging
 * the defaults from all levels in the inheritance chain
 * @param formatterType The formatter type to get defaults for
 * @returns The fully composed default configuration
 */
export const getDefaultConfig = <T extends BaseFormatterConfiguration>(
  formatterType: string,
): T => {
  let config = { ...defaultBaseConfiguration };
  const chain = buildInheritanceChain(formatterType);
  config = chain.reduce((acc, type) => mergeConfigs(acc, formatterDefaultParts[type] || {}), config);
  return config as T;
};

export const getBaseDefaultConfig = ():
  BaseFormatterConfiguration => getDefaultConfig<BaseFormatterConfiguration>('base');

export const getHTMLDefaultConfig = ():
  HTMLFormatterConfiguration => getDefaultConfig<HTMLFormatterConfiguration>('html');

export const getMeasurementDefaultConfig = ():
  MeasurementBasedFormatterConfiguration => getDefaultConfig<MeasurementBasedFormatterConfiguration>('measurement');

export const getPDFDefaultConfig = ():
  PDFFormatterConfiguration => getDefaultConfig<PDFFormatterConfiguration>('pdf');

export const getMeasuredHtmlDefaultConfig = ():
  MeasuredHtmlFormatterConfiguration => getDefaultConfig<MeasuredHtmlFormatterConfiguration>('measured_html');

/**
 * Register a new formatter type with its specific defaults and inheritance chain
 * @param formatterType The formatter type to register
 * @param specificDefaults The formatter-specific default settings
 * @param inheritsFrom Array of formatter types this one inherits from (in order)
 */
export const registerFormatterType = (
  formatterType: string,
  specificDefaults: Record<string, any> = {},
  inheritsFrom: string[] = [],
): void => {
  formatterDefaultParts[formatterType] = specificDefaults;
  inheritanceMap[formatterType] = inheritsFrom;
};
