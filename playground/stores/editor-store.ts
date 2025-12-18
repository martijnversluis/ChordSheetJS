import { json } from '@codemirror/lang-json';
import { lintGutter } from '@codemirror/lint';
import { defaultKeymap, history } from '@codemirror/commands';

import { chordproExamples } from '../fixtures/content/example-chordpro';
import { createStore } from './store';
import { APP_EVENTS, initStore } from './init-store';

import {
  EditorView,
  highlightActiveLine,
  keymap,
  lineNumbers,
} from '@codemirror/view';

// Example chord sheet content - always use the first example
const exampleChordPro = chordproExamples[0].content;

// Define the editor store state interface
interface EditorStoreState {
  editorMode: 'chordpro' | 'chords_over_words';
  editorView: EditorView | null;
  jsonView: EditorView | null;
  input: string;
  configInput: string;
  editorExtensions: any[];
  jsonEditorExtensions: any[];
  isCreatingEditor: boolean; // Flag to prevent multiple editor creations
}

let editorStore;

// Create input change listener for CodeMirror
const updateListener = EditorView.updateListener.of((v) => {
  if (v.docChanged) {
    const content = v.state.doc.toString();
    editorStore.setState({ input: content });

    // Dispatch custom event for song content change
    document.dispatchEvent(new CustomEvent(APP_EVENTS.EDITOR_CONTENT_CHANGED, {
      detail: { content },
    }));
  }
});

// Create config change listener for CodeMirror
const configUpdateListener = EditorView.updateListener.of((v) => {
  if (v.docChanged) {
    const content = v.state.doc.toString();
    editorStore.setState({ configInput: content });

    // Dispatch custom event for config change
    document.dispatchEvent(new CustomEvent(APP_EVENTS.CONFIG_CHANGED, {
      detail: { config: content },
    }));
  }
});

// Shared CodeMirror extensions
const sharedExtensions = [
  keymap.of(defaultKeymap),
  lineNumbers(),
  lintGutter(),
  highlightActiveLine(),
  history(),
];

// Create the editor store
editorStore = createStore<EditorStoreState>({
  editorMode: 'chordpro',
  editorView: null,
  jsonView: null,
  input: exampleChordPro,
  configInput: '{}',
  editorExtensions: [
    ...sharedExtensions,
    updateListener,
  ],
  jsonEditorExtensions: [
    json(),
    ...sharedExtensions,
    configUpdateListener,
  ],
  isCreatingEditor: false, // Initialize flag
});

// Editor actions
const editorActions = {
  // Create and set up the CodeMirror editor or update existing one
  createEditorView(container: HTMLElement) {
    const state = editorStore.getState();

    // Prevent multiple simultaneous editor operations
    if (state.isCreatingEditor) {
      console.log('Editor operation already in progress, skipping');
      return;
    }

    // Set the flag to indicate editor operation in progress
    editorStore.setState({ isCreatingEditor: true });

    try {
      // If editor already exists, no need to recreate it
      if (state.editorView) {
        console.log('Editor view already exists, no need to recreate');

        // Instead of destroying, just make sure it's in the right container
        if (state.editorView.dom.parentElement !== container) {
          console.log('Moving editor to correct container');
          container.appendChild(state.editorView.dom);
        }

        // Update content if needed
        this.updateEditorContent(state.input);
      } else {
        // Only create a new editor if one doesn't exist
        console.log('Initializing new editor view');
        const editorView = new EditorView({
          doc: state.input,
          extensions: state.editorExtensions,
          parent: container,
        });

        // Update the store with the new editor view
        editorStore.setState({ editorView });
        console.log('Editor view created successfully');
      }

      // Signal that the editor is ready
      initStore.setComponentReady('chordEditor', true);
    } catch (error) {
      console.error('Error with editor view operation:', error);
    } finally {
      // Reset the flag when done
      editorStore.setState({ isCreatingEditor: false });
    }
  },

  // Create and set up the configuration editor
  createConfigEditorView(container: HTMLElement) {
    const state = editorStore.getState();

    try {
      // Clean up existing editor first if it exists
      if (state.jsonView) {
        state.jsonView.destroy();
      }

      // Initialize config editor
      const jsonView = new EditorView({
        doc: state.configInput,
        extensions: state.jsonEditorExtensions,
        parent: container,
      });

      editorStore.setState({ jsonView });

      // Signal that the config editor is ready
      initStore.setComponentReady('configEditor', true);
    } catch (error) {
      console.error('Error creating config editor:', error);
    }
  },

  // Change editor mode
  setEditorMode(mode: 'chordpro' | 'chords_over_words') {
    const state = editorStore.getState();
    const currentMode = state.editorMode;

    // Only change mode if it's different
    if (currentMode !== mode) {
      console.log(`Setting editor mode from ${currentMode} to ${mode}`);

      // Update the state
      editorStore.setState({ editorMode: mode });

      // Dispatch mode change event
      document.dispatchEvent(new CustomEvent(APP_EVENTS.EDITOR_MODE_CHANGED, {
        detail: { mode },
      }));
    }
  },

  // Update editor content
  updateEditorContent(content: string) {
    const state = editorStore.getState();
    if (state.editorView) {
      const currentContent = state.editorView.state.doc.toString();

      // Only update if content is different
      if (currentContent !== content) {
        const docLength = state.editorView.state.doc.length;
        const transaction = state.editorView.state.update({
          changes: { from: 0, to: docLength, insert: content },
        });
        state.editorView.dispatch(transaction);
        editorStore.setState({ input: content });
      }
    } else {
      // If editor view doesn't exist yet, just update the input
      console.log('Editor view not available, updating input state only');
      editorStore.setState({ input: content });
    }
  },

  // Update config content
  updateConfigContent(content: string) {
    const state = editorStore.getState();
    if (state.jsonView) {
      const currentContent = state.jsonView.state.doc.toString();

      // Only update if content is different
      if (currentContent !== content) {
        const docLength = state.jsonView.state.doc.length;
        const transaction = state.jsonView.state.update({
          changes: { from: 0, to: docLength, insert: content },
        });
        state.jsonView.dispatch(transaction);
        editorStore.setState({ configInput: content });
      }
    } else {
      // If JSON view doesn't exist yet, just update the config input
      editorStore.setState({ configInput: content });
    }
  },
};

// Export a simplified interface to the store
const editorState = {
  get editorMode() { return editorStore.getState().editorMode; },
  get input() { return editorStore.getState().input; },
  get configInput() { return editorStore.getState().configInput; },
  get editorView() { return editorStore.getState().editorView; },
  get jsonView() { return editorStore.getState().jsonView; },
  get isCreatingEditor() { return editorStore.getState().isCreatingEditor; },
};

// Listen for app-ready event to trigger initial content dispatch
document.addEventListener(APP_EVENTS.APP_READY, () => {
  // Trigger an initial content change event to ensure the song gets parsed
  if (editorState.input) {
    console.log('App ready, dispatching initial content event');
    document.dispatchEvent(new CustomEvent(APP_EVENTS.EDITOR_CONTENT_CHANGED, {
      detail: { content: editorState.input },
    }));
  }
});

export { editorState, editorActions };
