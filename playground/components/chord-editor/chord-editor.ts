import { APP_EVENTS, initStore } from '../../stores/init-store';
import { editorActions, editorState } from '../../stores/editor-store';

/**
 * Web component for the chord editor using CodeMirror
 */
export class ChordEditor extends HTMLElement {
  private editorContainer: HTMLDivElement | null = null;

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

    this.initializeEditor();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    // Clean up event listeners
    this.removeEventListeners();

    // We only destroy the editor when the component is removed from the DOM
    if (editorState.editorView) {
      editorState.editorView.destroy();
    }

    // Mark editor as not ready
    initStore.setComponentReady('chordEditor', false);
  }

  createInitialStructure() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }

        .editor-container {
          height: 100%;
          width: 100%;
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

    // Initialize with current content and mode from the store
    if (!editorState.editorView) {
      console.log('Creating initial editor view');
      editorActions.createEditorView(this.editorContainer);

      // Mark chord editor as ready after initialization
      setTimeout(() => {
        console.log('Chord editor initialized');
        initStore.setComponentReady('chordEditor', true);
      }, 50);
    } else {
      console.log('Editor view already exists, reusing it');

      // If the editor already exists but is not attached to this container
      if (editorState.editorView.dom.parentElement !== this.editorContainer) {
        this.editorContainer.appendChild(editorState.editorView.dom);
      }

      // If we're reusing an existing editor, it's ready immediately
      initStore.setComponentReady('chordEditor', true);
    }
  }

  setupEventListeners() {
    // Listen for editor mode changes
    document.addEventListener(APP_EVENTS.EDITOR_MODE_CHANGED, this.handleEditorModeChange);

    // Listen for song content changes from other sources
    document.addEventListener(APP_EVENTS.SONG_PARSED, this.handleSongParsed);
  }

  removeEventListeners() {
    // Remove all event listeners
    document.removeEventListener(APP_EVENTS.EDITOR_MODE_CHANGED, this.handleEditorModeChange);
    document.removeEventListener(APP_EVENTS.SONG_PARSED, this.handleSongParsed);
  }

  // Event handlers as arrow functions to preserve 'this' context
  handleEditorModeChange = () => {
    console.log(`Editor mode changed to: ${editorState.editorMode}`);
    // The mode change is already handled by the editorActions.setEditorMode call
  };

  handleSongParsed = () => {
    // This could be used if we need to update the editor content
    // after the song is parsed, for example to show the transposed content
    console.log('Song parsed event received in editor');
  };
}

// Register the web component
customElements.define('chord-editor', ChordEditor);
