import { ChordProFormatter, ChordProParser } from '../../src';

describe('setting the key of an existing song', () => {
  it('updates the key directive', () => {
    const chordpro = `
{key: C}
Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`.substring(1);

    const changedSheet = `
{key: D}
Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`.substring(1);

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.setKey('D');

    expect(updatedSong.key).toEqual('D');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('adds the key directive', () => {
    const chordpro = `
Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`.substring(1);

    const changedSheet = `
{key: D}
Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`.substring(1);

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.setKey('D');

    expect(updatedSong.key).toEqual('D');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('removes the key directive when passing null', () => {
    const chordpro = `
{key: C}
Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`.substring(1);

    const changedSheet = `
Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`.substring(1);

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.setKey(null);

    expect(updatedSong.key).toEqual(undefined);
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });
});
