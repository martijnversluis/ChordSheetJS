import '../util/matchers';

import songWithIntro from '../fixtures/song_with_intro';

import { ContentType } from '../../src/serialized_types';
import { GRID } from '../../src/constants';
import { exampleSongSolfege, exampleSongSymbol } from '../fixtures/song';

import {
  ABC, ChordProParser, LILYPOND, TAB, TextFormatter,
} from '../../src';

import {
  chordLyricsPair, createSongFromAst, heredoc, section, tag,
} from '../util/utilities';

describe('TextFormatter', () => {
  it('formats a symbol song to a text chord sheet correctly', () => {
    const expectedChordSheet = heredoc`
      LET IT BE
      ChordSheetJS example version

      Written by: John Lennon,Paul McCartney

      Verse 1
             Am         C/G        F          C
      Let it be, let it be, let it be, let it be
      D       strong   G  A           G  D/F# Em D
      Whisper words of wisdom, let it be

      Breakdown
      Em               F              C  G
      Whisper words of wisdom, let it be

      Chorus 2
      G                F              C  G
      Whisper words of wisdom, let it be

      Solo 1
      G
      Solo line 1
      C
      Solo line 2

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

    expect(new TextFormatter().format(exampleSongSymbol)).toEqual(expectedChordSheet);
  });

  it('formats a solfege song to a text chord sheet correctly', () => {
    const expectedChordSheet = heredoc`
LET IT BE
ChordSheetJS example version

Written by: John Lennon,Paul McCartney

Verse 1
       Lam        Do/Sol     Fa         Do
Let it be, let it be, let it be, let it be
Re      strong   Sol La          Sol Re/Fa# Mim Re
Whisper words of wis dom, let it be

Breakdown
Mim              Fa             Do Sol
Whisper words of wisdom, let it be

Chorus 2
Mim              Fa             Do Sol
Whisper words of wisdom, let it be

Solo 1
Sol
Solo line 1
Do
Solo line 2

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

    expect(new TextFormatter().format(exampleSongSolfege)).toEqual(expectedChordSheet);
  });

  it('omits the lyrics line when it is empty', () => {
    const formatter = new TextFormatter();

    const expectedChordSheet = heredoc`
Intro:  C
       Am         C/G        F          C
Let it be, let it be, let it be, let it be`;

    expect(formatter.format(songWithIntro)).toEqual(expectedChordSheet);
  });

  it('applies the correct normalization when a capo is active and decapo is on', () => {
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

    const expectedChordSheet = heredoc`
         C#m7             B/D#                 E
      My heart has always longed for something more`;

    expect(new TextFormatter({ decapo: true }).format(songWithCapo)).toEqual(expectedChordSheet);
  });

  it('does not apply normalization for capo when decapo is off', () => {
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

    const expectedChordSheet = heredoc`
         Dm7              C/E                  F
      My heart has always longed for something more`;

    expect(new TextFormatter().format(songWithCapo)).toEqual(expectedChordSheet);
  });

  it('can render in a different key', () => {
    const expectedChordSheet = heredoc`
      LET IT BE
      ChordSheetJS example version

      Written by: John Lennon,Paul McCartney

      Verse 1
             Cm         Eb/Bb      Ab         Eb
      Let it be, let it be, let it be, let it be
      F       strong   Bb C           Bb F/A Gm F
      Whisper words of wisdom, let it be

      Breakdown
      Gm               Ab             Eb Bb
      Whisper words of wisdom, let it be

      Chorus 2
      Bb               Ab             Eb Bb
      Whisper words of wisdom, let it be

      Solo 1
      Bb
      Solo line 1
      Eb
      Solo line 2

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

    expect(new TextFormatter({ key: 'Eb' }).format(exampleSongSymbol)).toEqual(expectedChordSheet);
  });

  it('renders unicode modifiers with option useUnicodeModifiers:true', () => {
    const songWithCapo = createSongFromAst([
      [
        chordLyricsPair('', 'The '),
        chordLyricsPair('C#', 'chords are in a '),
        chordLyricsPair('Eb', 'broken key where '),
        chordLyricsPair('F#', 'sharps and '),
        chordLyricsPair('Ab', 'flats are mixed'),
      ],
    ]);

    const expectedChordSheet = heredoc`
          C♯              E♭               F♯         A♭
      The chords are in a broken key where sharps and flats are mixed`;

    expect(new TextFormatter({ useUnicodeModifiers: true }).format(songWithCapo)).toEqual(expectedChordSheet);
  });

  it('can skip chord normalization', () => {
    const songWithSus2 = createSongFromAst([
      [chordLyricsPair('Asus2', 'Let it be')],
    ]);

    const formatted = new TextFormatter({ normalizeChords: false }).format(songWithSus2);
    expect(formatted).toEqual('Asus2\nLet it be');
  });

  it('can use a custom metadata separator', () => {
    const song = new ChordProParser().parse(heredoc`
      {composer: John}
      {composer: Jane}

      Composers: %{composer}
    `);

    const rendered = new TextFormatter({
      metadata: {
        separator: ' and ',
      },
    })
      .format(song);

    expect(rendered).toEqual('Composers: John and Jane');
  });

  describe('delegates', () => {
    [ABC, GRID, LILYPOND, TAB].forEach((type) => {
      describe(`for ${type}`, () => {
        it('uses a configured delegate', () => {
          const song = createSongFromAst([
            ...section(type as ContentType, `${type} section`, {}, `${type} line 1\n${type} line 2`),
          ]);

          const configuration = {
            delegates: {
              [type]: (content: string) => content.toUpperCase(),
            },
          };

          const expectedOutput = heredoc`
            ${type} section
            ${type.toUpperCase()} LINE 1
            ${type.toUpperCase()} LINE 2
          `;

          expect(new TextFormatter(configuration).format(song)).toEqual(expectedOutput);
        });

        it('defaults to the default delegate', () => {
          const song = createSongFromAst([
            ...section(type as ContentType, `${type} section`, {}, `${type} line 1\n${type} line 2`),
          ]);

          const configuration = {};

          const expectedOutput = heredoc`
            ${type} section
            ${type} line 1
            ${type} line 2
          `;

          expect(new TextFormatter(configuration).format(song)).toEqual(expectedOutput);
        });
      });
    });
  });
});
