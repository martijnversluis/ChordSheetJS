import { heredoc } from '../utilities';
import { ChordProFormatter, ChordProParser } from '../../src';

describe('changing the capo of an existing song (symbol chords)', () => {
  it('updates the capo directive', () => {
    const chordpro = heredoc`
      {capo: 7}
      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`;

    const changedSheet = heredoc`
      {capo: 3}
      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`;

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.setCapo(3);

    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('adds the capo directive', () => {
    const chordpro = heredoc`
      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`;

    const changedSheet = heredoc`
      {capo: 3}
      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`;

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.setCapo(3);

    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('adds the capo directive after the key directive', () => {
    const chordpro = heredoc`
      {key: C}
      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`;

    const changedSheet = heredoc`
      {key: C}
      {capo: 3}
      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`;

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.setCapo(3);

    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('removes the capo directive', () => {
    const chordpro = heredoc`
      {key: C}
      {capo: 3}
      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`;

    const changedSheet = heredoc`
      {key: C}
      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`;

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.setCapo(null);

    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });
});

describe('changing the capo of an existing song (solfege chords)', () => {
  it('updates the capo directive', () => {
    const chordpro = `
{capo: 7}
Let it [Lam]be, let it [Do/Sol]be, let it [Fa]be, let it [Do]be`.substring(1);

    const changedSheet = `
{capo: 3}
Let it [Lam]be, let it [Do/Sol]be, let it [Fa]be, let it [Do]be`.substring(1);

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.setCapo(3);

    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('adds the capo directive', () => {
    const chordpro = `
Let it [Lam]be, let it [Do/Sol]be, let it [Fa]be, let it [Do]be`.substring(1);

    const changedSheet = `
{capo: 3}
Let it [Lam]be, let it [Do/Sol]be, let it [Fa]be, let it [Do]be`.substring(1);

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.setCapo(3);

    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('adds the capo directive after the key directive', () => {
    const chordpro = `
{key: Do}
Let it [Lam]be, let it [Do/Sol]be, let it [Fa]be, let it [Do]be`.substring(1);

    const changedSheet = `
{key: Do}
{capo: 3}
Let it [Lam]be, let it [Do/Sol]be, let it [Fa]be, let it [Do]be`.substring(1);

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.setCapo(3);

    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('removes the capo directive', () => {
    const chordpro = `
{key: Do}
{capo: 3}
Let it [Lam]be, let it [Do/Sol]be, let it [Fa]be, let it [Do]be`.substring(1);

    const changedSheet = `
{key: Do}
Let it [Lam]be, let it [Do/Sol]be, let it [Fa]be, let it [Do]be`.substring(1);

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.setCapo(null);

    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });
});
