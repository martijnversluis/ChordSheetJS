#!/usr/bin/env node

import peggy from 'peggy';
import tspegjs from 'ts-pegjs';
import fs from 'fs';

const parserName = process.argv[2];
const args = process.argv.slice(3);
const skipChordGrammar = args.includes('--skip-chord-grammar');

const parserFolder = `./src/parser/${parserName}`;
const grammarFile = `${parserFolder}/grammar.pegjs`;
const outputFile = `${parserFolder}/peg_parser.ts`;
const chordGrammarFile = './src/parser/chord/base_grammar.pegjs';
const chordSuffixGrammarFile = './src/parser/chord/suffix_grammar.pegjs';
const headerFile = `${parserFolder}/header.ts`;

const parserGrammar = fs.readFileSync(grammarFile, 'utf8');
const chordGrammar = skipChordGrammar ? '' : fs.readFileSync(chordGrammarFile);
const chordSuffixGrammar = fs.readFileSync(chordSuffixGrammarFile);

const customHeader = fs.readFileSync(headerFile);
const input = [`{{${customHeader}}}`, parserGrammar, chordGrammar, chordSuffixGrammar].join('\n\n');

const source = peggy.generate(input, {
  plugins: [tspegjs],
  grammarSource: grammarFile,
  output: 'source',
  format: 'commonjs',
});

fs.writeFileSync(outputFile, `import { chopFirstWord } from '../parser_helpers';\n\n${source}`);
