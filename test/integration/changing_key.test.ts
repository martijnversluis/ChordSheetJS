import { heredoc } from '../util/utilities';
import { ChordProFormatter, ChordProParser, TextFormatter } from '../../src';

describe('changing the key of an existing song (symbol chords)', () => {
  it('updates the key directive and transposes the chords', () => {
    const chordpro = heredoc`
      {key: C}

      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`;

    const changedSheet = heredoc`
      {key: D}

      Let it [Bm]be, let it [D/A]be, let it [G]be, let it [D]be`;

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.changeKey('D');

    expect(updatedSong.key).toEqual('D');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('does not fail when the original song key is not set', () => {
    const chordSheet = heredoc`
      Let it [Bm]be, let it [D/A]be, let it [G]be, let it [D]be`;

    const song = new ChordProParser().parse(chordSheet);

    expect(() => song.changeKey('B')).toThrow(/Cannot change song key, the original key is unknown/);
  });

  it('supports programmatically setting the song key before changing key', () => {
    const chordSheet = heredoc`
      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`;

    const changedSheet = heredoc`
      {key: D}

      Let it [Bm]be, let it [D/A]be, let it [G]be, let it [D]be`;

    const song = new ChordProParser().parse(chordSheet);
    const updatedSong = song.setKey('C').changeKey('D');

    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('respects the accidental of the target key', () => {
    const chordProTestSong = '{key: E}\n\n[E]Let it be';
    const song = new ChordProParser().parse(chordProTestSong);
    const transposedSong = song.changeKey('Bb');
    const output = new TextFormatter().format(transposedSong);

    expect(output).toEqual('Bb\nLet it be');
  });
});

describe('changing the key of an existing song (solfege chords)', () => {
  it('updates the key directive and transposes the chords', () => {
    const chordpro = `
{key: Do}

Let it [Lam]be, let it [Do/Sol]be, let it [Fa]be, let it [Do]be`.substring(1);

    const changedSheet = `
{key: Re}

Let it [Sim]be, let it [Re/La]be, let it [Sol]be, let it [Re]be`.substring(1);

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.changeKey('Re');

    expect(updatedSong.key).toEqual('Re');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('does not fail when the original song key is not set', () => {
    const chordSheet = `
Let it [Sim]be, let it [Re/La]be, let it [Sol]be, let it [Re]be`.substring(1);

    const song = new ChordProParser().parse(chordSheet);

    expect(() => song.changeKey('Si')).toThrow(/Cannot change song key, the original key is unknown/);
  });

  it('supports programmatically setting the song key before changing key', () => {
    const chordSheet = `
Let it [Lam]be, let it [Do/Sol]be, let it [Fa]be, let it [Do]be`.substring(1);

    const changedSheet = `
{key: Re}

Let it [Sim]be, let it [Re/La]be, let it [Sol]be, let it [Re]be`.substring(1);

    const song = new ChordProParser().parse(chordSheet);
    const updatedSong = song.setKey('Do').changeKey('Re');

    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });
});
