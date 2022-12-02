import lodashGet from 'lodash.get';

import MetadataConfiguration from './metadata_configuration';
import Key from '../../key';

export type ConfigurationProperties = Record<string, any> & {
  evaluate?: boolean,
  metadata?: {
    separator: string,
  },
  key?: Key | string | null,
}

export const defaultConfiguration: ConfigurationProperties = {
  evaluate: false,
  metadata: { separator: ',' },
  key: null,
};

class Configuration {
  metadata: MetadataConfiguration;

  evaluate: boolean;

  key: Key | null;

  configuration: Record<string, any>;

  constructor(configuration: ConfigurationProperties = defaultConfiguration) {
    if ('evaluate' in configuration) {
      this.evaluate = !!configuration.evaluate;
    } else {
      this.evaluate = !!defaultConfiguration.evaluate;
    }

    this.metadata = new MetadataConfiguration(configuration.metadata);
    this.key = configuration.key ? Key.wrap(configuration.key) : null;
    this.configuration = configuration;
  }

  get(key: string): string {
    return lodashGet(this, key);
  }
}

export default Configuration;
