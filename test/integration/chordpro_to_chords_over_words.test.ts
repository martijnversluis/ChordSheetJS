import fs from 'fs';

import { heredoc } from '../util/utilities';
import { normalizeLineEndings } from '../../src/utilities';
import { ChordProParser, ChordsOverWordsFormatter } from '../../src';

describe('chordpro to chords over words', () => {
  it('correctly parses and converts the song structure', () => {
    const chordpro = heredoc`
      {title: Honey In The Rock}

      {comment: Verse 1}
      [D] Praying[Dsus] for a miracle,[D] thirsty[Dsus]`;

    const expectedChordOverWords = heredoc`
      title: Honey In The Rock

      Verse 1
      D        Dsus               D        Dsus
        Praying     for a miracle,  thirsty`;

    const song = new ChordProParser().parse(chordpro);
    const actualChordsOverWords = new ChordsOverWordsFormatter().format(song);

    expect(actualChordsOverWords).toEqual(expectedChordOverWords);
  });

  test('correctly parses and converts a complicated chart', () => {
    const chordpro = fs.readFileSync('./test/fixtures/kingdom_chordpro.txt', 'utf8');

    const expectedChordOverWords = normalizeLineEndings(
      fs.readFileSync('./test/fixtures/kingdom_chords_over_words.txt', 'utf8'),
    );

    const song = new ChordProParser().parse(chordpro);
    const actualChordsOverWords = new ChordsOverWordsFormatter().format(song);

    expect(actualChordsOverWords).toEqual(expectedChordOverWords);
  });

  it('correctly respects the chord_style directive', () => {
    const chordpro = heredoc`{title: Honey In The Rock}
{key: D}
{chord_style: number}

{comment: Verse 1}
[D] Praying[Dsus] for a miracle,[D] thirsty[Dsus]
For the Living [Bm]Well, [A]only You can satisfy[G]`;

    const expectedChordOverWords = heredoc`title: Honey In The Rock
key: D
chord_style: number

Verse 1
1        1sus               1        1sus
  Praying     for a miracle,  thirsty
               6m    5                   4
For the Living Well, only You can satisfy
`;

    const song = new ChordProParser().parse(chordpro);
    const actualChordsOverWords = new ChordsOverWordsFormatter().format(song);

    expect(actualChordsOverWords).toEqual(expectedChordOverWords);
  });
});
