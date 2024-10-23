import { EOL } from 'os';
import { BuildOptions } from 'esbuild';

export default function buildChordSuffixGrammar(_: BuildOptions, data: string): string {
  const suffixes: string[] = data
    .split(EOL)
    .filter((s) => s.trim().length > 0)
    .flatMap((line) => line.split(/,\s*/))
    .sort((a, b) => b.length - a.length)
    .map((suffix) => `"${suffix}"`);

  const groups: string[][] = [];

  const copy = [...suffixes];

  while (copy.length > 0) {
    const chunk = copy.splice(0, 100) as string[];
    groups.push(chunk);
  }

  const groupsGrammar = groups.map((groupSuffixes, i) => (
    `ChordSuffix${i}\n  = ${groupSuffixes.join('\n  / ')}\n`
  ));

  return `
ChordSuffix
  = (${groupsGrammar.map((_grammar, i) => `ChordSuffix${i}`).join(' / ')})?

${groupsGrammar.join('\n')}
`;
}
