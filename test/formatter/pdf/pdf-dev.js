import { chordproExamples } from './chordpro-examples';
import { configExamples } from './config-examples';
import { exampleSongSolfege, exampleSongSymbol } from '../../fixtures/song';
import { getCapos, getKeys } from '../../../src/helpers';

import {
  ChordProFormatter,
  ChordProParser,
  ChordsOverWordsFormatter,
  HtmlDivFormatter,
  HtmlTableFormatter,
  MeasuredHtmlFormatter,
  PdfFormatter,
  TextFormatter,
} from '../../../src';

// Initialize CodeMirror instances
const editor = CodeMirror(document.getElementById('editor'), {
  mode: 'javascript',
  lineNumbers: true,
  value: '',
});
editor.setSize('100%', '46vh');

const configEditor = CodeMirror(document.getElementById('configEditor'), {
  mode: 'javascript',
  lineNumbers: true,
  value: '',
});
configEditor.setSize('100%', '46vh');

// DOM elements
const chordproSelect = document.getElementById('chordproSelect');
const configSelect = document.getElementById('configSelect');
const keySelect = document.getElementById('keySelect');
const capoSelect = document.getElementById('capoSelect');
const formatterSelect = document.getElementById('formatterSelect');
const pdfViewer = document.getElementById('pdfViewer');
const textViewer = document.getElementById('textViewer');

// Formatter instances
const formatters = {
  MeasuredHtmlFormatter: new MeasuredHtmlFormatter(textViewer),
  HtmlTableFormatter: new HtmlTableFormatter(),
  PdfFormatter: new PdfFormatter(),
  HtmlDivFormatter: new HtmlDivFormatter(),
  TextFormatter: new TextFormatter(),
  ChordProFormatter: new ChordProFormatter(),
  ChordsOverWordsFormatter: new ChordsOverWordsFormatter(),
};

// Add song objects to examples
const allExamples = [
  ...chordproExamples,
  { name: '[TEST] Example Song Symbol', content: '', songObject: exampleSongSymbol },
  { name: '[TEST] Example Song Solfege', content: '', songObject: exampleSongSolfege },
];

function populateSelect(selectElement, options) {
  selectElement.innerHTML = ''; // eslint-disable-line no-param-reassign
  options.forEach((option, index) => {
    const opt = document.createElement('option');
    opt.value = index;
    opt.text = option.name;
    selectElement.add(opt);
  });
}

populateSelect(chordproSelect, allExamples);
populateSelect(configSelect, configExamples);

function initializeKeyAndCapoSelectors(songKey) {
  const keys = getKeys(songKey);
  keySelect.innerHTML = '';
  keys.forEach((key) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = key;
    keySelect.appendChild(option);
  });
  keySelect.value = songKey;

  const capoPositions = getCapos(songKey);
  capoSelect.innerHTML = '';
  const noneOption = document.createElement('option');
  noneOption.value = 'none';
  noneOption.textContent = 'None';
  capoSelect.appendChild(noneOption);
  Object.entries(capoPositions).forEach(([position, resultingKey]) => {
    const option = document.createElement('option');
    option.value = position;
    option.textContent = `${position} (${resultingKey})`;
    capoSelect.appendChild(option);
  });
}

const updateOutput = async (key, capo) => {
  const selectedExampleIndex = parseInt(chordproSelect.value, 10);
  const selectedExample = allExamples[selectedExampleIndex];
  const configText = configEditor.getValue();
  const selectedFormatter = formatterSelect.value;

  // Check if config is needed for this formatter type
  const formatterNeedsConfig = ['PdfFormatter', 'MeasuredHtmlFormatter'].includes(selectedFormatter);
  if (!configText.trim() && formatterNeedsConfig) {
    return;
  }

  let configJson = {};
  if (formatterNeedsConfig) {
    try {
      configJson = JSON.parse(configText);
    } catch (e) {
      console.error('Invalid JSON in config editor:', e);
      return;
    }
  }

  try {
    let song;
    if (selectedExample.songObject) {
      song = selectedExample.songObject;
      editor.setOption('readOnly', true);
    } else {
      const chordProText = editor.getValue();
      if (!chordProText.trim()) return;
      song = new ChordProParser().parse(chordProText, { softLineBreaks: true });
      editor.setOption('readOnly', false);
    }

    if (!keySelect.options.length && song.key) {
      initializeKeyAndCapoSelectors(song.key);
    }

    const initialKey = key || (keySelect.value || song.key);
    const capoPosition = capo || capoSelect.value;
    if (initialKey && song.key) song = song.changeKey(initialKey);
    if (capoPosition !== 'none') song = song.setCapo(parseInt(capoPosition, 10));

    // Prepare for rendering
    if (selectedFormatter === 'PdfFormatter') {
      // PDF setup
      pdfViewer.style.display = 'block';
      textViewer.style.display = 'none';
    } else {
      // For all non-PDF formatters
      textViewer.style.display = 'block';
      pdfViewer.style.display = 'none';
    }

    // Create a configuration object
    const configuration = {
      key: initialKey,
      normalizeChords: true,
      useUnicodeModifiers: false,
      decapo: true,
      ...configJson,
    };

    // Handle MeasuredHtmlFormatter specially
    if (selectedFormatter === 'MeasuredHtmlFormatter') {
      // Ensure the container is visible before measuring
      if (textViewer.offsetWidth === 0) {
        // Force a reflow and wait for the container to be visible
        setTimeout(() => updateOutput(key, capo), 50);
        return;
      }

      // Get accurate dimensions now that we're sure container is in DOM and visible
      const width = textViewer.clientWidth;
      const height = textViewer.clientHeight;

      console.log('Measured container dimensions:', width, height);

      // Create a fresh formatter instance with the current container
      formatters.MeasuredHtmlFormatter = new MeasuredHtmlFormatter(textViewer);

      // Set page size with proper dimensions
      configuration.pageSize = {
        width,
        height,
      };

      // Format and update
      formatters.MeasuredHtmlFormatter.configure(configuration)
        .format(song);
      const html = formatters.MeasuredHtmlFormatter.getHTMLString();
      textViewer.innerHTML = html;
    } else if (selectedFormatter === 'PdfFormatter') {
      // PDF formatter logic
      formatters.PdfFormatter.configure(configuration)
        .format(song);
      const pdfBlob = await formatters.PdfFormatter.generatePDF();
      const blobUrl = URL.createObjectURL(pdfBlob);
      pdfViewer.src = blobUrl;
    } else {
      // All other formatters
      const formatter = formatters[selectedFormatter];
      const output = formatter.format(song);
      textViewer.innerHTML = selectedFormatter.includes('Html') ? output : `<pre>${output}</pre>`;
    }
  } catch (e) {
    console.log(`⚠️ Error generating output with ${selectedFormatter}:`, e);
    console.error(e);
  }
};

function loadExample(index) {
  const example = allExamples[index];
  if (example.songObject) {
    editor.setValue(`// Using pre-defined Song object: ${example.name}\n// Editor is read-only`);
    editor.setOption('readOnly', true);
  } else {
    editor.setValue(example.content);
    editor.setOption('readOnly', false);
  }
  updateOutput();
}

function loadConfigExample(index) {
  const example = configExamples[index];
  const configString = JSON.stringify(example.content, null, 4);
  configEditor.setValue(configString);
  updateOutput();
}

// Event Listeners
keySelect.addEventListener('change', (e) => {
  initializeKeyAndCapoSelectors(e.target.value);
  updateOutput(e.target.value, capoSelect.value);
});

capoSelect.addEventListener('change', (e) => {
  updateOutput(keySelect.value, e.target.value);
});

chordproSelect.addEventListener('change', () => {
  loadExample(chordproSelect.value);
});

configSelect.addEventListener('change', () => {
  loadConfigExample(configSelect.value);
});

formatterSelect.addEventListener('change', () => {
  const needsConfig = ['PdfFormatter', 'MeasuredHtmlFormatter'].includes(formatterSelect.value);
  configSelect.disabled = !needsConfig;
  configEditor.setOption('readOnly', !needsConfig);

  if (!needsConfig) {
    configEditor.setValue('// Configs only apply to PdfFormatter and LayoutHtmlFormatter');
  } else if (formatterSelect.value === 'LayoutHtmlFormatter') {
    // Find the Layout HTML Config index
    const layoutConfigIndex = configExamples.findIndex((config) => config.name === 'Layout HTML Config');
    if (layoutConfigIndex >= 0) {
      configSelect.value = layoutConfigIndex;
      loadConfigExample(layoutConfigIndex);
    }
  }
  updateOutput();
});

editor.on('change', () => {
  if (!editor.getOption('readOnly')) updateOutput();
});

configEditor.on('change', () => {
  const formatter = formatterSelect.value;
  if (['PdfFormatter', 'MeasuredHtmlFormatter'].includes(formatter)) {
    updateOutput();
  }
});

function initialize() {
  // Add Layout HTML formatter to the dropdown
  const layoutOption = document.createElement('option');
  layoutOption.value = 'LayoutHtmlFormatter';
  layoutOption.text = 'Layout HTML';
  formatterSelect.add(layoutOption);

  chordproSelect.value = 0;
  configSelect.value = 0;
  loadExample(chordproSelect.value);
  loadConfigExample(configSelect.value);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initialize);

// Handle window resize to update layout HTML formatter if active
window.addEventListener('resize', () => {
  if (formatterSelect.value === 'MeasuredHtmlFormatter') {
    updateOutput();
  }
});
