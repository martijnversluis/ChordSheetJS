import Key from '../../key';
import { ContentType } from '../../serialized_types';

import MetadataConfiguration, {
  defaultMetadataConfiguration,
  MetadataConfigurationProperties,
} from './metadata_configuration';

export type Delegate = (_string: string) => string;
export const defaultDelegate: Delegate = (string: string) => string;

export type ConfigurationProperties = Record<string, any> & {
  evaluate: boolean,
  metadata: Partial<MetadataConfigurationProperties>,
  key: Key | string | null,
  expandChorusDirective: boolean,
  useUnicodeModifiers: boolean,
  normalizeChords: boolean,
  delegates: Partial<Record<ContentType, Delegate>>;
};

export const defaultConfiguration: ConfigurationProperties = {
  evaluate: false,
  metadata: defaultMetadataConfiguration,
  key: null,
  expandChorusDirective: false,
  useUnicodeModifiers: false,
  normalizeChords: true,
  delegates: {
    abc: defaultDelegate,
    ly: defaultDelegate,
    tab: defaultDelegate,
    grid: defaultDelegate,
  },
};

class Configuration {
  metadata: MetadataConfiguration;

  evaluate: boolean;

  key: Key | null;

  configuration: Record<string, any>;

  expandChorusDirective: boolean;

  useUnicodeModifiers: boolean;

  normalizeChords: boolean;

  delegates: Partial<Record<ContentType, Delegate>>;

  constructor(configuration: Partial<ConfigurationProperties> = defaultConfiguration) {
    const mergedConfig: ConfigurationProperties = { ...defaultConfiguration, ...configuration };
    this.evaluate = mergedConfig.evaluate;
    this.expandChorusDirective = mergedConfig.expandChorusDirective;
    this.useUnicodeModifiers = mergedConfig.useUnicodeModifiers;
    this.normalizeChords = mergedConfig.normalizeChords;
    this.metadata = new MetadataConfiguration(configuration.metadata);
    this.key = configuration.key ? Key.wrap(configuration.key) : null;
    this.delegates = { ...defaultConfiguration.delegates, ...configuration.delegates };
    this.configuration = { configuration, delegates: this.delegates };
  }

  getSeparator(): string {
    return this.metadata.separator ?? '';
  }
}

export default Configuration;
