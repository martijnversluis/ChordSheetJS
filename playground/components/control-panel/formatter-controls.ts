import { APP_EVENTS } from '../../stores/init-store';
import { FormatterType, formatterActions, formatterState } from '../../stores/formatter-store';

/**
 * Web component for formatter controls
 * Includes formatter selection
 */
export class FormatterControls extends HTMLElement {
  // Reference to DOM element we'll need to update
  private formatterSelector: HTMLSelectElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    // Clean up event listeners when component is removed
    this.removeEventListeners();
  }

  render() {
    if (!this.shadowRoot) return;

    const formatterSelectOptions =
      formatterState.formatters
        .map((fmt) => (
          `<option value="${fmt}" ${fmt === formatterState.currentFormatter ? 'selected' : ''}>${fmt}</option>`
        ))
        .join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          padding: 8px;
          box-sizing: border-box;
        }

        .controls-container {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        label {
          font-weight: bold;
          margin-right: 4px;
          white-space: nowrap;
        }

        select {
          padding: 4px 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: white;
          font-size: 14px;
        }
      </style>

      <div class="controls-container">
        <div class="control-group">
          <label>Formatter:</label>
          <select id="formatter-selector">
            ${formatterSelectOptions}
          </select>
        </div>
      </div>
    `;

    // Cache reference to DOM element after creating it
    this.formatterSelector = this.shadowRoot.getElementById('formatter-selector') as HTMLSelectElement;
  }

  // Update selector value without full re-render
  updateSelector() {
    if (this.formatterSelector && formatterState.currentFormatter) {
      this.formatterSelector.value = formatterState.currentFormatter;
    }
  }

  setupEventListeners() {
    if (!this.shadowRoot) return;

    // Formatter selector
    this.formatterSelector?.addEventListener('change', this.handleFormatterChange);

    // Listen for formatter changes from elsewhere
    document.addEventListener(APP_EVENTS.FORMATTER_CHANGED, this.handleFormatterStateChange);
  }

  removeEventListeners() {
    // Remove event listeners to prevent memory leaks
    this.formatterSelector?.removeEventListener('change', this.handleFormatterChange);
    document.removeEventListener(APP_EVENTS.FORMATTER_CHANGED, this.handleFormatterStateChange);
  }

  // Use arrow functions to preserve "this" context
  handleFormatterChange = () => {
    if (this.formatterSelector) {
      console.log('Formatter changed to:', this.formatterSelector.value);
      formatterActions.setFormatter(this.formatterSelector.value as FormatterType);
    }
  };

  // Event handler for state changes - note no longer relying on event payload
  handleFormatterStateChange = () => {
    console.log('Formatter state changed to:', formatterState.currentFormatter);
    this.updateSelector();
  };
}

// Register the web component
customElements.define('formatter-controls', FormatterControls);
