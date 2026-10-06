import ChordProFormatter from '../../src/formatter/chord_pro_formatter';
import ChordProParser from '../../src/parser/chord_pro_parser';
import TerminalFormatter from '../../src/formatter/terminal_formatter';

const parse = (text: string) => new ChordProParser().parse(text);

describe('TerminalFormatter', () => {
  it.each(['abcdef', 'é👩‍💻界é👩‍💻'])('wraps %s without inserting spaces', (lyrics) => {
    const document = new TerminalFormatter({ width: 2 }).format(parse(lyrics));
    const fragments = document.rows
      .flatMap((row) => row.spans)
      .filter((span) => span.kind === 'lyrics')
      .map((span) => span.text);
    expect(fragments.join('')).toBe(lyrics);
    expect(fragments).toEqual(lyrics === 'abcdef' ? ['ab', 'cd', 'ef'] : ['é', '👩‍💻', '界', 'é', '👩‍💻']);
  });
  it('preserves different bodies of sections with identical labels', () => {
    const song = parse('{sov: Verse}\nFirst body\n{eov}\n\n{sov: Verse}\nSecond body\n{eov}');
    const lyrics = new TerminalFormatter()
      .format(song)
      .rows.flatMap((row) => row.spans)
      .filter((span) => span.kind === 'lyrics')
      .map((span) => span.text);
    expect(lyrics).toEqual(['First body', 'Second body']);
  });
  it('places chords above lyrics at measured offsets', () => {
    const result = new TerminalFormatter().format(parse('[C]Hi [G]you'));
    expect(result.rows).toHaveLength(2);
    expect(result.rows[0].spans.map(({ x, text }) => [x, text])).toEqual([
      [0, 'C'],
      [3, 'G'],
    ]);
    expect(result.rows[1].spans.map(({ x, text }) => [x, text])).toEqual([
      [0, 'Hi '],
      [3, 'you'],
    ]);
  });
  it('reflows without changing the source and supports lyrics only', () => {
    const song = parse('[C]Hello [G]world');
    const before = new ChordProFormatter().format(song);
    const formatter = new TerminalFormatter({ width: 20 });
    expect(formatter.format(song).rows).toHaveLength(2);
    expect(formatter.configure({ width: 6 }).format(song).rows.length).toBeGreaterThan(2);
    expect(new ChordProFormatter().format(song)).toBe(before);
    expect(
      new TerminalFormatter({ layout: { sections: { base: { display: { lyricsOnly: true } } } } }).format(
        song,
      ).rows,
    ).toHaveLength(1);
  });
  it('handles empty input, comments and controls', () => {
    expect(new TerminalFormatter().format(parse('')).rows).toEqual([]);
    expect(new TerminalFormatter().format(parse('{comment: Quiet}')).rows[0].spans[0].kind).toBe('comment');
    expect(() => new TerminalFormatter({ width: 0 }).format(parse('[C]a'))).toThrow();
    expect(() => new TerminalFormatter().format(parse('[C]a\x1b[31m'))).toThrow();
  });
  it('supports labels, chord-only lines, paragraph spacing and ignored column breaks', () => {
    const formatter = new TerminalFormatter();
    expect(formatter.format(parse('[C]')).rows).toHaveLength(1);
    expect(
      formatter.format(parse('{start_of_verse: Verse}\n[C]a\n{end_of_verse}')).rows[0].spans[0],
    ).toMatchObject({ text: 'Verse', kind: 'section-label' });
    expect(formatter.format(parse('[C]a\n{column_break}\n[G]b')).rows).toHaveLength(4);
    expect(formatter.format(parse('[C]a\n\n[G]b')).rows).toHaveLength(5);
    expect(
      new TerminalFormatter({ layout: { sections: { global: { paragraphSpacing: 0 } } } }).format(
        parse('[C]a\n\n[G]b'),
      ).rows,
    ).toHaveLength(4);
  });
  it('reports indivisible overflow honestly and isolates defaults', () => {
    const document = new TerminalFormatter({ width: 1 }).format(parse('[Cmaj7]a'));
    expect(document.rows[0].spans[0].width).toBeGreaterThan(document.width);
    expect(new TerminalFormatter().configuration.width).toBe(80);
  });
  it('preserves semantic token classifications', () => {
    const { spans } = new TerminalFormatter().format(parse('[/] [x] [|] [(2x)] [N.C.]')).rows[0];
    expect(spans.map((span) => span.kind)).toEqual([
      'rhythm-symbol',
      'rhythm-symbol',
      'barline',
      'instruction',
      'no-chord',
    ]);
    expect(spans[1]).toMatchObject({ tokenVariant: 'mute', styleRole: 'noChord' });
    expect(spans[2]).toMatchObject({ tokenVariant: 'single', styleRole: 'rhythmSymbol' });
  });
});
