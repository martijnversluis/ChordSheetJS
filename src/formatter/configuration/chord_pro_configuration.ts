import { BaseFormatterConfiguration } from './base_configuration';

export interface ChordProFormatterConfiguration extends BaseFormatterConfiguration {
  applyChordStyle: boolean;
}

export const chordProSpecificDefaults: Partial<ChordProFormatterConfiguration> = {
  applyChordStyle: false,
  normalizeChordSuffix: false,
};
