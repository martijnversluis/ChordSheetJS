import { ChordProFormatter, ChordsOverWordsParser } from '../../src';

describe('chords over words to chordpro', () => {
  it('correctly parses and converts the song structure', () => {
    const chordOverWords = `
title: Let it be
key: C
---
Chorus 1:
       Am         C/G        F          C
Let it be, let it be, let it be, let it be
C                G              F  C/E Dm C
Whisper words of wisdom, let it be

       Bbm7       DbM7/Ab    Gbsus2     Db
Let it be, let it be, let it be, let it be
GbM7             Absus          Gb  Db/F Ebm Db
Whisper words of wisdom, let it be`.substring(1);

    const expectedChordPro = `
{title: Let it be}
{key: C}
{comment: Chorus 1:}
Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
[C]Whisper words of [G]wisdom, let it [F]be[C/E][Dm][C]

Let it [Bbm7]be, let it [DbM7/Ab]be, let it [Gbsus2]be, let it [Db]be
[GbM7]Whisper words of [Absus]wisdom, let it [Gb]be[Db/F][Ebm][Db]`.substring(1);

    const song = new ChordsOverWordsParser().parse(chordOverWords);
    const actualChordPro = new ChordProFormatter().format(song);

    expect(actualChordPro).toEqual(expectedChordPro);
  });

  it('correctly formats chords over words with trailing chords', () => {
    const chordOverWords = `
title: Honey In The Rock

Verse 1
D        Dsus               D        Dsus 
  Praying     for a miracle,  thirsty`.substring(1);

    const expectedChordPro = `
{title: Honey In The Rock}

{comment: Verse 1}
[D] Praying[Dsus] for a miracle,[D] thirsty[Dsus]`.substring(1);

    const song = new ChordsOverWordsParser().parse(chordOverWords);
    const actualChordPro = new ChordProFormatter().format(song);

    expect(actualChordPro).toEqual(expectedChordPro);
  });

  it('allows for a variance in space between trailing chord and next lyric', () => {
    const chordOverWords = `
title: Honey In The Rock

Verse 1
D       Dsus           D       Dsus 
 Praying for a miracle, thirsty`.substring(1);

    const expectedChordPro = `
{title: Honey In The Rock}

{comment: Verse 1}
[D] Praying[Dsus] for a miracle,[D] thirsty[Dsus]`.substring(1);

    const song = new ChordsOverWordsParser().parse(chordOverWords);
    const actualChordPro = new ChordProFormatter().format(song);

    expect(actualChordPro).toEqual(expectedChordPro);
  });
});
