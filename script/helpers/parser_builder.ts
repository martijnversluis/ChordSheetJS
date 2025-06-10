import fs from 'fs';

import esbuild from 'esbuild';

class ParserBuilder {
  parserName: string;

  chordDefinitionGrammarFile = './src/parser/chord_definition/grammar.pegjs';

  chordGrammarFile = './src/parser/chord/base_grammar.pegjs';

  chordSuffixGrammarFile = './src/parser/chord/suffix_grammar.pegjs';

  chordSimpleSuffixGrammarFile = './src/parser/chord/simple_suffix_grammar.pegjs';

  sectionsGrammarFile = './src/parser/chord_pro/sections_grammar.pegjs';

  whitespaceGrammarFile = './src/parser/whitespace_grammar.pegjs';

  constructor(parserName: string) {
    this.parserName = parserName;
  }

  build(): string { return this.parserSource; }

  get parserSource(): string {
    return [
      this.transpiledHelpers,
      ...this.grammars,
    ].join('\n\n');
  }

  get grammars(): (string | Buffer)[] {
    switch (this.parserName) {
      case 'chord':
        return [this.chordGrammar, this.chordSimpleSuffixGrammar];
      case 'chord_pro':
        return [this.parserGrammar, this.chordDefinitionGrammar, this.sectionsGrammar, this.whitespaceGrammar];
      case 'chords_over_words':
        return [this.parserGrammar, this.chordGrammar, this.chordSuffixGrammar, this.whitespaceGrammar];
      default:
        throw new Error(`No configuration for parser ${this.parserName}`);
    }
  }

  get parserFolder(): string { return `./src/parser/${this.parserName}`; }

  get grammarFile(): string { return `${this.parserFolder}/grammar.pegjs`; }

  get helpersFile(): string { return `${this.parserFolder}/helpers.ts`; }

  get parserGrammar(): string | Buffer {
    return fs.readFileSync(this.grammarFile, 'utf8');
  }

  get chordSuffixGrammar(): string | Buffer {
    return fs.readFileSync(this.chordSuffixGrammarFile);
  }

  get chordSimpleSuffixGrammar(): string | Buffer {
    return fs.readFileSync(this.chordSimpleSuffixGrammarFile);
  }

  get whitespaceGrammar(): string | Buffer {
    return fs.readFileSync(this.whitespaceGrammarFile);
  }

  get chordDefinitionGrammar(): string | Buffer {
    return fs.readFileSync(this.chordDefinitionGrammarFile);
  }

  get sectionsGrammar(): string | Buffer {
    return fs.readFileSync(this.sectionsGrammarFile);
  }

  get chordGrammar(): string | Buffer {
    return fs.readFileSync(this.chordGrammarFile);
  }

  get transpiledHelpers(): string {
    if (!fs.existsSync(this.helpersFile)) {
      return '';
    }

    const result = esbuild.buildSync({
      bundle: true,
      entryPoints: [this.helpersFile],
      globalName: 'helpers',
      write: false,
    });

    return `{\n${result.outputFiles[0].text}\n}`;
  }
}

export default ParserBuilder;
