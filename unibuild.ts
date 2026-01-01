import os from 'os';
import peggy from 'peggy';
import process from 'process';
import tspegjs from 'ts-pegjs';

import packageJSON from './package.json';
import unibuild, { Asset, Config } from '@martijnversluis/unibuild';

import buildChordProSectionGrammar from './script/build_chord_pro_section_grammar';
import buildChordSuffixGrammar from './script/build_chord_suffix_grammar';
import buildChordSuffixNormalizeMapping from './script/build_chord_suffix_normalize_mapping';
import buildScales from './script/build_scales';

const {
  main, types, bundle, version,
} = packageJSON;

interface BuildOptions {
  force: boolean;
  release: boolean;
}

function peggyGenerate(grammar: string, release: boolean): string {
  return peggy.generate(
    grammar,
    {
      output: 'source',
      format: 'commonjs',
      plugins: [tspegjs],
      trace: process.env.NODE_ENV === 'test' && !release,
    },
  );
}

export default unibuild((u: Config) => {
  const suffixNormalizeMapping = u.asset('suffixNormalizeMapping', {
    input: 'src/normalize_mappings/suffix-mapping.txt',
    outfile: 'src/normalize_mappings/suffix-normalize-mapping.ts',
    build: buildChordSuffixNormalizeMapping,
  });

  const chordSuffixGrammar = u.asset('chordSuffixGrammar', {
    input: 'src/normalize_mappings/suffix-mapping.txt',
    outfile: 'src/parser/chord/suffix_grammar.pegjs',
    build: buildChordSuffixGrammar,
  });

  const scales = u.asset('scales', {
    input: 'data/scales.ts',
    outfile: 'src/scales.ts',
    build: buildScales,
    command: ({ outfile }) => `yarn eslint ${outfile} --fix`,
  });

  const chordParser = u.asset('chordParser', {
    input: ['src/parser/chord/base_grammar.pegjs', 'src/parser/chord/simple_suffix_grammar.pegjs'],
    outfile: 'src/parser/chord/peg_parser.ts',
    build: ({ release }: BuildOptions, baseGrammar: string, suffixGrammar: string) => (
      peggyGenerate(`${baseGrammar}\n\n${suffixGrammar}`, release)
    ),
  });

  const sectionsGrammar = u.asset('sectionsGrammar', {
    input: 'data/sections.ts',
    outfile: 'src/parser/chord_pro/sections_grammar.pegjs',
    build: buildChordProSectionGrammar,
  });

  const chordProParser = u.asset('chordProParser', {
    input: [
      'src/parser/chord_pro/grammar.pegjs',
      'src/parser/chord_definition/grammar.pegjs',
      sectionsGrammar,
      'src/parser/whitespace_grammar.pegjs',
    ],
    outfile: 'src/parser/chord_pro/peg_parser.ts',
    build: ({ release }: BuildOptions, ...grammars: string[]) => {
      const parserSource = peggyGenerate(grammars.join('\n\n'), release);
      return `import * as helpers from './helpers';\n\n${parserSource}`;
    },
  });

  const chordDefinitionParser = u.asset('chordDefinitionParser', {
    input: [
      'src/parser/chord_definition/grammar.pegjs',
      'src/parser/whitespace_grammar.pegjs',
    ],
    outfile: 'src/parser/chord_definition/peg_parser.ts',
    build: ({ release }: BuildOptions, ...grammars: string[]) => (
      peggyGenerate(grammars.join('\n\n'), release)
    ),
  });

  const chordsOverWordsParser = u.asset('chordsOverWordsParser', {
    input: [
      'src/parser/chords_over_words/grammar.pegjs',
      'src/parser/chord/base_grammar.pegjs',
      chordSuffixGrammar,
      'src/parser/whitespace_grammar.pegjs',
    ],
    outfile: 'src/parser/chords_over_words/peg_parser.ts',
    build: ({ release }: BuildOptions, ...grammars: string[]) => {
      const grammar = grammars.join('\n\n');
      const parserSource = peggyGenerate(grammar, release);
      return `import * as helpers from './helpers';\n\n${parserSource}`;
    },
  });

  const codeGeneratedAssets: Asset[] = [
    suffixNormalizeMapping,
    scales,
    chordParser,
    chordProParser,
    chordsOverWordsParser,
    chordDefinitionParser,
  ];

  u.asset('versionFile', {
    input: 'package.json',
    outfile: 'src/version.ts',
    build: () => `export default '${version}';${os.EOL}`,
  });

  const jsBuild = u.asset('sources', {
    input: codeGeneratedAssets,
    outfile: main,
    command: 'rm -rf .parcel-cache && parcel build',
    releaseOnly: true,
  });

  u.asset('bundle', {
    input: jsBuild,
    outfile: bundle.default,
    command: ({ input, outfile }) => (
      `esbuild ${input[0]} --outfile=${outfile} --bundle --global-name=${bundle.globalName}`
    ),
    releaseOnly: true,
  });

  u.asset('minifiedBundle', {
    input: jsBuild,
    outfile: bundle.minified,
    command: ({ input, outfile }) => (
      `esbuild ${input[0]} --outfile=${outfile} --bundle --global-name=${bundle.globalName} ` +
      '--minify-whitespace --minify-identifiers --minify-syntax'
    ),
    releaseOnly: true,
  });

  u.lint('checkTypes', {
    requires: jsBuild,
    command: `tsc --skipLibCheck ${types}`,
  });

  u.lint('eslint', {
    requires: codeGeneratedAssets,
    command: 'yarn eslint .',
    autofixCommand: 'yarn eslint . --fix',
  });

  u.test('jest', {
    requires: codeGeneratedAssets,
    command: 'yarn jest',
  });
});
