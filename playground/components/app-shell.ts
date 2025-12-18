import './chord-editor/chord-editor';
import './chord-editor/config-editor';
import './display-panel/formatter-display';
import './control-panel/editor-controls';
import './control-panel/formatter-controls';
import './control-panel/config-controls';

/**
 * Main application container
 * Orchestrates the layout and communication between components
 */
export class ChordPlaygroundApp extends HTMLElement {
  private initialized = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this.initialized) {
      this.createInitialStructure();
      this.initialized = true;
    }
  }

  createInitialStructure() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100vh;
          box-sizing: border-box;
        }

        .app-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 100%;
          overflow: hidden;
        }

        .left-panel {
          display: flex;
          flex-direction: column;
          border-right: 1px solid #ddd;
          height: 100%;
          overflow: hidden;
        }

        .editor-section {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
          border-bottom: 1px solid #ddd;
        }

        .config-section {
          display: flex;
          flex-direction: column;
          height: 30%;
          overflow: hidden;
        }

        .editor-controls {
          border-bottom: 1px solid #ddd;
          background-color: #f5f5f5;
        }

        .editor-container {
          flex: 1;
          overflow: hidden;
        }

        .config-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          background-color: #f5f5f5;
          border-bottom: 1px solid #ddd;
        }

        .config-controls-wrapper {
          background-color: #f8f8f8;
          border-bottom: 1px solid #ddd;
        }

        .config-container {
          flex: 1;
          overflow: hidden;
        }

        .right-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }

        .formatter-controls {
          border-bottom: 1px solid #ddd;
          background-color: #f5f5f5;
        }

        .display-container {
          flex: 1;
          overflow: auto;
        }
      </style>

      <div class="app-container">
        <!-- Left Panel with Editor and Config -->
        <div class="left-panel">
          <div class="editor-section">
            <div class="editor-controls">
              <editor-controls></editor-controls>
            </div>
            <div class="editor-container">
              <chord-editor></chord-editor>
            </div>
          </div>

          <div class="config-section">
            <div class="config-header">
              <span>Configuration Editor</span>
              <config-controls></config-controls>
            </div>
            <div class="config-container">
              <config-editor></config-editor>
            </div>
          </div>
        </div>

        <!-- Right Panel with Format Controls and Display -->
        <div class="right-panel">
          <div class="formatter-controls">
            <formatter-controls></formatter-controls>
          </div>
          <div class="display-container">
            <formatter-display></formatter-display>
          </div>
        </div>
      </div>
    `;
  }
}

// Register the web component
customElements.define('chord-playground-app', ChordPlaygroundApp);
