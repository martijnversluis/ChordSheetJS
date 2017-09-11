import { createSong, createLine, createChordLyricsPair, createTag } from '../utilities';

// Mimic the following chord sheet:
// {title: Let it be}
// {subtitle: ChordSheetJS example version}
// {Chorus}
//
// Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
// [C]Whisper words of [G]wisdom, let it [F]be [C/E] [Dm] [C]

export default createSong([
  createLine([
    createTag('title', 'Let it be')
  ]),

  createLine([
    createTag('subtitle', 'ChordSheetJS example version')
  ]),

  createLine([
    createTag('Chorus', '')
  ]),

  createLine([]),

  createLine([
    createChordLyricsPair('', 'Let it '),
    createChordLyricsPair('Am', 'be, let it '),
    createChordLyricsPair('C/G', 'be, let it '),
    createChordLyricsPair('F', 'be, let it '),
    createChordLyricsPair('C', 'be')
  ]),

  createLine([
    createChordLyricsPair('C', 'Whisper words of '),
    createChordLyricsPair('G', 'wisdom, let it '),
    createChordLyricsPair('F', 'be '),
    createChordLyricsPair('C/E', ' '),
    createChordLyricsPair('Dm', ' '),
    createChordLyricsPair('C', '')
  ])
], {
  title: 'Let it be',
  subtitle: 'ChordSheetJS example version'
});
