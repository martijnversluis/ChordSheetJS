// Import all components to ensure they're registered
import './app-shell';
import './chord-editor/chord-editor';
import './chord-editor/config-editor';
import './control-panel/editor-controls';
import './control-panel/formatter-controls';
import './control-panel/config-controls';
import './display-panel/formatter-display';

// Export main app component for direct usage
export { ChordPlaygroundApp } from './app-shell';
