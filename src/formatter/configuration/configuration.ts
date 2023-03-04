import lodashGet from 'lodash.get';

import MetadataConfiguration from './metadata_configuration';
import Key from '../../key';

export type ConfigurationProperties = Record<string, any> & {
  evaluate?: boolean,
  metadata?: {
    separator: string,
  },
  key?: Key | string | null,
  expandChorusDirective?: boolean,
  useUnicodeModifiers?: boolean,
  normalizeChords?: boolean,
}

export const defaultConfiguration: ConfigurationProperties = {
  evaluate: false,
  metadata: { separator: ',' },
  key: null,
  expandChorusDirective: false,
  useUnicodeModifiers: false,
  normalizeChords: true,
};

class Configuration {
  metadata: MetadataConfiguration;

  evaluate: boolean;

  key: Key | null;

  configuration: Record<string, any>;

  expandChorusDirective: boolean;

  useUnicodeModifiers: boolean;

  normalizeChords: boolean;

  constructor(configuration: ConfigurationProperties = defaultConfiguration) {
    const mergedConfig: ConfigurationProperties = { ...defaultConfiguration, ...configuration };
    this.evaluate = !!mergedConfig.evaluate;
    this.expandChorusDirective = !!mergedConfig.expandChorusDirective;
    this.useUnicodeModifiers = !!mergedConfig.useUnicodeModifiers;
    this.normalizeChords = !!mergedConfig.normalizeChords;
    this.metadata = new MetadataConfiguration(configuration.metadata);
    this.key = configuration.key ? Key.wrap(configuration.key) : null;
    this.configuration = configuration;
  }

  get(key: string): string {
    return lodashGet(this, key);
  }
}

export default Configuration;
