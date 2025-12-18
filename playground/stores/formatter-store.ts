import { Key } from '../../src';

import { APP_EVENTS } from './init-store';
import { createStore } from './store';
import { formatterConfigExamples } from '../fixtures';
import { getMeasuredHtmlDefaultConfig } from '../../src/formatter/configuration/default_config_manager';
import { mergeConfigs } from '../../src/utilities';
import { songState } from './song-store';

import {
  BaseFormatterConfiguration,
  getDefaultConfig,
  getHTMLDefaultConfig,
  getPDFDefaultConfig,
} from '../../src/formatter/configuration';

import {
  ChordProFormatter,
  ChordsOverWordsFormatter,
  HtmlDivFormatter,
  PdfFormatter,
} from '../../src/index';

// Define the available formatter types
export type FormatterType = 'PDF' | 'ChordPro' | 'ChordsOverWords' | 'HTML' | 'MeasuredHTML';

// Store state interface
interface FormatterStoreState {
  formatters: FormatterType[];
  currentFormatter: FormatterType;
  currentConfig: any;
  formatterConfigs: Record<FormatterType, any>;
  formatter_instances: Record<FormatterType, any>;
  isUpdatingFormatter: boolean;
  formattedOutput: string | null;
}

// Map formatter types to configuration types
const formatterConfigMap = {
  'PDF': 'pdf',
  'ChordPro': 'base',
  'ChordsOverWords': 'base',
  'HTML': 'html',
  'MeasuredHTML': 'measuredHtml',
};

// Get initial default configurations
const initialFormatterConfigs = {
  'PDF': getPDFDefaultConfig(),
  'ChordPro': getDefaultConfig('base'),
  'ChordsOverWords': getDefaultConfig('base'),
  'HTML': getHTMLDefaultConfig(),
  'MeasuredHTML': getMeasuredHtmlDefaultConfig(),
};

// Create the formatter store with configurations
const formatterStore = createStore<FormatterStoreState>({
  formatters: ['PDF', 'ChordPro', 'ChordsOverWords', 'HTML', 'MeasuredHTML'],
  currentFormatter: 'MeasuredHTML',
  currentConfig: formatterConfigExamples.MeasuredHTML[0].content,
  formatterConfigs: initialFormatterConfigs,
  formatter_instances: {
    PDF: new PdfFormatter(),
    ChordPro: new ChordProFormatter(),
    ChordsOverWords: new ChordsOverWordsFormatter(),
    HTML: new HtmlDivFormatter(),
    MeasuredHTML: null,
  },
  isUpdatingFormatter: false,
  formattedOutput: null,
});

// Function to format a song using the selected formatter
function formatSong(formatter: any, options?: any): string {
  try {
    const song = songState.parsedSong;
    if (!song || !formatter) return '';

    const { currentFormatter } = formatterStore.getState();
    const config = { ...(formatterStore.getState().formatterConfigs[currentFormatter] || {}), ...options };

    console.log(`Formatting song with key: ${song.key}, config:`, config);
    return formatter.configure(config).format(song);
  } catch (error) {
    console.error('Error formatting song:', error);
    return 'Error formatting song.';
  }
}

// Formatter actions
const formatterActions = {
  // Debug function to log current state
  debugState() {
    const state = formatterStore.getState();
    console.group('Formatter Store Debug');
    console.log('Current formatter:', state.currentFormatter);
    console.log('Available formatters:', state.formatters);
    console.log('Formatter instances:', state.formatter_instances);
    console.log('Is updating:', state.isUpdatingFormatter);
    console.groupEnd();
    return state;
  },

  getDefaultConfig(formatter: FormatterType) {
    switch (formatter) {
      case 'PDF':
        return getPDFDefaultConfig();
      case 'HTML':
        return getHTMLDefaultConfig();
      case 'MeasuredHTML':
        return getMeasuredHtmlDefaultConfig();
      default:
        return getDefaultConfig(formatterConfigMap[formatter]);
    }
  },

  // Load default configuration for a formatter
  loadDefaultConfig(formatter: FormatterType) {
    const defaultConfig: BaseFormatterConfiguration = this.getDefaultConfig(formatter);
    defaultConfig.key = Key.parse(songState.originalKey || songState.currentKey);

    const currentConfigs = formatterStore.getState().formatterConfigs;
    formatterStore.setState({
      formatterConfigs: {
        ...currentConfigs,
        [formatter]: defaultConfig,
      },
      currentConfig: defaultConfig,
    });

    console.log(`Loaded default config for ${formatter}`);
    return defaultConfig;
  },

  // Change the current formatter
  setFormatter(formatter: FormatterType) {
    const state = formatterStore.getState();

    // Check if already updating or formatter hasn't changed
    if (state.isUpdatingFormatter || state.currentFormatter === formatter) return;

    // Set the flag to indicate we're updating
    formatterStore.setState({ isUpdatingFormatter: true });

    try {
      console.log(`Changing formatter from ${state.currentFormatter} to ${formatter}`);

      // Dispatch will-change event
      document.dispatchEvent(new CustomEvent(APP_EVENTS.FORMATTER_WILL_CHANGE));

      // Set the formatter
      formatterStore.setState({ currentFormatter: formatter });

      // Make sure we have the config loaded
      this.loadDefaultConfig(formatter);

      // Dispatch config updated event
      document.dispatchEvent(new CustomEvent(APP_EVENTS.FORMATTER_CONFIG_UPDATED));

      // Dispatch formatter changed event
      document.dispatchEvent(new CustomEvent(APP_EVENTS.FORMATTER_CHANGED));

      // Format the song with the new formatter
      this.formatCurrentSong();
    } finally {
      // Reset the flag
      setTimeout(() => {
        formatterStore.setState({ isUpdatingFormatter: false });
      }, 0);
    }
  },

  // Update formatter configuration
  updateFormatterConfig(formatter: FormatterType, config: any) {
    const currentConfigs = formatterStore.getState().formatterConfigs;
    const currentConfig = currentConfigs[formatter] || {};
    const key = songState.originalKey || songState.currentKey;

    const newConfig = mergeConfigs(currentConfig, config);
    newConfig.key = key;

    formatterStore.setState({ currentConfig: newConfig });

    // Check if there are actual changes
    const hasChanges = Object.entries(config).some(([k, v]) => (
      JSON.stringify(v) !== JSON.stringify(currentConfig[k])
    ));

    if (hasChanges) {
      // Update the config
      formatterStore.setState({
        formatterConfigs: {
          ...currentConfigs,
          [formatter]: {
            ...newConfig,
          },
        },
      });
    }
    console.log(`Updated config for ${formatter}`, config);
    // Dispatch config updated event
    document.dispatchEvent(new CustomEvent(APP_EVENTS.FORMATTER_CONFIG_UPDATED));
  },

  // Format the current song
  formatCurrentSong() {
    if (!songState.parsedSong) {
      console.warn('No song available to format');
      return;
    }

    const state = formatterStore.getState();
    const formatter = state.formatter_instances[state.currentFormatter];

    if (!formatter) {
      console.error(`Formatter "${state.currentFormatter}" not available`);
      return;
    }

    try {
      // Format the song
      const formattedContent = formatSong(formatter);

      // Update the formatted output
      formatterStore.setState({ formattedOutput: formattedContent });

      // Dispatch formatted content updated event
      document.dispatchEvent(new CustomEvent('formatter-output-updated', {
        detail: { content: formattedContent },
      }));
    } catch (error) {
      console.error('Error formatting song:', error);
    }
  },

  // Load a configuration preset
  loadConfigPreset(presetIndex: number) {
    const state = formatterStore.getState();
    const formatter = state.currentFormatter;
    const presets = formatterConfigExamples[formatter];

    if (presets && presets[presetIndex]) {
      console.log(`Loading config preset ${presetIndex} for ${formatter}`);
      this.updateFormatterConfig(formatter, presets[presetIndex].content);
    } else {
      console.warn(`Preset ${presetIndex} not found for ${formatter}`);
    }
  },

  // Get all configuration presets for a formatter
  getFormatterPresets(formatter: FormatterType) {
    const presets = formatterConfigExamples[formatter] || [];

    if (presets.length === 0) {
      const defaultConfig = this.loadDefaultConfig(formatter);
      return [{
        name: 'Default Configuration',
        content: defaultConfig,
      }];
    }

    const hasDefaultPreset = presets.some((preset) => preset.name.toLowerCase().includes('default'));

    if (!hasDefaultPreset) {
      const defaultConfig = this.loadDefaultConfig(formatter);
      return [
        ...presets,
        { name: 'Default Configuration', content: defaultConfig },
      ];
    }

    return presets;
  },
};

// Listen for song parsed events to format the song
document.addEventListener(APP_EVENTS.SONG_PARSED, () => {
  if (!formatterStore.getState().isUpdatingFormatter) {
    formatterActions.formatCurrentSong();
  }
});

// Export formatter state and actions
const formatterState = {
  get currentFormatter() { return formatterStore.getState().currentFormatter; },
  get currentConfig() { return formatterStore.getState().currentConfig; },
  get formatters() { return formatterStore.getState().formatters; },
  get formatterConfigs() { return formatterStore.getState().formatterConfigs; },
  get formatter_instances() { return formatterStore.getState().formatter_instances; },
  get isUpdatingFormatter() { return formatterStore.getState().isUpdatingFormatter; },
  get formattedOutput() { return formatterStore.getState().formattedOutput; },
};

export { formatterState, formatterActions };
