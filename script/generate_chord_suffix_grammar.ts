#!/usr/bin/env node
import fs from 'fs';
import { EOL } from 'os';

const suffixMappingFile = 'src/normalize_mappings/suffix-mapping.txt';
const chordSuffixGrammarFile = 'src/parser/chord/suffix_grammar.pegjs';

console.warn('\x1b[34m', '👷 Building suffix normalize mapping from suffix-mapping.txt');
const data = fs.readFileSync(suffixMappingFile);

const suffixes: string[] = data
  .toString()
  .split(EOL)
  .filter((s) => s.trim().length > 0)
  .flatMap((line) => line.split(/,\s*/))
  .sort((a, b) => b.length - a.length)
  .map((suffix) => `"${suffix}"`);

const groups: string[][] = [];

// make a copy to avoid mutating original array
const copy = [...suffixes];

while (copy.length > 0) {
  const chunk = copy.splice(0, 100) as string[];
  groups.push(chunk);
}

const groupsGrammar = groups.map((groupSuffixes, i) => (
  `ChordSuffix${i}\n  = ${groupSuffixes.join('\n  / ')}\n`
));

const chordSuffixGrammar = `
ChordSuffix
  = (${groupsGrammar.map((_grammar, i) => `ChordSuffix${i}`).join(' / ')})?

${groupsGrammar.join('\n')}
`;

fs.writeFileSync(chordSuffixGrammarFile, chordSuffixGrammar, 'utf-8');
console.warn('\x1b[32m', `✨ Successfully built ${chordSuffixGrammarFile}`);
