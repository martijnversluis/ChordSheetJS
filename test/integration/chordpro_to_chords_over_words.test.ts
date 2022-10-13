import { ChordProParser, ChordsOverWordsFormatter } from '../../src';

describe('chordpro to chords over words', () => {
  it('correctly parses and converts the song structure', () => {
    const chordpro = `
{title: Honey In The Rock}

{comment: Verse 1}
[D] Praying[Dsus] for a miracle,[D] thirsty[Dsus]`.substring(1);

    const expectedChordOverWords = `
title: Honey In The Rock

Verse 1
D        Dsus               D        Dsus
  Praying     for a miracle,  thirsty`.substring(1);

    const song = new ChordProParser().parse(chordpro);
    const actualChordsOverWords = new ChordsOverWordsFormatter().format(song);

    expect(actualChordsOverWords).toEqual(expectedChordOverWords);
  });
});
