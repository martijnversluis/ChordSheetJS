import { createSong, createLine, createChordLyricsPair } from '../utilities';

// Mimic the following chord sheet:
// [Intro: ][C]
// Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
// [C]Whisper words of [G]wisdom, let it [F]be [C/E] [Dm] [C]

export default createSong([
  createLine([
    createChordLyricsPair('Intro: ', ''),
    createChordLyricsPair('C', '')
  ]),

  createLine([
    createChordLyricsPair('', 'Let it '),
    createChordLyricsPair('Am', 'be, let it '),
    createChordLyricsPair('C/G', 'be, let it '),
    createChordLyricsPair('F', 'be, let it '),
    createChordLyricsPair('C', 'be')
  ])
]);
