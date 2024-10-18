import { ChordProParser, PdfFormatter } from '../../../lib';

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
  const blobUrl = URL.createObjectURL(pdfBlob); // Create a URL representing the Blob object
  iframe.src = blobUrl; // Use the Blob URL as the source for the iframe
  pdfContainer.appendChild(iframe);
};

// Function to update the PDF based on the editor content
const updatePDF = async () => {
  const chordProText = editor.getValue();
  const configText = configEditor.getValue();
  if (!chordProText.trim() || !configText.trim()) {
    // Wait until both editors have content
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
    const song = new ChordProParser().parse(chordProText, { softLineBreaks: true });
    const formatter = new PdfFormatter();
    formatter.format(song, configJson);
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

// Listen for selection changes
chordproSelect.addEventListener('change', () => {
  loadChordproExample(chordproSelect.value);
});

configSelect.addEventListener('change', () => {
  loadConfigExample(configSelect.value);
});

// Listen for changes in the editors
editor.on('change', () => {
  updatePDF();
});

configEditor.on('change', () => {
  updatePDF();
});

// Set default selections
chordproSelect.value = 0;
configSelect.value = 0;

// Initial loading of examples
loadChordproExample(chordproSelect.value);
loadConfigExample(configSelect.value);
