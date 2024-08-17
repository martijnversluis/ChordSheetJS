#!/usr/bin/env node

import peggy from 'peggy';
import tspegjs from 'ts-pegjs';
import fs from 'fs';

const parserName = process.argv[2];
const args = process.argv.slice(3);
const skipChordGrammar = args.includes('--skip-chord-grammar');
const enableTracing = process.env.NODE_ENV === 'test';

console.warn('\x1b[34m', `👷 Building ${parserName} parser with${enableTracing ? '' : 'out'} tracing`);

const parserFolder = `./src/parser/${parserName}`;
const grammarFile = `${parserFolder}/grammar.pegjs`;
const outputFile = `${parserFolder}/peg_parser.ts`;
const chordGrammarFile = './src/parser/chord/base_grammar.pegjs';
const chordSuffixGrammarFile = './src/parser/chord/suffix_grammar.pegjs';

const parserGrammar = fs.readFileSync(grammarFile, 'utf8');
const chordGrammar = skipChordGrammar ? '' : fs.readFileSync(chordGrammarFile);
const chordSuffixGrammar = fs.readFileSync(chordSuffixGrammarFile);
const input = [parserGrammar, chordGrammar, chordSuffixGrammar].join('\n\n');

const source = peggy.generate(input, {
  plugins: [tspegjs],
  grammarSource: grammarFile,
  output: 'source',
  format: 'commonjs',
  trace: enableTracing,
});

fs.writeFileSync(outputFile, `import * as helpers from './helpers';\n\n${source}`);

console.warn('\x1b[32m', `✨ Successfully built ${parserName} parser at ${outputFile}`);
