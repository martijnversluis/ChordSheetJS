import fs from 'fs';

import '../matchers';
import { heredoc } from '../utilities';
import { normalizeLineEndings } from '../../src/utilities';
import { ChordProFormatter, UltimateGuitarParser } from '../../src';

describe('UltimateGuitarParser', () => {
  it('starts and ends a single verse tag correctly', () => {
    const chordSheetVerseTag = '[Verse 1]';

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheetVerseTag);
    const { lines } = song;

    expect(lines.length).toEqual(2);

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeTag('start_of_verse', 'Verse 1');

    const line1Items = lines[1].items;
    expect(line1Items[0]).toBeTag('end_of_verse', '');
  });

  it('parses a single verse correctly', () => {
    const chordSheetVerse = heredoc`
      [Verse 1]
      C     G               Am
      Lorem ipsum dolor sit amet,
      C           G          F
      consectetur adipiscing elit.`;

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheetVerse);
    const { lines } = song;

    expect(lines.length).toEqual(4);

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeTag('start_of_verse', 'Verse 1');

    const line1Items = lines[1].items;
    expect(line1Items.length).toEqual(3);

    const line2Items = lines[2].items;
    expect(line2Items.length).toEqual(3);

    const line3Items = lines[3].items;
    expect(line3Items[0]).toBeTag('end_of_verse', '');
  });

  it('parses verses and choruses case-insensitively', () => {
    const chordSheetVerseChorus = heredoc`
      [VERSE 1]
      C     G               Am
      Lorem ipsum dolor sit amet,
      [chorus]
      C           G          F
      consectetur adipiscing elit.`;

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheetVerseChorus);
    const { lines } = song;

    expect(lines.length).toEqual(6);

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeTag('start_of_verse', 'VERSE 1');

    const line1Items = lines[1].items;
    expect(line1Items.length).toEqual(3);

    const line2Items = lines[2].items;
    expect(line2Items[0]).toBeTag('end_of_verse', '');

    const line3Items = lines[3].items;
    expect(line3Items[0]).toBeTag('start_of_chorus', 'chorus');

    const line4Items = lines[4].items;
    expect(line4Items.length).toEqual(3);

    const line5Items = lines[5].items;
    expect(line5Items[0]).toBeTag('end_of_chorus', '');
  });

  it('adds unknown sections as comments', () => {
    const chordSheetInstrumental = heredoc`
      [Instrumental]
      F  C Dm`;

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheetInstrumental);
    const { lines } = song;

    expect(lines.length).toEqual(2);

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeTag('comment', 'Instrumental');

    const line1Items = lines[1].items;
    expect(line1Items.length).toEqual(1);
  });

  it('parses entire chord sheet with several sections correctly', () => {
    const chordSheet = fs.readFileSync('./test/fixtures/ultimate_guitar_chordsheet.txt', 'utf8');

    const expected = normalizeLineEndings(
      fs.readFileSync('./test/fixtures/ultimate_guitar_chordsheet_expected_chordpro_format.txt', 'utf8'),
    );

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheet);
    const result = new ChordProFormatter().format(song);

    expect(result).toEqual(expected);
  });

  it('support CR line endings', () => {
    const chordSheet = '       Am         C/G\rLet it be, let it be,\r       F          C\rlet it be, let it be';

    const parser = new UltimateGuitarParser();
    const song = parser.parse(chordSheet);
    const { lines } = song;
    const [{ items: line0Items }, { items: line1Items }] = lines;

    expect(lines).toHaveLength(2);

    expect(line0Items[0]).toBeChordLyricsPair('      ', 'Let it ');
    expect(line0Items[1]).toBeChordLyricsPair('Am        ', 'be, let it ');
    expect(line0Items[2]).toBeChordLyricsPair('C/G', 'be,');
    expect(line1Items[0]).toBeChordLyricsPair('      ', 'let it ');
    expect(line1Items[1]).toBeChordLyricsPair('F         ', 'be, let it ');
    expect(line1Items[2]).toBeChordLyricsPair('C', 'be');
  });

  it('support LF line endings', () => {
    const chordSheet = '       Am         C/G\nLet it be, let it be,\n       F          C\nlet it be, let it be';

    const parser = new UltimateGuitarParser();
    const song = parser.parse(chordSheet);
    const { lines } = song;
    const [{ items: line0Items }, { items: line1Items }] = lines;

    expect(lines).toHaveLength(2);

    expect(line0Items[0]).toBeChordLyricsPair('      ', 'Let it ');
    expect(line0Items[1]).toBeChordLyricsPair('Am        ', 'be, let it ');
    expect(line0Items[2]).toBeChordLyricsPair('C/G', 'be,');
    expect(line1Items[0]).toBeChordLyricsPair('      ', 'let it ');
    expect(line1Items[1]).toBeChordLyricsPair('F         ', 'be, let it ');
    expect(line1Items[2]).toBeChordLyricsPair('C', 'be');
  });

  it('support CRLF line endings', () => {
    const chordSheet = '       Am         C/G\r\nLet it be, let it be,\r\n       F          C\r\nlet it be, let it be';

    const parser = new UltimateGuitarParser();
    const song = parser.parse(chordSheet);
    const { lines } = song;
    const [{ items: line0Items }, { items: line1Items }] = lines;

    expect(lines).toHaveLength(2);

    expect(line0Items[0]).toBeChordLyricsPair('      ', 'Let it ');
    expect(line0Items[1]).toBeChordLyricsPair('Am        ', 'be, let it ');
    expect(line0Items[2]).toBeChordLyricsPair('C/G', 'be,');
    expect(line1Items[0]).toBeChordLyricsPair('      ', 'let it ');
    expect(line1Items[1]).toBeChordLyricsPair('F         ', 'be, let it ');
    expect(line1Items[2]).toBeChordLyricsPair('C', 'be');
  });
});
