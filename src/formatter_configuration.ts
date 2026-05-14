import { mergeConfigs } from './utilities';

import {
  configure,
  getDefaultConfig,
  getHTMLDefaultConfig,
  getMeasuredHtmlDefaultConfig,
  getPDFDefaultConfig,
} from './formatter/configuration';

export {
  configure,
  getDefaultConfig,
  getHTMLDefaultConfig,
  getMeasuredHtmlDefaultConfig,
  getPDFDefaultConfig,
  mergeConfigs,
};

export interface FormatterConfigurationHelpers {
  configure: typeof configure;
  getDefaultConfig: typeof getDefaultConfig;
  getHTMLDefaultConfig: typeof getHTMLDefaultConfig;
  getMeasuredHtmlDefaultConfig: typeof getMeasuredHtmlDefaultConfig;
  getPDFDefaultConfig: typeof getPDFDefaultConfig;
  mergeConfigs: typeof mergeConfigs;
}

export const formatterConfiguration: FormatterConfigurationHelpers = {
  configure,
  getDefaultConfig,
  getHTMLDefaultConfig,
  getMeasuredHtmlDefaultConfig,
  getPDFDefaultConfig,
  mergeConfigs,
};

export default formatterConfiguration;
