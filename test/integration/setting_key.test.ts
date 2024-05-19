import { ChordProFormatter, ChordProParser } from '../../src';
import { heredoc } from '../utilities';

describe('setting the key of an existing song', () => {
  it('updates the key directive', () => {
    const chordpro = heredoc`
      {key: C}
      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`;

    const changedSheet = heredoc`
      {key: D}
      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`;

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.setKey('D');

    expect(updatedSong.key).toEqual('D');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('adds the key directive', () => {
    const chordpro = heredoc`
      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`;

    const changedSheet = heredoc`
      {key: D}
      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`;

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.setKey('D');

    expect(updatedSong.key).toEqual('D');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('removes the key directive when passing null', () => {
    const chordpro = heredoc`
      {key: C}
      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`;

    const changedSheet = heredoc`
      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`;

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.setKey(null);

    expect(updatedSong.key).toBeNull();
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });
});
