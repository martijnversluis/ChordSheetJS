import { ChordProParser, TextFormatter } from '../../src';

describe('useAccidental with a song key (regression for #2143)', () => {
  it(
    'keeps a chord written with a sharp as sharp after useAccidental("#"), ' +
    'even when the song key would map it to a flat',
    () => {
      const source = [
        '{key:Bm}',
        '',
        '[Em] before I [D#aug]let you take the [Em]throne',
      ].join('\n');

      const song = new ChordProParser().parse(source).useAccidental('#');
      const output = new TextFormatter().format(song);

      expect(output).toEqual([
        'Em          D#+              Em',
        '   before I let you take the throne',
      ].join('\n'));
    },
  );
});
