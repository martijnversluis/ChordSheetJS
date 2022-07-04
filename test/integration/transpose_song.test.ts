import { ChordProFormatter, ChordProParser } from '../../src';

describe('transposing a song', () => {
  it('transposes with a delta', () => {
    const chordpro = `
{key: C}
Let it [Am]be, let it [C/G]be, let it [Fsus2]be, let it [C]be`.substring(1);

    const changedSheet = `
{key: D}
Let it [Bm]be, let it [D/A]be, let it [Gsus2]be, let it [D]be`.substring(1);

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.transpose(2);

    expect(updatedSong.key).toEqual('D');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('normalizes chords on transpose with a delta when enabled', () => {
    const chordpro = `
{key: C}
Let it [Am]be, let it [C/G]be, let it [Fsus2]be, let it [C]be`.substring(1);

    const changedSheet = `
{key: D}
Let it [Bm]be, let it [D/A]be, let it [G2]be, let it [D]be`.substring(1);

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.transpose(2, { normalizeChordSuffix: true });

    expect(updatedSong.key).toEqual('D');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('transposes up', () => {
    const chordpro = `
{key: C}
Let it [Am]be, let it [C/G]be, let it [Fsus2]be, let it [C]be`.substring(1);

    const changedSheet = `
{key: C#}
Let it [A#m]be, let it [C#/G#]be, let it [F#sus2]be, let it [C#]be`.substring(1);

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.transposeUp();

    expect(updatedSong.key).toEqual('C#');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('normalizes chords on transpose up when enabled', () => {
    const chordpro = `
{key: C}
Let it [Am]be, let it [C/G]be, let it [Fsus2]be, let it [C]be`.substring(1);

    const changedSheet = `
{key: C#}
Let it [A#m]be, let it [C#/G#]be, let it [F#2]be, let it [C#]be`.substring(1);

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.transposeUp({ normalizeChordSuffix: true });

    expect(updatedSong.key).toEqual('C#');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('transposes down', () => {
    const chordpro = `
{key: D}
Let it [Bm]be, let it [D/A]be, let it [Gsus2]be, let it [D]be`.substring(1);

    const changedSheet = `
{key: Db}
Let it [Bbm]be, let it [Db/Ab]be, let it [Gbsus2]be, let it [Db]be`.substring(1);

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.transposeDown();

    expect(updatedSong.key).toEqual('Db');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('normalizes on transpose up when enabled', () => {
    const chordpro = `
{key: D}
Let it [Bm]be, let it [D/A]be, let it [Gsus2]be, let it [D]be`.substring(1);

    const changedSheet = `
{key: Db}
Let it [Bbm]be, let it [Db/Ab]be, let it [Gb2]be, let it [Db]be`.substring(1);

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.transposeDown({ normalizeChordSuffix: true });

    expect(updatedSong.key).toEqual('Db');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });
});
