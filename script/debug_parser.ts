// eslint no-console: "off"

import fs from 'fs';
import process from 'process';
import puppeteer from 'puppeteer';
import esbuild from 'esbuild';

const parserName = process.argv[2];
const args = process.argv.slice(3);
const skipChordGrammar = args.includes('--skip-chord-grammar');

const parserFolder = `./src/parser/${parserName}`;
const grammarFile = `${parserFolder}/grammar.pegjs`;
const helpersFile = `${parserFolder}/helpers.ts`;
const chordGrammarFile = './src/parser/chord/base_grammar.pegjs';
const chordSuffixGrammarFile = './src/parser/chord/suffix_grammar.pegjs';

const parserGrammar = fs.readFileSync(grammarFile, 'utf8');
const chordGrammar = skipChordGrammar ? '' : fs.readFileSync(chordGrammarFile);
const chordSuffixGrammar = fs.readFileSync(chordSuffixGrammarFile);

const result = esbuild.buildSync({
  bundle: true,
  entryPoints: [helpersFile],
  globalName: 'helpers',
  write: false,
});

const transpiledHelpers = result.outputFiles[0].text;

const parserSource = [
  `{\n${transpiledHelpers}\n}`,
  parserGrammar,
  chordGrammar,
  chordSuffixGrammar,
].join('\n\n');

async function run() {
  const browser = await puppeteer.launch({
    args: ['--start-maximized'],
    defaultViewport: null,
    headless: false,
  });

  async function shutdownHandler() {
    await browser.close();
  }

  ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach((event) => {
    process.on(event, shutdownHandler);
  });

  const [page] = await browser.pages();
  await page.setViewport({ width: 0, height: 0 });
  await page.goto('https://peggyjs.org/online.html');

  await page.evaluate((grammar) => {
    // eslint-disable-next-line no-undef
    const textarea = document.getElementById('grammar');
    if (!textarea) return;

    const editorNode = textarea.nextSibling;
    if (!editorNode) return;

    // @ts-expect-error There is no way to validate that the CodeMirror object is present
    const editor = editorNode.CodeMirror;
    editor.setValue(grammar);
  }, parserSource);

  while (true) {
    // Loop forever to allow for interactive debugging with the online Peggy parser
  }
}

run()
  .then(() => console.log('Done'))
  .catch((e) => console.error(e));
