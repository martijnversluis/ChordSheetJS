import { mergeConfigs } from './utilities';

import {
  configure,
  getDefaultConfig,
  getHTMLDefaultConfig,
  getMeasuredHtmlDefaultConfig,
  getPDFDefaultConfig,
  getTextDefaultConfig,
} from './formatter/configuration';

export {
  configure,
  getDefaultConfig,
  getHTMLDefaultConfig,
  getMeasuredHtmlDefaultConfig,
  getPDFDefaultConfig,
  getTextDefaultConfig,
  mergeConfigs,
};

export interface FormatterConfigurationHelpers {
  configure: typeof configure;
  getDefaultConfig: typeof getDefaultConfig;
  getHTMLDefaultConfig: typeof getHTMLDefaultConfig;
  getMeasuredHtmlDefaultConfig: typeof getMeasuredHtmlDefaultConfig;
  getPDFDefaultConfig: typeof getPDFDefaultConfig;
  getTextDefaultConfig: typeof getTextDefaultConfig;
  mergeConfigs: typeof mergeConfigs;
}

export const formatterConfiguration: FormatterConfigurationHelpers = {
  configure,
  getDefaultConfig,
  getHTMLDefaultConfig,
  getMeasuredHtmlDefaultConfig,
  getPDFDefaultConfig,
  getTextDefaultConfig,
  mergeConfigs,
};

export default formatterConfiguration;
