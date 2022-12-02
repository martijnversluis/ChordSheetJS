import { ChordProFormatter } from '../../src';
import chordProSheet from '../fixtures/chord_pro_sheet';
import {
  chordLyricsPair, createSongFromAst, tag, ternary,
} from '../utilities';

describe('ChordProFormatter', () => {
  it('formats a song to a html chord sheet correctly', () => {
    const formatter = new ChordProFormatter();
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
    ]))).toEqual(chordProSheet);
  });
});
