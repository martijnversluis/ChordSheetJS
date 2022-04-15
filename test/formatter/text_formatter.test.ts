import { TextFormatter } from '../../src';
import '../matchers';
import song from '../fixtures/song';
import songWithIntro from '../fixtures/song_with_intro';

describe('TextFormatter', () => {
  it('formats a song to a text chord sheet correctly', () => {
    const formatter = new TextFormatter();

    const expectedChordSheet = `
LET IT BE
ChordSheetJS example version

Written by: John Lennon,Paul McCartney

       Am         C/G        F          C
Let it be, let it be, let it be, let it be
D                G  A           G  D/F# Em D
Whisper words of wisdom, let it be

Breakdown
Em               F              C  G
Whisper words of wisdom, let it be`.substring(1);

    expect(formatter.format(song)).toEqual(expectedChordSheet);
  });

  it('omits the lyrics line when it is empty', () => {
    const formatter = new TextFormatter();

    const expectedChordSheet = `
Intro:  C
       Am         C/G        F          C
Let it be, let it be, let it be, let it be`.substring(1);

    expect(formatter.format(songWithIntro)).toEqual(expectedChordSheet);
  });
});
