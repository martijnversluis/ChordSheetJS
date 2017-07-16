import { createSong, createLine, createItem, createTag } from '../utilities';

// Mimic the following chord sheet:
//
// {title: Let it be}
// {subtitle: ChordSheetJS example version}
// {Chorus}
//
// Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
// [C]Whisper words of [G]wisdom, let it [F]be [C/E] [Dm] [C]

export default createSong([
  createLine([]),

  createLine([
    createTag('Chorus', '')
  ]),

  createLine([]),

  createLine([
    createItem('', 'Let it '),
    createItem('Am', 'be, let it '),
    createItem('C/G', 'be, let it '),
    createItem('F', 'be, let it '),
    createItem('C', 'be')
  ]),

  createLine([
    createItem('C', 'Whisper words of '),
    createItem('G', 'wisdom, let it '),
    createItem('F', 'be '),
    createItem('C/E', ' '),
    createItem('Dm', ' '),
    createItem('C', '')
  ])
], {
  title: 'Let it be',
  subtitle: 'ChordSheetJS example version'
});
