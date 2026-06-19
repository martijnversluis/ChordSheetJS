import { ChordProParser, TextFormatter } from '../../src';

describe('useAccidental with a song key (regression for #2143)', () => {
  it(
    'keeps a chord written with a sharp as sharp after useAccidental("#"), ' +
    'even when the song key would map it to a flat',
    () => {
      const source = '{key: Bm}\n[Em] before I [D#aug]let you take the [Em]throne';

      const song = new ChordProParser().parse(source).useAccidental('#');
      const output = new TextFormatter().format(song).trim();

      expect(output).toContain('D#+');
      expect(output).not.toContain('Eb+');
    },
  );
});
