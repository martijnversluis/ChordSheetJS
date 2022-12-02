import { TextFormatter } from '../../src';
import '../matchers';
import songWithIntro from '../fixtures/song_with_intro';
import {
  chordLyricsPair, createSongFromAst, tag, ternary,
} from '../utilities';

describe('TextFormatter', () => {
  it('formats a song to a text chord sheet correctly', () => {
    const formatter = new TextFormatter();

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

    expect(formatter.format(createSongFromAst([
      [tag('title', 'Let it be')],
      [tag('subtitle', 'ChordSheetJS example version')],
      [tag('key', 'C')],
      [tag('x_some_setting', '')],
      [tag('composer', 'John Lennon')],
      [tag('composer', 'Paul McCartney')],
      [],
      [
        chordLyricsPair('', 'Written by: '),
        ternary({
          variable: 'composer',
          trueExpression: [ternary({ variable: null })],
          falseExpression: [
            'No composer defined for ',
            ternary({
              variable: 'title',
              trueExpression: [ternary({ variable: null })],
              falseExpression: ['Untitled song'],
            }),
          ],
        }),
      ],
      [],
      [tag('start_of_verse', 'Verse 1')],
      [
        chordLyricsPair('', 'Let it '),
        chordLyricsPair('Am', 'be, let it '),
        chordLyricsPair('C/G', 'be, let it '),
        chordLyricsPair('F', 'be, let it '),
        chordLyricsPair('C', 'be'),
      ],
      [tag('transpose', '2')],
      [
        chordLyricsPair('C', 'Whisper words of '),
        chordLyricsPair('F', 'wis'),
        chordLyricsPair('G', 'dom, let it '),
        chordLyricsPair('F', 'be '),
        chordLyricsPair('C/E', ' '),
        chordLyricsPair('Dm', ' '),
        chordLyricsPair('C', ''),
      ],
      [tag('end_of_verse')],
      [],
      [tag('start_of_chorus')],
      [tag('comment', 'Breakdown')],
      [tag('transpose', 'G')],
      [
        chordLyricsPair('Am', 'Whisper words of '),
        chordLyricsPair('Bb', 'wisdom, let it '),
        chordLyricsPair('F', 'be '),
        chordLyricsPair('C', ''),
      ],
      [tag('end_of_chorus')],
    ]))).toEqual(expectedChordSheet);
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
