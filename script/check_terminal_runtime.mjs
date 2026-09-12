import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

function check(TerminalFormatter, TerminalMeasurer, ChordProParser) {
  const song = new ChordProParser().parse('é👩‍💻界');
  const document = new TerminalFormatter({ width: 2 }).format(song);
  assert.deepEqual(
    document.rows.map((row) => row.spans[0].text),
    ['é', '👩‍💻', '界'],
  );
  assert.equal(new TerminalMeasurer().measureText('👩‍💻').width, 2);
  const paged = new TerminalFormatter({
    width: 7,
    height: 2,
    layout: { sections: { global: { columnCount: 2, columnSpacing: 1 } } },
  }).format(new ChordProParser().parse('a\nb\nc\nd\ne'));
  assert.equal(paged.pages.length, 2);
  assert.equal(paged.pages[0].rows[0].spans[1].column, 2);
  assert.equal(paged.pages[1].rows[0].spans[0].text, 'e');
  assert.equal(JSON.parse(JSON.stringify(paged)).height, 5);
}

if (process.argv.includes('--source')) {
  // Import the formatter first: importing the public barrel first masks initialization cycles.
  const { default: TerminalFormatter } = await import('../src/formatter/terminal_formatter.ts');
  const { TerminalMeasurer } = await import('../src/layout/measurement/terminal_measurer.ts');
  const { default: ChordProParser } = await import('../src/parser/chord_pro_parser.ts');
  check(TerminalFormatter, TerminalMeasurer, ChordProParser);
} else {
  const esm = await import('../lib/module.js');
  check(esm.TerminalFormatter, esm.TerminalMeasurer, esm.ChordProParser);
  check(esm.default.TerminalFormatter, esm.default.TerminalMeasurer, esm.default.ChordProParser);
  const cjs = createRequire(import.meta.url)('../lib/index.js');
  check(cjs.TerminalFormatter, cjs.TerminalMeasurer, cjs.ChordProParser);
  check(cjs.default.TerminalFormatter, cjs.default.TerminalMeasurer, cjs.default.ChordProParser);
}
process.stdout.write('Terminal runtime construction and Unicode formatting passed\n');
