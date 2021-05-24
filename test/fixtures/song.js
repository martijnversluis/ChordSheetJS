import {
  createSong, createChordLyricsPair, createTag, createLiteral, createTernary,
} from '../utilities';

// This Song object mimics the chord pro sheet in chord_pro_sheet.js
export default createSong([
  [
    createTag('title', 'Let it be'),
  ],

  [
    createTag('subtitle', 'ChordSheetJS example version'),
  ],

  [
    createTag('x_some_setting', ''),
  ],

  [
    createTag('composer', 'John Lennon'),
  ],

  [
    createTag('composer', 'Paul McCartney'),
  ],

  [],

  [
    createChordLyricsPair('', 'Written by: '),
    createTernary({
      variable: 'composer',
      trueExpression: [
        createTernary({ variable: null }),
      ],
      falseExpression: [
        createLiteral('No composer defined for '),
        createTernary({
          variable: 'title',
          trueExpression: [
            createTernary({ variable: null }),
          ],
          falseExpression: [
            createLiteral('Untitled song'),
          ],
        }),
      ],
    }),
  ],

  [],

  [
    createTag('start_of_verse'),
  ],

  [
    createChordLyricsPair('', 'Let it '),
    createChordLyricsPair('Am', 'be, let it '),
    createChordLyricsPair('C/G', 'be, let it '),
    createChordLyricsPair('F', 'be, let it '),
    createChordLyricsPair('C', 'be'),
  ],

  [
    createChordLyricsPair('C', 'Whisper words of '),
    createChordLyricsPair('F', 'wis'),
    createChordLyricsPair('G', 'dom, let it '),
    createChordLyricsPair('F', 'be '),
    createChordLyricsPair('C/E', ' '),
    createChordLyricsPair('Dm', ' '),
    createChordLyricsPair('C', ''),
  ],

  [
    createTag('end_of_verse'),
  ],

  [],

  [
    createTag('start_of_chorus'),
  ],

  [
    createTag('comment', 'Breakdown'),
  ],

  [
    createChordLyricsPair('Am', 'Whisper words of '),
    createChordLyricsPair('Bb', 'wisdom, let it '),
    createChordLyricsPair('F', 'be '),
    createChordLyricsPair('C', ''),
  ],

  [
    createTag('end_of_chorus'),
  ],
], {
  title: 'Let it be',
  subtitle: 'ChordSheetJS example version',
});
