import lodashGet from 'lodash.get';

import MetadataConfiguration from './metadata_configuration';
import Key from '../../key';
import { ContentType } from '../../chord_sheet_serializer';

export type Delegate = (_string: string) => string;
const defaultDelegate: Delegate = (string: string) => string;

export type ConfigurationProperties = Record<string, any> & {
  evaluate?: boolean,
  metadata?: {
    separator: string,
  },
  key?: Key | string | null,
  expandChorusDirective?: boolean,
  useUnicodeModifiers?: boolean,
  normalizeChords?: boolean,
  delegates?: Partial<Record<ContentType, Delegate>>;
}

export const defaultConfiguration: ConfigurationProperties = {
  evaluate: false,
  metadata: { separator: ',' },
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

  constructor(configuration: ConfigurationProperties = defaultConfiguration) {
    const mergedConfig: ConfigurationProperties = { ...defaultConfiguration, ...configuration };
    this.evaluate = !!mergedConfig.evaluate;
    this.expandChorusDirective = !!mergedConfig.expandChorusDirective;
    this.useUnicodeModifiers = !!mergedConfig.useUnicodeModifiers;
    this.normalizeChords = !!mergedConfig.normalizeChords;
    this.metadata = new MetadataConfiguration(configuration.metadata);
    this.key = configuration.key ? Key.wrap(configuration.key) : null;
    this.delegates = mergedConfig.delegates || {};
    this.configuration = configuration;
  }

  get(key: string): string {
    return lodashGet(this, key);
  }
}

export default Configuration;
