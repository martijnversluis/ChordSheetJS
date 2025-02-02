import peggy from 'peggy';
import process from 'process';
import tspegjs from 'ts-pegjs';

import unibuild, { Asset, Builder } from '@martijnversluis/unibuild';
import packageJSON from './package.json';

import buildChordSuffixNormalizeMapping from './script/build_chord_suffix_normalize_mapping';
import buildChordSuffixGrammar from './script/build_chord_suffix_grammar';
import buildScales from './script/build_scales';
import buildChordProSectionGrammar from './script/build_chord_pro_section_grammar';

const {
  main, types, bundle,
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

unibuild((u: Builder) => {
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

  const jsBuild = u.asset('sources', {
    input: codeGeneratedAssets,
    outfile: main,
    command: 'parcel build --no-cache',
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
    command: `tsc ${types}`,
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

  // ci = install, build, lint, test, buildRelease
  // release = build, lint, test, buildRelease, publish
});
