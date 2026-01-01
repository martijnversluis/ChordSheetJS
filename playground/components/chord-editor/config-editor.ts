import { APP_EVENTS, initStore } from '../../stores/init-store';
import { editorActions, editorState } from '../../stores/editor-store';
import { formatterActions, formatterState } from '../../stores/formatter-store';

/**
 * Web component for the configuration editor using CodeMirror
 */
export class ConfigEditor extends HTMLElement {
  private editorContainer: HTMLDivElement | null = null;

  private initialized = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Only set up the initial structure the first time
    if (!this.initialized) {
      this.createInitialStructure();
      this.initialized = true;
    }

    // Initialize the editor if it hasn't been set up yet
    if (!editorState.jsonView || !editorState.jsonView.dom.isConnected) {
      this.initializeEditor();
    }

    this.setupEventListeners();
  }

  disconnectedCallback() {
    // Clean up CodeMirror instance
    if (editorState.jsonView) {
      editorState.jsonView.destroy();
    }

    // Clean up event listeners
    this.removeEventListeners();

    // Mark config editor as not ready
    initStore.setComponentReady('configEditor', false);
  }

  createInitialStructure() {
    console.log('Creating initial structure for config editor');
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }

        .editor-container {
          flex: 1;
          overflow: hidden;
        }

        /* Style overrides for CodeMirror */
        .editor-container .cm-editor {
          height: 100%;
          width: 100%;
        }

        .editor-container .cm-scroller {
          overflow: auto;
          height: 100%;
        }
      </style>

      <div class="editor-container"></div>
    `;

    this.editorContainer = this.shadowRoot.querySelector('.editor-container');
  }

  initializeEditor() {
    if (!this.editorContainer) return;
    console.log('Initializing config editor', this.editorContainer);

    // Get config based on current formatter
    const configContent = this.getConfigContent();

    // Initialize the editor view
    editorActions.updateConfigContent(configContent);
    editorActions.createConfigEditorView(this.editorContainer);
  }

  getConfigContent() {
    // Get the appropriate config based on the current formatter
    const formatter = formatterState.currentFormatter;
    const config = formatterState.formatterConfigs[formatter];

    // Make sure we have a configuration
    if (config) {
      return JSON.stringify(config, null, 2);
    }
    // If for some reason we don't have a config, get the default one
    console.warn(`No config found for ${formatter}, loading default`);
    const defaultConfig = formatterActions.loadDefaultConfig(formatter);
    return JSON.stringify(defaultConfig, null, 2);
  }

  setupEventListeners() {
    // Listen for formatter pre-change to prepare the config editor
    document.addEventListener(APP_EVENTS.FORMATTER_WILL_CHANGE, this.handleFormatterWillChange);

    // Listen for formatter changes to update the config
    document.addEventListener(APP_EVENTS.FORMATTER_CHANGED, this.handleFormatterChange);

    // Listen for formatter config changes
    document.addEventListener(APP_EVENTS.FORMATTER_CONFIG_UPDATED, this.handleFormatterConfigUpdate);

    // Listen for config reload requests
    document.addEventListener(APP_EVENTS.CONFIG_RELOAD_REQUESTED, this.handleConfigReload);
  }

  removeEventListeners() {
    // Remove all event listeners
    document.removeEventListener(APP_EVENTS.FORMATTER_WILL_CHANGE, this.handleFormatterWillChange);
    document.removeEventListener(APP_EVENTS.FORMATTER_CHANGED, this.handleFormatterChange);
    document.removeEventListener(APP_EVENTS.FORMATTER_CONFIG_UPDATED, this.handleFormatterConfigUpdate);
    document.removeEventListener(APP_EVENTS.CONFIG_RELOAD_REQUESTED, this.handleConfigReload);
  }

  // Event handlers as arrow functions to preserve 'this' context
  handleFormatterWillChange = () => {
    console.log('Formatter will change, preparing config editor');
  };

  handleFormatterChange = () => {
    console.log('Formatter changed, updating config editor');
    this.updateConfigEditor();
  };

  handleFormatterConfigUpdate = () => {
    console.log('Formatter config updated');
    this.updateConfigEditor();
  };

  handleConfigReload = () => {
    console.log('Config reload requested');
    this.updateConfigEditor();
  };

  updateConfigEditor() {
    const configContent = this.getConfigContent();
    console.log('Updating config editor content');
    editorActions.updateConfigContent(configContent);
  }
}

// Register the web component
customElements.define('config-editor', ConfigEditor);
