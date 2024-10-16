import { EOL } from 'os';
import { BuildOptions } from 'esbuild';

export default function buildChordSuffixNormalizeMapping(_: BuildOptions, data: string): string {
  const suffixes = data
    .split(EOL)
    .map((line) => {
      const variants = line.split(/,\s*/);
      return variants.reduce((acc, variant) => ({ ...acc, [variant]: variants[0] }), {});
    })
    .reduce((acc, set) => ({ ...acc, ...set }), {});

  const json = JSON.stringify(suffixes, null, 2);
  return `const mapping: Record<string, string> = ${json};${EOL}${EOL}export default mapping;`;
}
