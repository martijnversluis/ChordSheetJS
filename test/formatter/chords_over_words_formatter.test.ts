import { ChordsOverWordsFormatter } from '../../src';
import '../matchers';
import song from '../fixtures/song';
import songWithIntro from '../fixtures/song_with_intro';

describe('ChordsOverWordsFormatter', () => {
  it('formats a song to a text chord sheet correctly', () => {
    const formatter = new ChordsOverWordsFormatter();

    const expectedChordSheet = `
title: Let it be
subtitle: ChordSheetJS example version
key: C
x_some_setting: undefined
composer: John Lennon,Paul McCartney

Written by: John Lennon,Paul McCartney

Verse 1
       Am         C/G        F          C
Let it be, let it be, let it be, let it be
D                G  A           G  D/F# Em D
Whisper words of wisdom, let it be

Breakdown
Em               F              C  G
Whisper words of wisdom, let it be

Bridge 1
Bridge line

Grid 1
Grid line

Tab 1
Tab line`.substring(1);

    expect(formatter.format(song)).toEqual(expectedChordSheet);
  });

  it('omits the lyrics line when it is empty', () => {
    const formatter = new ChordsOverWordsFormatter();

    const expectedChordSheet = `
Intro:  C
       Am         C/G        F          C
Let it be, let it be, let it be, let it be`.substring(1);

    expect(formatter.format(songWithIntro)).toEqual(expectedChordSheet);
  });
});
