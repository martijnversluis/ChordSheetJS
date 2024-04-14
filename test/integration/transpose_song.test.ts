import {
  ChordProFormatter, ChordProParser, ChordSheetParser, TextFormatter,
} from '../../src';
import { heredoc } from '../utilities';

describe('transposing a song', () => {
  it('transposes with a delta', () => {
    const chordpro = heredoc`
      {key: C}
      Let it [Am]be, let it [C/G]be, let it [Fsus2]be, let it [C]be`;

    const changedSheet = heredoc`
      {key: D}
      Let it [Bm]be, let it [D/A]be, let it [Gsus2]be, let it [D]be`;

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.transpose(2);

    expect(updatedSong.key).toEqual('D');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('normalizes chords on transpose with a delta when enabled', () => {
    const chordpro = heredoc`
      {key: C}
      Let it [Am]be, let it [C/G]be, let it [Fsus2]be, let it [C]be`;

    const changedSheet = heredoc`
      {key: D}
      Let it [Bm]be, let it [D/A]be, let it [G2]be, let it [D]be`;

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.transpose(2, { normalizeChordSuffix: true });

    expect(updatedSong.key).toEqual('D');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('transposes up', () => {
    const chordpro = heredoc`
      {key: C}
      Let it [Am]be, let it [C/G]be, let it [Fsus2]be, let it [C]be`;

    const changedSheet = heredoc`
      {key: C#}
      Let it [A#m]be, let it [C#/G#]be, let it [F#sus2]be, let it [C#]be`;

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.transposeUp();

    expect(updatedSong.key).toEqual('C#');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('normalizes chords on transpose up when enabled', () => {
    const chordpro = heredoc`
      {key: C}
      Let it [Am]be, let it [C/G]be, let it [Fsus2]be, let it [C]be`;

    const changedSheet = heredoc`
      {key: C#}
      Let it [A#m]be, let it [C#/G#]be, let it [F#2]be, let it [C#]be`;

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.transposeUp({ normalizeChordSuffix: true });

    expect(updatedSong.key).toEqual('C#');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('transposes down', () => {
    const chordpro = heredoc`
      {key: D}
      Let it [Bm]be, let it [D/A]be, let it [Gsus2]be, let it [D]be`;

    const changedSheet = heredoc`
      {key: Db}
      Let it [Bbm]be, let it [Db/Ab]be, let it [Gbsus2]be, let it [Db]be`;

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.transposeDown();

    expect(updatedSong.key).toEqual('Db');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('normalizes on transpose down when enabled', () => {
    const chordpro = heredoc`
      {key: D}
      Let it [Bm]be, let it [D/A]be, let it [Gsus2]be, let it [D]be`;

    const changedSheet = heredoc`
      {key: Db}
      Let it [Bbm]be, let it [Db/Ab]be, let it [Gb2]be, let it [Db]be`;

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.transposeDown({ normalizeChordSuffix: true });

    expect(updatedSong.key).toEqual('Db');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('may be transposed without a key', () => {
    const chordpro = heredoc`
             Am         C/G        F          C
      Let it be, let it be, let it be, let it be`;

    const changedSheet = heredoc`
             Bm         D/A        G          D
      Let it be, let it be, let it be, let it be`;

    const song = new ChordSheetParser().parse(chordpro);
    const updatedSong = song.transpose(2);

    expect(new TextFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  describe('key change', () => {
    const chordpro = heredoc`
      {key: B}
      [B]Something in the way she [Bmaj7]moves
      {key: G#}
      [G#]You're asking m[Cm/G]e will my love [Fm7]grow [G#/D#]`;

    const changedSheet = heredoc`
      {key: C}
      [C]Something in the way she [Cmaj7]moves
      {key: A}
      [A]You're asking m[C#m/G#]e will my love [F#m7]grow [A/E]`;

    it('normalizes when transposing', () => {
      const song = new ChordProParser().parse(chordpro);
      const updatedSong = song.transpose(1);

      expect(updatedSong.key).toEqual('C');
      expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
    });

    it('normalizes when setting key', () => {
      const song = new ChordProParser().parse(chordpro);
      const updatedSong = song.changeKey('C');

      expect(updatedSong.key).toEqual('C');
      expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
    });
  });
});
