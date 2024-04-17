#!/usr/bin/env node

import peggy from 'peggy';
import tspegjs from 'ts-pegjs';
import fs from 'fs';

const parserName = process.argv[2];
const grammarFile = `./src/parser/${parserName}_grammar.pegjs`;
const outputFile = `./src/parser/${parserName}_peg_parser.ts`;
const chordGrammarFile = './src/parser/chord_grammar.pegjs';
const chordSuffixGrammarFile = './src/parser/chord_suffix_grammar.pegjs';
const headerFile = `./src/parser/${parserName}_header.ts`;

const parserGrammar = fs.readFileSync(grammarFile, 'utf8');
const chordGrammar = fs.readFileSync(chordGrammarFile);
const chordSuffixGrammar = fs.readFileSync(chordSuffixGrammarFile);

const customHeader = fs.readFileSync(headerFile);
const input = [`{{${customHeader}}}`, parserGrammar, chordGrammar, chordSuffixGrammar].join('\n\n');

const source = peggy.generate(input, {
  plugins: [tspegjs],
  grammarSource: `src/parser/${parserName}_grammar.pegjs`,
  output: 'source',
  format: 'commonjs',
});

fs.writeFileSync(outputFile, `import { chopFirstWord } from './parser_helpers';\n\n${source}`);
