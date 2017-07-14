import expect from 'expect';
import '../matchers';
import { createSong, createLine, createItem, createTag } from '../utilities';
import TextFormatter from '../../src/formatter/text_formatter';

describe('TextFormatter', () => {
  it('formats a song to a text chord sheet correctly', () => {
    // Mimic the following chord sheet:
    //
    // {title: Let it be}
    // {Chorus}
    //
    // Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
    // [C]Whisper words of [G]wisdom, let it [F]be [C/E] [Dm] [C]

    const song = createSong([
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

    const formatter = new TextFormatter();

    const expectedChordSheet = `
LET IT BE
ChordSheetJS example version

Chorus

       Am         C/G        F          C
Let it be, let it be, let it be, let it be
C                G              F  C/E Dm C
Whisper words of wisdom, let it be
`.substring(1);

    expect(formatter.format(song)).toEqual(expectedChordSheet);
  });
});
