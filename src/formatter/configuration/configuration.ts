import Key from '../../key';
import { ContentType } from '../../serialized_types';

import MetadataConfiguration, {
  defaultMetadataConfiguration,
  MetadataConfigurationProperties,
} from './metadata_configuration';

import InstrumentConfiguration, { InstrumentConfigurationProperties } from './instrument_configuration';
import UserConfiguration, { UserConfigurationProperties } from './user_configuration';

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
  instrument?: InstrumentConfigurationProperties;
  user?: UserConfigurationProperties;
  decapo?: boolean;
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

  expandChorusDirective: boolean;

  useUnicodeModifiers: boolean;

  normalizeChords: boolean;

  delegates: Partial<Record<ContentType, Delegate>>;

  instrument?: InstrumentConfiguration;

  user?: UserConfiguration;

  decapo?: boolean;

  get metadataSeparator(): string {
    return this.metadata.separator ?? '';
  }

  constructor(configuration: Partial<ConfigurationProperties> = defaultConfiguration) {
    const mergedConfig: ConfigurationProperties = { ...defaultConfiguration, ...configuration };
    this.evaluate = mergedConfig.evaluate;
    this.expandChorusDirective = mergedConfig.expandChorusDirective;
    this.useUnicodeModifiers = mergedConfig.useUnicodeModifiers;
    this.normalizeChords = mergedConfig.normalizeChords;
    this.metadata = new MetadataConfiguration(configuration.metadata);
    this.key = configuration.key ? Key.wrap(configuration.key) : null;
    this.delegates = { ...defaultConfiguration.delegates, ...configuration.delegates };
    this.instrument = configuration.instrument ? new InstrumentConfiguration(configuration.instrument) : undefined;
    this.user = configuration.user ? new UserConfiguration(configuration.user) : undefined;
    this.decapo = !!configuration.decapo;
  }
}

export default Configuration;
