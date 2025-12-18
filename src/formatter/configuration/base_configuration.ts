import { ContentType } from '../../serialized_types';
import Key from '../../key';
import { META_TAGS } from '../../chord_sheet/tag';

export type Delegate = (_string: string) => string;
export const defaultDelegate: Delegate = (string: string) => string;

export interface MetadataRule {
  match: string | string[] | RegExp | ((key: string) => boolean);
  visible?: boolean;
  sortMethod?: 'preserve' | 'alphabetical' | 'custom';
  customSort?: (a: string, b: string) => number;
}

export interface MetadataConfiguration {
  separator: string;
  order: (string | MetadataRule)[];
}

export interface InstrumentConfiguration {
  type?: string;
  description?: string;
}

export interface UserConfigurationProperties {
  name?: string;
  fullname?: string;
}

export const defaultMetadataConfiguration: MetadataConfiguration = {
  separator: ',',
  order: [
    ...META_TAGS,
    // x_ metadata - alphabetical
    { match: /^x_/, sortMethod: 'alphabetical' },
  ],
};

export interface DelegatesConfiguration {
  abc: Delegate;
  ly: Delegate;
  tab: Delegate;
  grid: Delegate;
}

export const defaultDelegatesConfiguration: DelegatesConfiguration = {
  abc: defaultDelegate,
  ly: defaultDelegate,
  tab: defaultDelegate,
  grid: defaultDelegate,
};

// Base configuration interface
export interface BaseFormatterConfiguration {
  decapo: boolean;
  delegates: Partial<Record<ContentType, Delegate>>;
  evaluate: boolean;
  expandChorusDirective: boolean;
  instrument: InstrumentConfiguration | null;
  key: Key | null;
  metadata: MetadataConfiguration;
  normalizeChords: boolean;
  useUnicodeModifiers: boolean;
  user: UserConfigurationProperties | null;
}

// Legacy configuration properties type
export type ConfigurationProperties = Record<string, any> & Partial<{
  decapo: boolean;
  delegates: Partial<DelegatesConfiguration>;
  evaluate: boolean;
  expandChorusDirective: boolean;
  instrument: Partial<InstrumentConfiguration>;
  key: Key | string | null;
  metadata: Partial<MetadataConfiguration>;
  normalizeChords: boolean;
  useUnicodeModifiers: boolean;
  user: Partial<UserConfigurationProperties>;
}>;

// Default configuration
export const defaultBaseConfiguration: BaseFormatterConfiguration = {
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

export default BaseFormatterConfiguration;
