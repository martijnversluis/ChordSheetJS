import { ChordsOverWordsFormatter } from '../../src';
import '../matchers';
import { exampleSongSolfege, exampleSongSymbol } from '../fixtures/song';
import songWithIntro from '../fixtures/song_with_intro';
import { heredoc } from '../utilities';

describe('ChordsOverWordsFormatter', () => {
  it('formats a symbol song to a text chord sheet correctly', () => {
    const formatter = new ChordsOverWordsFormatter();

    const expectedChordSheet = heredoc`
      title: Let it be
      subtitle: ChordSheetJS example version
      key: C
      x_some_setting: undefined
      composer: John Lennon,Paul McCartney
      
      Written by: John Lennon,Paul McCartney
      
      Verse 1
             Am         C/G        F          C
      Let it be, let it be, let it be, let it be
      D       strong   G  A           G  D/F# Em D
      Whisper words of wisdom, let it be
      
      Breakdown
      Em               F              C  G
      Whisper words of wisdom, let it be
      
      Tab 1
      Tab line 1
      Tab line 2
      
      ABC 1
      ABC line 1
      ABC line 2
      
      LY 1
      LY line 1
      LY line 2
      
      Bridge 1
      Bridge line
      
      Grid 1
      Grid line 1
      Grid line 2`;

    expect(formatter.format(exampleSongSymbol)).toEqual(expectedChordSheet);
  });

  it('formats a solfege song to a text chord sheet correctly', () => {
    const formatter = new ChordsOverWordsFormatter();

    const expectedChordSheet = heredoc`
title: Let it be
subtitle: ChordSheetJS example version
key: Do
x_some_setting: undefined
composer: John Lennon,Paul McCartney

Written by: John Lennon,Paul McCartney

Verse 1
       Lam        Do/Sol     Fa         Do
Let it be, let it be, let it be, let it be
Re      strong   Sol La          Sol Re/Fa# Mim Re
Whisper words of wis dom, let it be

Breakdown
Mim              Fa             Do Sol
Whisper words of wisdom, let it be

Tab 1
Tab line 1
Tab line 2

ABC 1
ABC line 1
ABC line 2

LY 1
LY line 1
LY line 2

Bridge 1
Bridge line

Grid 1
Grid line 1
Grid line 2`;

    expect(formatter.format(exampleSongSolfege)).toEqual(expectedChordSheet);
  });

  it('omits the lyrics line when it is empty', () => {
    const formatter = new ChordsOverWordsFormatter();

    const expectedChordSheet = heredoc`
      Intro:  C
             Am         C/G        F          C
      Let it be, let it be, let it be, let it be`;

    expect(formatter.format(songWithIntro)).toEqual(expectedChordSheet);
  });
});
