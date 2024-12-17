import { normalize } from 'path';
import { ChordProParser, PdfFormatter, Configuration } from '../../../lib';
import { getKeys, getCapos } from '../../../src/helpers';

import { chordproExamples } from './chordpro-examples';
import { configExamples } from './config-examples';

// Initialize CodeMirror instances
const editor = CodeMirror(document.getElementById('editor'), {
  mode: 'javascript',
  lineNumbers: true,
  value: '', // Empty initially
});
editor.setSize('100%', '46vh');

const configEditor = CodeMirror(document.getElementById('configEditor'), {
  mode: 'javascript',
  lineNumbers: true,
  value: '', // Empty initially
});
configEditor.setSize('100%', '46vh');

// Populate the dropdowns
const chordproSelect = document.getElementById('chordproSelect');
const configSelect = document.getElementById('configSelect');
const keySelect = document.getElementById('keySelect');
const capoSelect = document.getElementById('capoSelect');

function populateSelect(selectElement, options) {
  selectElement.innerHTML = '';
  options.forEach((option, index) => {
    const opt = document.createElement('option');
    opt.value = index; // Use index to reference the array
    opt.text = option.name;
    selectElement.add(opt);
  });
}

populateSelect(chordproSelect, chordproExamples);
populateSelect(configSelect, configExamples);

// Function to render PDF in an <iframe>
const renderPDFInBrowser = async (pdfBlob) => {
  const pdfContainer = document.getElementById('pdfViewer');
  pdfContainer.innerHTML = ''; // Clear previous content
  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  const blobUrl = URL.createObjectURL(pdfBlob);
  iframe.src = blobUrl;
  pdfContainer.appendChild(iframe);
};

function initializeKeyAndCapoSelectors(songKey) {
  // Initialize key selector
  const keys = getKeys(songKey);
  keySelect.innerHTML = '';
  keys.forEach(key => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = key;
    keySelect.appendChild(option);
  });
  keySelect.value = songKey;

  // Initialize capo selector
  const capoPositions = getCapos(songKey);
  capoSelect.innerHTML = '';

  // Add 'None' option first
  const noneOption = document.createElement('option');
  noneOption.value = 'none';
  noneOption.textContent = 'None';
  capoSelect.appendChild(noneOption);

  // Add capo positions with their resulting keys
  Object.entries(capoPositions).forEach(([position, resultingKey]) => {
    const option = document.createElement('option');
    option.value = position;
    option.textContent = `${position} (${resultingKey})`;
    capoSelect.appendChild(option);
  });
}

const updatePDF = async (key, capo) => {
  const chordProText = editor.getValue();
  const configText = configEditor.getValue();
  if (!chordProText.trim() || !configText.trim()) {
    return;
  }

  let configJson;
  try {
    configJson = JSON.parse(configText);
  } catch (e) {
    console.error('Invalid JSON in config editor:', e);
    return;
  }

  try {
    let song = new ChordProParser().parse(chordProText, { softLineBreaks: true });

    // If this is the first load or selectors haven't been initialized
    if (!keySelect.options.length) {
      initializeKeyAndCapoSelectors(song.key);
    }

    // Use either the provided key/capo or the current selector values
    const initialKey = key || keySelect.value;
    const capoPosition = capo || capoSelect.value;

    // Set the key first
    song = song.changeKey(initialKey);

    // Apply capo if it's not 'none'
    if (capoPosition !== 'none') {
      song = song.setCapo(parseInt(capoPosition));
    }

    const formatter = new PdfFormatter();
    const configuration = {
      key: initialKey,
      normalizeChords: true,
      useUnicodeModifiers: false,
    };
    formatter.format(song, configuration, configJson);
    const pdfBlob = await formatter.generatePDF();
    renderPDFInBrowser(pdfBlob);
  } catch (e) {
    console.error('Error generating PDF:', e);
  }
};

// Function to load ChordPro example
function loadChordproExample(index) {
  const example = chordproExamples[index];
  editor.setValue(example.content);
  updatePDF();
}

// Function to load config example
function loadConfigExample(index) {
  const example = configExamples[index];
  const configString = JSON.stringify(example.content, null, 4);
  configEditor.setValue(configString);
  updatePDF();
}

// Event Listeners
keySelect.addEventListener('change', (e) => {
  const newKey = e.target.value;
  // Reinitialize both selectors for the new key
  initializeKeyAndCapoSelectors(newKey);
  updatePDF(newKey, capoSelect.value);
});

capoSelect.addEventListener('change', (e) => {
  updatePDF(keySelect.value, e.target.value);
});


chordproSelect.addEventListener('change', () => {
  loadChordproExample(chordproSelect.value);
});

configSelect.addEventListener('change', () => {
  loadConfigExample(configSelect.value);
});

editor.on('change', () => {
  updatePDF();
});

configEditor.on('change', () => {
  updatePDF();
});

// Initialize the application
function initialize() {
  // Set default selections
  chordproSelect.value = 0;
  configSelect.value = 0;

  // Initial loading of examples
  loadChordproExample(chordproSelect.value);
  loadConfigExample(configSelect.value);
}

document.addEventListener('DOMContentLoaded', initialize);
