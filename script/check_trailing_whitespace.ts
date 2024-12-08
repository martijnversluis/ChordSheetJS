import { EOL } from 'node:os';
import fs from 'node:fs';

const filesWithTrailingWhitespace: Record<string, number[]> = {};

const files =
  fs
    .readFileSync(0, 'utf8')
    .split(EOL)
    .filter((f) => f.length > 0);

console.log(`Check ${files.length} files for trailing whitespace`);

files.forEach((filename) => {
  const contents = fs.readFileSync(filename, 'utf8');
  const lines = contents.split(EOL);

  lines.forEach((line, index) => {
    if (line.endsWith(' ')) {
      if (!(filename in filesWithTrailingWhitespace)) {
        filesWithTrailingWhitespace[filename] = [];
      }

      filesWithTrailingWhitespace[filename].push(index + 1);
    }
  });
});

const fileNamesWithTrailingWhitespace = Object.keys(filesWithTrailingWhitespace);
const fileCount = fileNamesWithTrailingWhitespace.length;

if (fileCount === 0) {
  console.log('No files with trailing whitespace');
  process.exit(0);
}

const errorMessage =
  fileNamesWithTrailingWhitespace
    .map((filename) => {
      const specification =
        filesWithTrailingWhitespace[filename]
          .map((lineNumber) => `    ${filename}:${lineNumber}`)
          .join(EOL);

      return `  ${filename}:${EOL}${specification}`;
    })
    .join(EOL);

console.error(`Found ${fileCount} files with trailing whitespace:${EOL}${errorMessage}`);
process.exit(1);
