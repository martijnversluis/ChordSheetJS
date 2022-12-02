import { TextFormatter } from '../../src';
import '../matchers';
import song from '../fixtures/song';
import songWithIntro from '../fixtures/song_with_intro';

import { chordLyricsPair, createSongFromAst, tag } from '../utilities';

describe('TextFormatter', () => {
  it('formats a song to a text chord sheet correctly', () => {
    const expectedChordSheet = `
LET IT BE
ChordSheetJS example version

Written by: John Lennon,Paul McCartney

Verse 1
       Am         C/G        F          C
Let it be, let it be, let it be, let it be
D                G  A           G  D/F# Em D
Whisper words of wisdom, let it be

Breakdown
Em               F              C  G
Whisper words of wisdom, let it be`.substring(1);

    expect(new TextFormatter().format(song)).toEqual(expectedChordSheet);
  });

  it('omits the lyrics line when it is empty', () => {
    const formatter = new TextFormatter();

    const expectedChordSheet = `
Intro:  C
       Am         C/G        F          C
Let it be, let it be, let it be, let it be`.substring(1);

    expect(formatter.format(songWithIntro)).toEqual(expectedChordSheet);
  });

  it('applies the correct normalization when a capo is active', () => {
    const songWithCapo = createSongFromAst([
      [tag('key', 'F')],
      [tag('capo', '1')],
      [
        chordLyricsPair('', 'My '),
        chordLyricsPair('Dm7', 'heart has always '),
        chordLyricsPair('C/E', 'longed for something '),
        chordLyricsPair('F', 'more'),
      ],
    ]);

    const expectedChordSheet = `
   C#m7             B/D#                 E
My heart has always longed for something more`.substring(1);

    expect(new TextFormatter().format(songWithCapo)).toEqual(expectedChordSheet);
  });
});
