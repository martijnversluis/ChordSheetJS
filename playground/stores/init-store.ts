import { createStore } from './store';

// Define event names as constants for consistency
export const APP_EVENTS = {
  APP_READY: 'app-ready',
  COMPONENT_READY: 'component-ready',
  ALL_COMPONENTS_READY: 'all-components-ready',
  SONG_PARSED: 'song-parsed',
  SONG_KEY_CHANGED: 'song-key-changed',
  SONG_CAPO_CHANGED: 'song-capo-changed',
  FORMATTER_WILL_CHANGE: 'formatter-will-change',
  FORMATTER_CHANGED: 'formatter-changed',
  FORMATTER_CONFIG_UPDATED: 'formatter-config-updated',
  EDITOR_CONTENT_CHANGED: 'editor-content-changed',
  EDITOR_MODE_CHANGED: 'editor-mode-changed',
  CONFIG_CHANGED: 'config-changed',
  CONFIG_TYPE_CHANGED: 'config-type-changed',
  CONFIG_RELOAD_REQUESTED: 'config-reload-requested',
  FORMAT_CONVERSION_COMPLETE: 'format-conversion-complete', // Add this new event
};

interface InitStoreState {
  chordEditorReady: boolean;
  configEditorReady: boolean;
  formatterDisplayReady: boolean;
  isAppReady: boolean;
}

// Create the initialization store
const initStoreObj = createStore<InitStoreState>({
  chordEditorReady: false,
  configEditorReady: false,
  formatterDisplayReady: false,
  isAppReady: false,
});

// Init store actions
const initActions = {
  setComponentReady(componentName: string, isReady = true) {
    switch (componentName) {
      case 'chordEditor':
        initStoreObj.setState({ chordEditorReady: isReady });
        break;
      case 'configEditor':
        initStoreObj.setState({ configEditorReady: isReady });
        break;
      case 'formatterDisplay':
        initStoreObj.setState({ formatterDisplayReady: isReady });
        break;
      default:
        console.warn(`Unknown component name: ${componentName}`);
    }

    this.checkIfAppReady();
  },

  checkIfAppReady() {
    const state = initStoreObj.getState();
    const wasReady = state.isAppReady;

    // Check if all required components are ready
    const isNowReady = state.chordEditorReady &&
                        state.configEditorReady &&
                        state.formatterDisplayReady;

    // Only update and dispatch event if state actually changed
    if (!wasReady && isNowReady) {
      initStoreObj.setState({ isAppReady: true });
      console.log('All components initialized, app is ready');

      // Dispatch app-ready event
      document.dispatchEvent(new CustomEvent(APP_EVENTS.APP_READY));
    }
  },
};

// Export a simplified interface to the store
const initStore = {
  get isReady() { return initStoreObj.get('isAppReady'); },
  get chordEditorReady() { return initStoreObj.get('chordEditorReady'); },
  get configEditorReady() { return initStoreObj.get('configEditorReady'); },
  get formatterDisplayReady() { return initStoreObj.get('formatterDisplayReady'); },
  setComponentReady: initActions.setComponentReady.bind(initActions),
  checkIfAppReady: initActions.checkIfAppReady.bind(initActions),
};

export { initStore };
