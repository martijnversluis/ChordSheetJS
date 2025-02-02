import Key from '../key';
import { ContentType } from '../serialized_types';

export type Delegate = (_string: string) => string;
export const defaultDelegate: Delegate = (string: string) => string;

interface MetadataConfiguration {
  separator: string;
}

interface InstrumentConfiguration {
  type?: string;
  description?: string;
}

interface UserConfigurationProperties {
  name?: string;
  fullname?: string;
}

const defaultMetadataConfiguration: MetadataConfiguration = {
  separator: ',',
};

interface DelegatesConfiguration {
  abc: Delegate;
  ly: Delegate;
  tab: Delegate;
  grid: Delegate;
}

const defaultDelegatesConfiguration: DelegatesConfiguration = {
  abc: defaultDelegate,
  ly: defaultDelegate,
  tab: defaultDelegate,
  grid: defaultDelegate,
};

type Configuration = Record<string, any> & {
  decapo: boolean;
  delegates: Partial<Record<ContentType, Delegate>>;
  evaluate: boolean,
  expandChorusDirective: boolean,
  instrument: InstrumentConfiguration | null;
  key: Key | null,
  metadata: MetadataConfiguration,
  normalizeChords: boolean,
  useUnicodeModifiers: boolean,
  user: UserConfigurationProperties | null;
};

export type ConfigurationProperties = Record<string, any> & Partial<{
  decapo: boolean;
  delegates: Partial<DelegatesConfiguration>,
  evaluate: boolean,
  expandChorusDirective: boolean,
  instrument: Partial<InstrumentConfiguration>,
  key: Key | string | null,
  metadata: Partial<MetadataConfiguration>,
  normalizeChords: boolean,
  useUnicodeModifiers: boolean,
  user: Partial<UserConfigurationProperties>,
}>;

export const defaultConfiguration: Configuration = {
  decapo: false,
  delegates: defaultDelegatesConfiguration,
  evaluate: false,
  expandChorusDirective: false,
  instrument: null,
  key: null,
  metadata: defaultMetadataConfiguration,
  normalizeChords: true,
  useUnicodeModifiers: false,
  user: null,
};

export function configure(configuration: ConfigurationProperties): Configuration {
  return {
    ...defaultConfiguration,
    ...configuration,
    metadata: { ...defaultMetadataConfiguration, ...configuration.metadata },
    delegates: { ...defaultDelegatesConfiguration, ...configuration.delegates },
    key: configuration.key ? Key.wrap(configuration.key) : null,
  };
}

export default Configuration;
