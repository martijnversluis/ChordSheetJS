import { ChordProFormatter, ChordProParser } from '../../src';

describe('changing the key of an existing song', () => {
  it('updates the key directive', () => {
    const chordpro = `
{key: C}
Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`.substring(1);

    const changedSheet = `
{key: D}
Let it [Bm]be, let it [D/A]be, let it [G]be, let it [D]be`.substring(1);

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.changeKey('D');

    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('does not fail when the original song key is not set', () => {
    const chordSheet = `
Let it [Bm]be, let it [D/A]be, let it [G]be, let it [D]be`.substring(1);

    const song = new ChordProParser().parse(chordSheet);

    expect(() => song.changeKey('B')).toThrow(/Cannot change song key, the original key is unknown/);
  });

  it('supports programmatically setting the song key before changing key', () => {
    const chordSheet = `
Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`.substring(1);

    const changedSheet = `
{key: D}
Let it [Bm]be, let it [D/A]be, let it [G]be, let it [D]be`.substring(1);

    const song = new ChordProParser().parse(chordSheet);
    const updatedSong = song.changeMetadata('key', 'C').changeKey('D');

    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });
});
