import { heredoc } from '../util/utilities';
import { ChordProParser, TextFormatter } from '../../src';

describe('changing the song modifiers', () => {
  it('can change to #', () => {
    const chordpro = 'Let it [D#m]be let it [Gb]be';

    const changedSheet = heredoc`
             D#m        F#
      Let it be  let it be
    `;

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.useModifier('#');

    expect(new TextFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('can change to b', () => {
    const chordpro = 'Let it [D#m]be let it [Gb]be';

    const changedSheet = heredoc`
             Ebm        Gb
      Let it be  let it be
    `;

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.useModifier('b');

    expect(new TextFormatter().format(updatedSong)).toEqual(changedSheet);
  });
});
