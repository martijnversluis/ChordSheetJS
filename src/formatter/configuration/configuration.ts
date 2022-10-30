import lodashGet from 'lodash.get';

import MetadataConfiguration from './metadata_configuration';

export type ConfigurationProperties = Record<string, any> & {
  evaluate?: boolean,
  metadata?: {
    separator: string,
  },
}

export const defaultConfiguration: ConfigurationProperties = { evaluate: false, metadata: { separator: ',' } };

class Configuration {
  metadata: MetadataConfiguration;

  evaluate: boolean;

  configuration: Record<string, any>;

  constructor(configuration: ConfigurationProperties = defaultConfiguration) {
    if ('evaluate' in configuration) {
      this.evaluate = !!configuration.evaluate;
    } else {
      this.evaluate = !!defaultConfiguration.evaluate;
    }

    this.metadata = new MetadataConfiguration(configuration.metadata);
    this.configuration = configuration;
  }

  get(key: string): string {
    return lodashGet(this, key);
  }
}

export default Configuration;
