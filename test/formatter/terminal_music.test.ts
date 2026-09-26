import ChordProParser from '../../src/parser/chord_pro_parser';
import Key from '../../src/key';
import TerminalFormatter from '../../src/formatter/terminal_formatter';

const parse = (text: string) => new ChordProParser().parse(text);
const chords = (document) => document.rows
  .flatMap((row) => row.spans)
  .filter((span) => span.kind === 'chord')
  .map((span) => span.text);

describe('TerminalFormatter musical policies', () => {
  it('measures target-key spelling once and preserves explicit modifiers', () => {
    const result = new TerminalFormatter({ key: Key.parse('Db'), useUnicodeModifiers: true }).format(
      parse('{key:C}\n[C]a [G]b'),
    );
    expect(chords(result)).toEqual(['D♭', 'A♭']);
    expect(result.rows[0].spans.map((span) => span.width)).toEqual([2, 2]);
  });
  it('preserves line-local transpose context through all positioned clones', () => {
    const song = parse('{key:C}\n{transpose:D}\n[C]a\n{new_key:G}\n[G]b');
    expect(chords(new TerminalFormatter({ normalizeChords: false }).format(song))).toEqual(['D', 'A']);
  });
  it('retains decapo sign and suffix normalization controls', () => {
    expect(chords(new TerminalFormatter({ decapo: true }).format(parse('{key:C}\n{capo:2}\n[C]a')))).toEqual([
      'Bb',
    ]);
    const song = parse('[Cmaj7]a');
    expect(chords(new TerminalFormatter({ normalizeChordSuffix: false }).format(song))).toEqual(['Cmaj7']);
    expect(chords(new TerminalFormatter().format(song))).toEqual(['Cma7']);
  });
  it.each([
    ['symbol', 'C'],
    ['solfege', 'Do'],
    ['numeral', 'I'],
    ['number', '1'],
  ])('supports song notation %s', (style, expected) => {
    expect(chords(new TerminalFormatter().format(parse(`{key:C}\n{chord_style:${style}}\n[C]a`)))).toEqual([
      expected,
    ]);
  });
  it('measures annotation text as a semantic upper row without parsing it as a chord', () => {
    const song = parse('[*Full band!]Let it be');
    const document = new TerminalFormatter().format(song);
    expect(document.rows[0].spans[0]).toMatchObject({
      text: 'Full band!',
      width: 10,
      kind: 'annotation',
      styleRole: 'annotation',
      tokenVariant: 'annotation',
    });
    expect(document.rows[1].spans[0]).toMatchObject({ text: 'Let it be', kind: 'lyrics' });
    expect(
      new TerminalFormatter({ layout: { sections: { base: { display: { lyricsOnly: true } } } } }).format(
        song,
      ).rows,
    ).toHaveLength(1);
  });
  it('expands chorus occurrences and lyrics-only rendering before pagination', () => {
    const song = parse('{soc: Chorus}\n[C]sing\n{eoc}\n\n{chorus}');
    const formatter = new TerminalFormatter({ expandChorusDirective: true, height: 3 });
    expect(chords(formatter.format(song))).toEqual(['C', 'C']);
    const result = formatter.format(song, {
      layout: { sections: { base: { display: { lyricsOnly: true, showLabel: false } } } },
    });
    expect(chords(result)).toEqual([]);
    expect(result.rows.flatMap((row) => row.spans).map((span) => span.text)).toEqual(['sing', 'sing']);
  });
});
