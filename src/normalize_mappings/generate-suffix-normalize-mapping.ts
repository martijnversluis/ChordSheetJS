// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

console.warn('\x1b[34m', '👷 Building suffix normalize mapping from suffix-mapping.txt');
fs.readFile('src/normalize_mappings/suffix-mapping.txt', (err: Error | null, data: Buffer): void => {
  if (err) throw err;

  const suffixes = data
    .toString()
    .split('\n')
    .map((line) => {
      const variants = line.split(/,\s*/);
      return variants.reduce((acc, variant) => ({ ...acc, [variant]: variants[0] }), {});
    })
    .reduce((acc, set) => ({ ...acc, ...set }), {});

  const suffixMappingJson = JSON.stringify(suffixes, null, 2);
  const suffixMappingJs = `const mapping: Record<string, string> = ${suffixMappingJson};\n\nexport default mapping;`;

  fs.writeFile(
    'src/normalize_mappings/suffix-normalize-mapping.ts',
    suffixMappingJs,
    'utf-8',
    (error: Error | null) => {
      if (error) throw error;
      console.warn('\x1b[32m', '✨ Successfully built suffix-normalize-mapping.ts');
    },
  );
});
