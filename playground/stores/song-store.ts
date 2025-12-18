import { createStore } from './store';
import { APP_EVENTS, initStore } from './init-store';
import { ChordProParser, ChordsOverWordsParser } from '../../src/index';
import { getCapos, getKeys } from '../../src/helpers.js';

// Interfaces for Song and Parser (simplified - would use actual types from your library)
interface Song {
  key?: string;
  title?: string;
  artist?: string;
  tempo?: string;
  time?: string;
  metadata?: Record<string, any>;
  clone(): Song;
  setKey(key: string): Song;
  changeKey(key: string): Song;
  setCapo(capo: number): Song;
  changeMetadata(name:string, value:string): Song;
}

interface Parser {
  parse(content: string, options?: any): Song;
}

// Store state interface
interface SongStoreState {
  song: Song | null;
  parsedSong: Song | null;
  parser: Parser | null;
  metadata: {
    title: string;
    softLineBreaks: boolean;
  };
  originalKey: string; // Key from the song file
  currentKey: string; // Currently selected key (could be different from original)
  capo: number;
  keys: string[]; // Available keys
  capos: Record<string, string>; // Available capos
  isProcessing: boolean; // Flag to prevent infinite loops
}

// Create the song store
const songStore = createStore<SongStoreState>({
  song: null,
  parsedSong: null,
  parser: new ChordProParser(), // Initialize with ChordPro parser
  metadata: {
    title: 'Untitled',
    softLineBreaks: true,
  },
  originalKey: 'C', // Default key
  currentKey: 'C', // Default key
  capo: 0, // Default capo
  keys: getKeys('C'), // Will be populated
  capos: getCapos('C'), // Will be populated
  isProcessing: false, // Initialization flag
});

// Song actions
const songActions = {
  // Set the parser
  setParser(parser: Parser) {
    const currentParser = songStore.getState().parser;
    // Only update if the parser is actually different
    if (
      (parser instanceof ChordProParser && !(currentParser instanceof ChordProParser)) ||
      (parser instanceof ChordsOverWordsParser && !(currentParser instanceof ChordsOverWordsParser))
    ) {
      songStore.setState({ parser });
      return true;
    }
    return false;
  },

  // Set key and update parsing
  setKey(key: string) {
    const state = songStore.getState();

    // Check if already processing
    if (state.isProcessing) return;

    // Only update if key is different
    if (state.currentKey !== key) {
      // Set processing flag
      songStore.setState({ isProcessing: true });

      try {
        console.log(`Setting key from ${state.currentKey} to ${key}`);

        // Update key
        songStore.setState({
          currentKey: key,
          capo: 0, // Reset capo when key changes
          capos: getCapos(key),
          keys: getKeys(key),
        });

        // Dispatch key change event so UI can update
        document.dispatchEvent(new CustomEvent(APP_EVENTS.SONG_KEY_CHANGED));

        // Update the parsed song with the new key if we have a song
        if (state.song) {
          this.updateParsedSong();
        }
      } finally {
        // Reset processing flag
        setTimeout(() => {
          songStore.setState({ isProcessing: false });
        }, 10);
      }
    }
  },

  // Set capo and update parsing
  setCapo(capo: number) {
    const state = songStore.getState();

    // Check if already processing
    if (state.isProcessing) return;

    // Only update if capo is different
    if (state.capo !== capo) {
      // Set processing flag
      songStore.setState({ isProcessing: true });

      // Update capo
      songStore.setState({ capo });

      console.log(`Setting capo from ${state.capo} to ${capo}`);

      // Update the parsed song with the new capo
      if (state.song) {
        this.updateParsedSong();
      }

      // Dispatch capo change event
      document.dispatchEvent(new CustomEvent(APP_EVENTS.SONG_CAPO_CHANGED));

      // Reset processing flag
      setTimeout(() => {
        songStore.setState({ isProcessing: false });
      }, 10);
    }
  },

  // Parse song content and update the store
  parseSongContent(content: string) {
    console.log('Parsing song content:', content && `${content.substring(0, 30)}...`);
    const state = songStore.getState();

    // Check if already processing
    if (state.isProcessing) return null;

    // Check if app is ready before proceeding
    if (!initStore.isReady) {
      console.log('App not ready, skipping song parsing');
      return null;
    }

    // Set processing flag
    songStore.setState({ isProcessing: true });

    if (!state.parser) {
      console.error('Parser not initialized');
      songStore.setState({ isProcessing: false });
      return null;
    }

    try {
      // Normalize content (example from your code)
      const normalizedContent = content.replace(/{k:/g, '{key:');

      // Parse and set song in state
      const song = state.parser.parse(normalizedContent, { softLineBreaks: true });
      const detectedKey = song.key || 'C'; // Use 'C' as fallback

      // Update song and original key
      songStore.setState({
        song,
        originalKey: detectedKey,
      });

      // If current key isn't set yet, use the detected key
      if (!state.currentKey || state.currentKey === state.originalKey) {
        songStore.setState({
          currentKey: detectedKey,
          keys: getKeys(detectedKey),
          capos: getCapos(detectedKey),
        });
      }

      // Now update the parsed song version
      this.updateParsedSong();

      // Reset processing flag
      setTimeout(() => {
        songStore.setState({ isProcessing: false });
      }, 10);

      return state.parsedSong;
    } catch (error) {
      console.error('Error parsing song:', error);
      // Reset processing flag in case of error
      songStore.setState({ isProcessing: false });
      return null;
    }
  },

  // Create a parsed version of the song with current key and capo settings
  updateParsedSong() {
    const state = songStore.getState();

    try {
      if (!state.song) {
        console.warn('No song to parse');
        return null;
      }

      // Clone the song to avoid modifying the original
      let processedSong: Song;
      if (typeof state.song.clone === 'function') {
        processedSong = state.song.clone();
      } else {
        // Fallback if clone is not available
        processedSong = state.song;
      }

      // Apply key and capo settings
      processedSong = processedSong.setKey(state.originalKey);
      processedSong = processedSong.changeKey(state.currentKey);
      processedSong = processedSong.setCapo(state.capo);

      // Update the parsed song in state
      songStore.setState({ parsedSong: processedSong });

      // Dispatch song parsed event
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent(APP_EVENTS.SONG_PARSED));
      }, 0);

      return processedSong;
    } catch (error) {
      console.error('Error updating parsed song:', error);
      return null;
    }
  },
};

// Set up event listeners for content and mode changes
document.addEventListener(APP_EVENTS.EDITOR_CONTENT_CHANGED, (e: CustomEvent) => {
  if (e.detail && e.detail.content) {
    // Check if app is ready
    if (!songStore.getState().isProcessing && initStore.isReady) {
      songActions.parseSongContent(e.detail.content);
    }
  }
});

// Update the parser when editor mode changes
document.addEventListener(APP_EVENTS.EDITOR_MODE_CHANGED, (e: CustomEvent) => {
  // Check if app is ready
  if (e.detail && e.detail.mode && !songStore.getState().isProcessing && initStore.isReady) {
    let parserChanged = false;

    if (e.detail.mode === 'chordpro') {
      parserChanged = songActions.setParser(new ChordProParser());
    } else if (e.detail.mode === 'chords_over_words') {
      parserChanged = songActions.setParser(new ChordsOverWordsParser());
    }

    // Re-parse if the parser changed and we have content
    if (parserChanged) {
      const state = songStore.getState();
      if (state.song) {
        const content = state.song.toString();
        songActions.parseSongContent(content);
      }
    }
  }
});

// Export a simplified interface to the store
const songState = {
  get song() { return songStore.getState().song; },
  get parsedSong() { return songStore.getState().parsedSong; },
  get parser() { return songStore.getState().parser; },
  get metadata() { return songStore.getState().metadata; },
  get currentKey() { return songStore.getState().currentKey; },
  get originalKey() { return songStore.getState().originalKey; },
  get capo() { return songStore.getState().capo; },
  get keys() { return songStore.getState().keys; },
  get capos() { return songStore.getState().capos; },
  get isProcessing() { return songStore.getState().isProcessing; },
};

// Export everything
export { songState, songActions };
