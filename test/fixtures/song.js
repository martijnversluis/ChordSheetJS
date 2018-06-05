import { createSong, createLine, createChordLyricsPair, createTag } from '../utilities';

// Mimic the following chord sheet:
// {title: Let it be}
// {subtitle: ChordSheetJS example version}
// {x_some_setting: value}
// {comment: Bridge}
//
// Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
// [C]Whisper words of [F]wis[G]dom, let it [F]be [C/E] [Dm] [C]
//
// [Am]Whisper words of [Bb]wisdom, let it [F]be [C]

export default createSong([
  createLine([
    createTag('title', 'Let it be'),
  ]),

  createLine([
    createTag('subtitle', 'ChordSheetJS example version'),
  ]),

  createLine([
    createTag('x_some_setting', ''),
  ]),

  createLine([
    createTag('comment', 'Bridge'),
  ]),

  createLine([]),

  createLine([
    createChordLyricsPair('', 'Let it '),
    createChordLyricsPair('Am', 'be, let it '),
    createChordLyricsPair('C/G', 'be, let it '),
    createChordLyricsPair('F', 'be, let it '),
    createChordLyricsPair('C', 'be'),
  ]),

  createLine([
    createChordLyricsPair('C', 'Whisper words of '),
    createChordLyricsPair('F', 'wis'),
    createChordLyricsPair('G', 'dom, let it '),
    createChordLyricsPair('F', 'be '),
    createChordLyricsPair('C/E', ' '),
    createChordLyricsPair('Dm', ' '),
    createChordLyricsPair('C', ' '),
  ]),

  createLine([]),

  createLine([
    createChordLyricsPair('Am', 'Whisper words of '),
    createChordLyricsPair('Bb', 'wisdom, let it '),
    createChordLyricsPair('F', 'be '),
    createChordLyricsPair('C', ''),
  ]),
], {
  title: 'Let it be',
  subtitle: 'ChordSheetJS example version',
});
