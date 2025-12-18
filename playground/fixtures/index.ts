// Import fixture configs for each formatter
import measuredHtmlConfigs from './configs/measured-html-formatter-configs';
import { pdfFormatterConfigs } from './configs/pdf-formatter-configs';
// import { chordProFormatterConfigs } from './configs/chordpro-formatter-configs';
// import { chordsOverWordsFormatterConfigs } from './configs/chords-over-words-formatter-configs';
// import { htmlFormatterConfigs } from './configs/html-formatter-configs';

// Import default configurations from the library
import {
  getDefaultConfig,
  getHTMLDefaultConfig,
  getPDFDefaultConfig,
} from '../../src/formatter/configuration';

// Define base config for all formatters
const baseConfig = getDefaultConfig('base');

// Create default configs for each formatter
const formatterDefaultConfigs = {
  'PDF': getPDFDefaultConfig(),
  'ChordPro': getDefaultConfig('base'),
  'ChordsOverWords': getDefaultConfig('base'),
  'HTML': getHTMLDefaultConfig(),
};

// Prepare array of config examples for each formatter
// Make sure default config is always first in the array
const formatterConfigExamples = {
  'PDF': [
    ...pdfFormatterConfigs,
    { name: 'Default Configuration', content: formatterDefaultConfigs.PDF },
  ],
  'ChordPro': [
    { name: 'Default Configuration', content: formatterDefaultConfigs.ChordPro },
    // ...chordProFormatterConfigs
  ],
  'ChordsOverWords': [
    { name: 'Default Configuration', content: formatterDefaultConfigs.ChordsOverWords },
    // ...chordsOverWordsFormatterConfigs
  ],
  'HTML': [
    { name: 'Default Configuration', content: formatterDefaultConfigs.HTML },
    // ...htmlFormatterConfigs
  ],
  'MeasuredHTML': [
    ...measuredHtmlConfigs,
    { name: 'Default Configuration', content: baseConfig },
  ],
};

// Example song data for testing
const exampleSongs = {
  simple: `{title: Simple Song}
{key: C}

[C]This is a [G]simple [Am]song
[F]Just to [C]test the [G]parser`,

  complex: `{title: Complex Song}
{subtitle: With many features}
{artist: Test Artist}
{key: G}
{capo: 2}
{tempo: 120}

{soc: Intro}
[G][D][Em][C]
{eoc}

{sov: Verse 1}
[G]This is a more [D]complex song
With [Em]multiple sections and [C]features
{eov}

{soc: Chorus}
[G]This is the [D]chorus
With [Em]different [C]chords
{eoc}

{sob: Bridge}
[Am]This is a [D]bridge section
With [Bm]even more [E]chord variety
{eob}`,
};

// Export everything
export {
  formatterDefaultConfigs,
  formatterConfigExamples,
  exampleSongs,
};
