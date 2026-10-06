import ChordProParser from '../../src/parser/chord_pro_parser';
import TerminalFormatter from '../../src/formatter/terminal_formatter';

const song = new ChordProParser().parse('{sov: V}\n[C]hello\n{eov}\n\n{sov: V}\n[G]world\n{eov}');

describe('terminal configuration normalization', () => {
  it('exposes only canonical defaults', () => {
    const config = new TerminalFormatter().configuration;
    expect(config.layout.global.margins.left).toBe(0);
    expect(config.layout.sections.base.display.repeatedSections).toBe('full');
    expect(config).not.toHaveProperty('margins');
    expect(config).not.toHaveProperty('fonts');
  });
  it('normalizes aliases before merging and gives nested leaves precedence', () => {
    const formatter = new TerminalFormatter({
      margins: { left: 3, right: 2 },
      layout: { global: { margins: { left: 1 } } },
    });
    expect(formatter.configuration.layout.global.margins).toEqual({
      left: 1,
      right: 2,
      top: 0,
      bottom: 0,
    });
    formatter.configure({ uppercaseLabels: true }).configure({ uppercaseLabels: false, paragraphSpacing: 0 });
    expect(formatter.configuration.layout.sections.base.display.labelStyle).toBeUndefined();
    expect(formatter.configuration.layout.sections.global.paragraphSpacing).toBe(0);
  });
  it.each([
    ['preserve', 'full'],
    ['hide', 'hide'],
    ['title-only', 'title_only'],
    ['lyrics-only', 'lyrics_only'],
  ] as const)('maps %s to %s without changing output', (legacy, canonical) => {
    expect(new TerminalFormatter({ repeatedSections: legacy }).format(song)).toEqual(
      new TerminalFormatter({
        layout: { sections: { base: { display: { repeatedSections: canonical } } } },
      }).format(song),
    );
  });
  it('keeps per-call overrides and caller inputs isolated', () => {
    const input = { layout: { global: { margins: { left: 2 } } } };
    const formatter = new TerminalFormatter(input);
    const before = formatter.format(song);
    formatter.format(song, { margins: { left: 4 }, height: 10 });
    expect(formatter.format(song)).toEqual(before);
    expect(input.layout.global.margins).toEqual({ left: 2 });
    expect(new TerminalFormatter().configuration.layout.global.margins.left).toBe(0);
  });
  it('equates legacy geometry and blocks with canonical inputs across responsive widths', () => {
    const legacy = new TerminalFormatter({
      height: 12,
      margins: { left: 2, right: 2 },
      minColumnWidth: 12,
      maxColumnWidth: 24,
      columnSpacing: 2,
      pageSpacing: 3,
      header: { height: 1, text: '{page}/{pages}' },
      footer: { height: 1, text: 'end' },
      chordSpacing: 2,
      chordLyricSpacing: 1,
      linePadding: 1,
      paragraphSpacing: 0,
    });
    const canonical = new TerminalFormatter({
      height: 12,
      layout: {
        global: { margins: { left: 2, right: 2 }, pageSpacing: 3 },
        header: { height: 1, text: '{page}/{pages}' },
        footer: { height: 1, text: 'end' },
        sections: {
          global: {
            minColumnWidth: 12,
            maxColumnWidth: 24,
            columnSpacing: 2,
            chordSpacing: 2,
            chordLyricSpacing: 1,
            linePadding: 1,
            paragraphSpacing: 0,
          },
        },
      },
    });
    [32, 54, 80].forEach((width) => {
      expect(legacy.format(song, { width })).toEqual(canonical.format(song, { width }));
    });
    canonical.configure({ header: { text: 'changed' } });
    expect(canonical.configuration.layout.header).toEqual({ height: 1, text: 'changed' });
    canonical.configure({ header: undefined });
    expect(canonical.configuration.layout.header).toBeUndefined();
  });
});
