import { chordLyricsPair, createSongFromAst } from '../util/utilities';

// Mimic the following chord sheet:
// [Intro: ][C]
// Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
// [C]Whisper words of [G]wisdom, let it [F]be [C/E] [Dm] [C]

export default createSongFromAst([
  [
    chordLyricsPair('Intro: ', ''),
    chordLyricsPair('C', ''),
  ],

  [
    chordLyricsPair('', 'Let it '),
    chordLyricsPair('Am', 'be, let it '),
    chordLyricsPair('C/G', 'be, let it '),
    chordLyricsPair('F', 'be, let it '),
    chordLyricsPair('C', 'be'),
  ],
]);
