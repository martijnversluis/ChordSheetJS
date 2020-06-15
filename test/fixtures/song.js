import { createSong, createLine, createChordLyricsPair, createTag } from '../utilities';
import { CHORUS, INTRO, VERSE } from '../../src/constants';

// Mimic the following chord sheet:
// {title: Let it be}
// {subtitle: ChordSheetJS example version}
// {x_some_setting: value}
// {comment: Bridge}
//
// {start_of_intro}
// [Am][C][F][G]
// {end_of_intro}
//
// {start_of_verse}
// Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
// [C]Whisper words of [F]wis[G]dom, let it [F]be [C/E] [Dm] [C]
// {end_of_verse}
//
// {start_of_chorus}
// [Am]Whisper words of [Bb]wisdom, let it [F]be [C]
// {end_of_chorus}

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
    createTag('start_of_intro'),
  ]),

  createLine([
    createChordLyricsPair('Am', ''),
    createChordLyricsPair('C', ''),
    createChordLyricsPair('F', ''),
    createChordLyricsPair('G', ''),
  ], INTRO),

  createLine([
    createTag('end_of_intro'),
  ]),

  createLine([]),

  createLine([
    createTag('start_of_verse'),
  ]),

  createLine([
    createChordLyricsPair('', 'Let it '),
    createChordLyricsPair('Am', 'be, let it '),
    createChordLyricsPair('C/G', 'be, let it '),
    createChordLyricsPair('F', 'be, let it '),
    createChordLyricsPair('C', 'be'),
  ], VERSE),

  createLine([
    createChordLyricsPair('C', 'Whisper words of '),
    createChordLyricsPair('F', 'wis'),
    createChordLyricsPair('G', 'dom, let it '),
    createChordLyricsPair('F', 'be '),
    createChordLyricsPair('C/E', ' '),
    createChordLyricsPair('Dm', ' '),
    createChordLyricsPair('C', ' '),
  ], VERSE),

  createLine([
    createTag('end_of_verse'),
  ]),

  createLine([]),

  createLine([
    createTag('start_of_chorus'),
  ]),

  createLine([
    createChordLyricsPair('Am', 'Whisper words of '),
    createChordLyricsPair('Bb', 'wisdom, let it '),
    createChordLyricsPair('F', 'be '),
    createChordLyricsPair('C', ''),
  ], CHORUS),

  createLine([
    createTag('end_of_chorus'),
  ]),
], {
  title: 'Let it be',
  subtitle: 'ChordSheetJS example version',
});
