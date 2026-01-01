import { APP_EVENTS } from '../../stores/init-store.js';
import { chordproExamples } from '../../fixtures/content/example-chordpro';
import { editorActions, editorState } from '../../stores/editor-store';
import { songActions, songState } from '../../stores/song-store';

/**
 * Web component for editor controls
 * Includes parser selection and editor-specific options
 */
export class EditorControls extends HTMLElement {
  // References to DOM elements we'll need to update
  private parserSelector: HTMLSelectElement | null = null;

  private keySelector: HTMLSelectElement | null = null;

  private capoSelector: HTMLSelectElement | null = null;

  private fileSelector: HTMLSelectElement | null = null;

  private parserChangeInProgress = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  render() {
    if (!this.shadowRoot) return;

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
          min-width: 40px;
          max-width: 120px;
        }

        select:disabled {
          background-color: #f5f5f5;
          opacity: 0.7;
        }
      </style>

      <div class="controls-container">
        <div class="control-group">
          <label>File:</label>
          <select id="file-selector">
            ${this.renderFileOptions()}
          </select>
        </div>
        <div class="control-group">
          <label>Parser:</label>
          <select id="parser-selector">
            <option value="chordpro" ${editorState.editorMode === 'chordpro' ? 'selected' : ''}>ChordPro Parser</option>
            <option
              value="chords_over_words"
              ${editorState.editorMode === 'chords_over_words' ? 'selected' : ''}
            >Chords Over Words Parser</option>
          </select>
        </div>
        <div class="control-group">
          <label>Key:</label>
          <select id="key-selector">
            ${this.renderKeyOptions()}
          </select>
        </div>

        <div class="control-group">
          <label>Capo:</label>
          <select id="capo-selector">
            ${this.renderCapoOptions()}
          </select>
        </div>
      </div>
    `;

    // Cache references to DOM elements after creating them
    this.parserSelector = this.shadowRoot.getElementById('parser-selector') as HTMLSelectElement;
    this.keySelector = this.shadowRoot.getElementById('key-selector') as HTMLSelectElement;
    this.capoSelector = this.shadowRoot.getElementById('capo-selector') as HTMLSelectElement;
    this.fileSelector = this.shadowRoot.getElementById('file-selector') as HTMLSelectElement;

    // Immediately set the values to ensure they match the state
    if (this.parserSelector) {
      this.parserSelector.value = editorState.editorMode;
    }

    if (this.keySelector && songState.currentKey) {
      this.keySelector.value = songState.currentKey;
    }

    if (this.capoSelector && songState.capo !== undefined) {
      this.capoSelector.value = songState.capo.toString();
    }
  }

  // Generate key options based on songState.keys (if available), with fallback to common keys
  renderKeyOptions() {
    // Use songState.keys if available and not empty, otherwise use fallback keys
    const keys = (songState.keys && songState.keys.length > 0) ?
      songState.keys :
      ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];

    return keys
      .map((key) => (
        `<option value="${key}" ${key === songState.currentKey ? 'selected' : ''}>${key}</option>`
      ))
      .join('');
  }

  // Generate capo options with both capo number and resulting key
  renderCapoOptions() {
    const options: string[] = [];

    // Always include 0 (No capo) option first
    options.push(`<option value="0" ${songState.capo === 0 ? 'selected' : ''}>
      0 (No capo)
    </option>`);

    // If we have capos in the songState, add those (excluding 0 which we already added)
    if (songState.capos && Object.keys(songState.capos).length > 0) {
      Object.entries(songState.capos).forEach(([capoNumber, resultingKey]) => {
        const capoValue = parseInt(capoNumber, 10);
        // Skip 0 since we already added it
        if (capoValue > 0) {
          options.push(`<option value="${capoValue}" ${capoValue === songState.capo ? 'selected' : ''}>
            ${capoValue} (${resultingKey})
          </option>`);
        }
      });
    } else {
      // Fallback to just showing capo numbers without keys (starting from 1 since we already added 0)
      for (let i = 1; i < 12; i += 1) {
        options.push(`<option value="${i}" ${i === songState.capo ? 'selected' : ''}>
          ${i}
        </option>`);
      }
    }

    return options.join('');
  }

  // Generate options for the file selector
  renderFileOptions() {
    return chordproExamples.map((example, index) => `<option value="${index}">${example.name}</option>`).join('');
  }

  // Update selectors without full re-render
  updateSelectors() {
    if (!this.shadowRoot) return;

    // Only update if we have the references
    if (this.parserSelector) {
      this.parserSelector.value = editorState.editorMode;
      this.parserSelector.disabled = this.parserChangeInProgress || editorState.isCreatingEditor;
    }

    // Rebuild key options to reflect any changes
    if (this.keySelector) {
      this.keySelector.innerHTML = this.renderKeyOptions();
      this.keySelector.value = songState.currentKey;
    }

    // Rebuild capo options to reflect any changes
    if (this.capoSelector) {
      this.capoSelector.innerHTML = this.renderCapoOptions();
      if (songState.capo !== undefined) {
        this.capoSelector.value = songState.capo.toString();
      }
    }

    // Ensure file selector reflects current content
    if (this.fileSelector) {
      // Try to find current content in the examples
      const currentContent = editorState.input;
      const currentIndex = chordproExamples.findIndex((ex) => ex.content === currentContent);
      if (currentIndex !== -1) {
        this.fileSelector.value = currentIndex.toString();
      }
    }
  }

  setupEventListeners() {
    if (!this.shadowRoot) return;

    // File selector
    this.fileSelector?.addEventListener('change', this.handleFileChange);

    // Parser selector
    this.parserSelector?.addEventListener('change', this.handleParserChange);

    // Key selector
    this.keySelector?.addEventListener('change', this.handleKeyChange);

    // Capo selector
    this.capoSelector?.addEventListener('change', this.handleCapoChange);

    // Listen for state changes from elsewhere
    document.addEventListener(APP_EVENTS.EDITOR_MODE_CHANGED, this.handleEditorModeChange);
    document.addEventListener(APP_EVENTS.SONG_KEY_CHANGED, this.handleKeyStateChange);
    document.addEventListener(APP_EVENTS.SONG_CAPO_CHANGED, this.handleCapoStateChange);
    document.addEventListener(APP_EVENTS.SONG_PARSED, this.handleSongParsed);
  }

  removeEventListeners() {
    // Remove event listeners to prevent memory leaks
    this.fileSelector?.removeEventListener('change', this.handleFileChange);
    this.parserSelector?.removeEventListener('change', this.handleParserChange);
    this.keySelector?.removeEventListener('change', this.handleKeyChange);
    this.capoSelector?.removeEventListener('change', this.handleCapoChange);

    document.removeEventListener(APP_EVENTS.EDITOR_MODE_CHANGED, this.handleEditorModeChange);
    document.removeEventListener(APP_EVENTS.SONG_KEY_CHANGED, this.handleKeyStateChange);
    document.removeEventListener(APP_EVENTS.SONG_CAPO_CHANGED, this.handleCapoStateChange);
    document.removeEventListener(APP_EVENTS.SONG_PARSED, this.handleSongParsed);
  }

  // Handle file selection change
  handleFileChange = () => {
    if (this.fileSelector) {
      const selectedIndex = parseInt(this.fileSelector.value, 10);
      if (!Number.isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < chordproExamples.length) {
        const selectedExample = chordproExamples[selectedIndex];
        console.log('File changed to:', selectedExample.name);

        // Update editor content
        editorActions.updateEditorContent(selectedExample.content);
      }
    }
  };

  // Use arrow functions to preserve "this" context
  handleParserChange = () => {
    if (this.parserSelector && !this.parserChangeInProgress) {
      const newMode = this.parserSelector.value;
      console.log('Parser changing to:', newMode);

      // Disable the selector during change
      this.parserChangeInProgress = true;
      this.updateSelectors();

      // Set the editor mode
      editorActions.setEditorMode(newMode as any);

      // Re-enable the selector after a short delay
      setTimeout(() => {
        this.parserChangeInProgress = false;
        this.updateSelectors();
      }, 500);
    }
  };

  handleKeyChange = () => {
    if (this.keySelector && !songState.isProcessing) {
      const newKey = this.keySelector.value;
      console.log('Key changing to:', newKey);
      songActions.setKey(newKey);
    }
  };

  handleCapoChange = () => {
    if (this.capoSelector && !songState.isProcessing) {
      const capoValue = parseInt(this.capoSelector.value, 10);
      console.log('Capo changing to:', capoValue);
      songActions.setCapo(capoValue);
    }
  };

  // Event handlers for state changes - NOTE: no longer relying on event payloads
  handleEditorModeChange = () => {
    console.log('Editor mode changed to:', editorState.editorMode);
    this.updateSelectors();
  };

  handleKeyStateChange = () => {
    console.log('Key state changed to:', songState.currentKey);
    this.updateSelectors();
  };

  handleCapoStateChange = () => {
    console.log('Capo state changed to:', songState.capo);
    this.updateSelectors();
  };

  handleSongParsed = () => {
    console.log('Song parsed, updating controls');
    this.updateSelectors();
  };
}

// Register the web component
customElements.define('editor-controls', EditorControls);
