import peggy from 'peggy';
import process from 'process';
import tspegjs from 'ts-pegjs';

import unibuild, { Builder } from '@martijnversluis/unibuild';

import buildChordSuffixNormalizeMapping from './script/build_chord_suffix_normalize_mapping';
import buildChordSuffixGrammar from './script/build_chord_suffix_grammar';
import buildScales from './script/build_scales';

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
  });

  u.asset('chordParser', {
    input: ['src/parser/chord/base_grammar.pegjs', chordSuffixGrammar],
    outfile: 'src/parser/chord/peg_parser.ts',
    build: (baseGrammar: string, suffixGrammar: string) => peggy.generate(
      [baseGrammar, suffixGrammar].join('\n\n'),
      {
        output: 'source',
        format: 'commonjs',
        plugins: [tspegjs],
        trace: process.env.NODE_ENV === 'test',
      },
    ),
  });

  u.asset('chordProParser', {
    input: ['src/parser/chord_pro/grammar.pegjs'],
    outfile: 'src/parser/chord_pro/peg_parser.ts',
    build: (baseGrammar: string) => {
      const parserSource = peggy.generate(
        baseGrammar,
        {
          output: 'source',
          format: 'commonjs',
          plugins: [tspegjs],
          trace: process.env.NODE_ENV === 'test',
        },
      );

      return `import * as helpers from './helpers';\n\n${parserSource}`;
    },
  });

  u.asset('chordsOverWordsParser', {
    input: [
      'src/parser/chords_over_words/grammar.pegjs',
      'src/parser/chord/base_grammar.pegjs',
      chordSuffixGrammar,
    ],
    outfile: 'src/parser/chords_over_words/peg_parser.ts',
    build: (...grammars: string[]) => {
      const grammar = grammars.join('\n\n');

      const parserSource = peggy.generate(grammar, {
        output: 'source',
        format: 'commonjs',
        plugins: [tspegjs],
        trace: process.env.NODE_ENV === 'test',
      });

      return `import * as helpers from './helpers';\n\n${parserSource}`;
    },
  });

  u.asset('sources', {
    input: [suffixNormalizeMapping, chordSuffixGrammar, scales],
    outfile: 'src/index.ts',
    command: 'parcel build',
    releaseOnly: true,
  });
});
