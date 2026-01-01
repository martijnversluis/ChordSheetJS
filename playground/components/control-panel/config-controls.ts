import { APP_EVENTS } from '../../stores/init-store';
import { formatterConfigExamples } from '../../fixtures';
import { editorActions, editorState } from '../../stores/editor-store';
import { formatterActions, formatterState } from '../../stores/formatter-store';

/**
 * Web component for configuration controls
 * Handles preset selection and config application
 */
export class ConfigControls extends HTMLElement {
  private presetSelector: HTMLSelectElement | null = null;

  private applyButton: HTMLButtonElement | null = null;

  private isConfigValid = true;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.updatePresetSelector();
    this.validateConfig();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          align-items: center;
          padding: 8px;
          font-family: Arial, sans-serif;
          gap: 8px;
        }

        .config-controls-container {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
        }

        .config-label {
          font-size: 14px;
          font-weight: bold;
          white-space: nowrap;
        }

        select {
          padding: 4px 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #fff;
          font-size: 14px;
          flex: 1;
        }

        button {
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        button.valid {
          background-color: #4CAF50;
          color: white;
        }

        button.invalid {
          background-color: #f44336;
          color: white;
        }

        button.valid:hover {
          background-color: #45a049;
        }

        button.invalid:hover {
          background-color: #d32f2f;
        }
      </style>

      <div class="config-controls-container">
        <span class="config-label">Preset:</span>
        <select id="preset-selector">
          <option value="current">Current Configuration</option>
          <!-- Presets will be added dynamically -->
        </select>

        <button id="apply-button" class="valid">Config Applied</button>
      </div>
    `;

    // Get UI elements
    this.presetSelector = this.shadowRoot.getElementById('preset-selector') as HTMLSelectElement;
    this.applyButton = this.shadowRoot.getElementById('apply-button') as HTMLButtonElement;
  }

  setupEventListeners() {
    // Setup preset selector change event
    if (this.presetSelector) {
      this.presetSelector.addEventListener('change', this.handlePresetChange);
    }

    // Setup apply button click event
    if (this.applyButton) {
      this.applyButton.addEventListener('click', this.handleApplyConfig);
    }

    // Listen for formatter changes to update presets
    document.addEventListener(APP_EVENTS.FORMATTER_CHANGED, this.handleFormatterChange);

    // Listen for formatter pre-change
    document.addEventListener(APP_EVENTS.FORMATTER_WILL_CHANGE, this.handleFormatterWillChange);

    document.addEventListener(APP_EVENTS.CONFIG_CHANGED, this.handleApplyConfig);

    // Listen for editor content changes to validate JSON
    document.addEventListener(APP_EVENTS.EDITOR_CONTENT_CHANGED, this.validateConfig);
  }

  removeEventListeners() {
    if (this.presetSelector) {
      this.presetSelector.removeEventListener('change', this.handlePresetChange);
    }

    if (this.applyButton) {
      this.applyButton.removeEventListener('click', this.handleApplyConfig);
    }

    document.removeEventListener(APP_EVENTS.FORMATTER_CHANGED, this.handleFormatterChange);
    document.removeEventListener(APP_EVENTS.FORMATTER_WILL_CHANGE, this.handleFormatterWillChange);
    document.removeEventListener(APP_EVENTS.CONFIG_CHANGED, this.handleApplyConfig);
    document.removeEventListener(APP_EVENTS.EDITOR_CONTENT_CHANGED, this.validateConfig);
  }

  // Validate JSON configuration
  validateConfig = () => {
    try {
      const configContent = editorState.configInput;
      JSON.parse(configContent);
      this.setConfigValidity(true);
    } catch (_error) {
      this.setConfigValidity(false);
    }
  };

  // Update the UI to reflect config validity
  setConfigValidity(isValid: boolean) {
    this.isConfigValid = isValid;

    if (this.applyButton) {
      if (isValid) {
        this.applyButton.classList.add('valid');
        this.applyButton.classList.remove('invalid');
        this.applyButton.textContent = 'Config Applied';
      } else {
        this.applyButton.classList.add('invalid');
        this.applyButton.classList.remove('valid');
        this.applyButton.textContent = 'Invalid JSON';
      }
    }
  }

  // Event handler for formatter changes
  handleFormatterChange = () => {
    console.log('Formatter changed, updating preset selector');
    this.updatePresetSelector();
  };

  // Event handler for formatter pre-change
  handleFormatterWillChange = () => {
    console.log('Formatter will change, resetting preset selector');
    // Reset the preset selector to the first option
    if (this.presetSelector) {
      this.presetSelector.selectedIndex = 0;
    }
  };

  // Event handler for preset changes
  handlePresetChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    const selectedValue = select.value;

    // Parse the preset index
    const presetIndex = parseInt(selectedValue, 10);
    if (!Number.isNaN(presetIndex)) {
      // Load the preset configuration
      const formatter = formatterState.currentFormatter;
      const presets = formatterConfigExamples[formatter];

      if (presets && presets[presetIndex]) {
        // Update the editor with the preset config
        const presetConfig = JSON.stringify(presets[presetIndex].content, null, 2);
        editorActions.updateConfigContent(presetConfig);
        this.validateConfig(); // Validate the newly loaded config
      }
    }
  };

  // Event handler for apply button
  handleApplyConfig = () => {
    try {
      const configContent = editorState.configInput;
      const config = JSON.parse(configContent);

      const formatter = formatterState.currentFormatter;
      if (formatter) {
        formatterActions.updateFormatterConfig(formatter, config);
        console.log(`Applied configuration to ${formatter} formatter`);
        this.setConfigValidity(true);
      }
    } catch (error) {
      console.error('Error applying configuration:', error);
      this.setConfigValidity(false);
    }
  };

  updatePresetSelector() {
    if (!this.presetSelector) return;

    // Clear existing options (except the first 'Current Configuration' option)
    while (this.presetSelector.options.length > 1) {
      this.presetSelector.remove(1);
    }

    // Get presets for current formatter
    const formatter = formatterState.currentFormatter;
    const presets = formatterConfigExamples[formatter];

    if (presets && presets.length > 0) {
      // Add preset options
      presets.forEach((preset, index) => {
        const option = document.createElement('option');
        option.value = index.toString();
        option.textContent = preset.name;
        this.presetSelector?.appendChild(option);
      });

      console.log(`Added ${presets.length} presets for ${formatter}`);
    } else {
      console.log(`No presets available for ${formatter}`);
    }
  }
}

// Register the web component
customElements.define('config-controls', ConfigControls);
