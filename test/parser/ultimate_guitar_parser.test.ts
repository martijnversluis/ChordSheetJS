import fs from 'fs';

import '../util/matchers';
import { heredoc } from '../util/utilities';
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

  it('parses bridge sections', () => {
    const chordSheetBridge = heredoc`
      [Bridge]
      F  C Dm
      Some bridge lyrics`;

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheetBridge);
    const { lines } = song;

    expect(lines.length).toEqual(3);

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeTag('start_of_bridge', 'Bridge');

    const line2Items = lines[2].items;
    expect(line2Items[0]).toBeTag('end_of_bridge', '');
  });

  it('parses bridge sections with number', () => {
    const chordSheetBridge = '[Bridge 2]';

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheetBridge);
    const { lines } = song;

    expect(lines.length).toEqual(2);

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeTag('start_of_bridge', 'Bridge 2');

    const line1Items = lines[1].items;
    expect(line1Items[0]).toBeTag('end_of_bridge', '');
  });

  it('parses intro sections as part', () => {
    const chordSheetIntro = heredoc`
      [Intro]
      F  C Dm`;

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheetIntro);
    const { lines } = song;

    expect(lines.length).toEqual(3);

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeTag('start_of_part', 'Intro');

    const line2Items = lines[2].items;
    expect(line2Items[0]).toBeTag('end_of_part', '');
  });

  it('parses outro sections as part', () => {
    const chordSheetOutro = '[Outro]';

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheetOutro);
    const { lines } = song;

    expect(lines.length).toEqual(2);

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeTag('start_of_part', 'Outro');

    const line1Items = lines[1].items;
    expect(line1Items[0]).toBeTag('end_of_part', '');
  });

  it('parses instrumental sections as part', () => {
    const chordSheetInstrumental = heredoc`
      [Instrumental]
      F  C Dm`;

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheetInstrumental);
    const { lines } = song;

    expect(lines.length).toEqual(3);

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeTag('start_of_part', 'Instrumental');

    const line2Items = lines[2].items;
    expect(line2Items[0]).toBeTag('end_of_part', '');
  });

  it('parses interlude sections as part', () => {
    const chordSheetInterlude = '[Interlude]';

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheetInterlude);
    const { lines } = song;

    expect(lines.length).toEqual(2);

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeTag('start_of_part', 'Interlude');

    const line1Items = lines[1].items;
    expect(line1Items[0]).toBeTag('end_of_part', '');
  });

  it('parses solo sections as part', () => {
    const chordSheetSolo = '[Solo]';

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheetSolo);
    const { lines } = song;

    expect(lines.length).toEqual(2);

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeTag('start_of_part', 'Solo');

    const line1Items = lines[1].items;
    expect(line1Items[0]).toBeTag('end_of_part', '');
  });

  it('parses pre-chorus sections as part', () => {
    const chordSheetPreChorus = '[Pre-Chorus]';

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheetPreChorus);
    const { lines } = song;

    expect(lines.length).toEqual(2);

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeTag('start_of_part', 'Pre-Chorus');

    const line1Items = lines[1].items;
    expect(line1Items[0]).toBeTag('end_of_part', '');
  });

  it('parses section types case-insensitively', () => {
    const chordSheetBridge = '[BRIDGE]';

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheetBridge);
    const { lines } = song;

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeTag('start_of_bridge', 'BRIDGE');
  });

  it('adds truly unknown sections as comments', () => {
    const chordSheetUnknown = '[Some Random Thing]';

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheetUnknown);
    const { lines } = song;

    expect(lines.length).toEqual(1);

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeTag('comment', 'Some Random Thing');
  });

  it('parses entire chord sheet with several sections correctly', () => {
    const chordSheet = fs.readFileSync('./test/fixtures/ultimate_guitar_chordsheet.txt', 'utf8');

    const expected = normalizeLineEndings(
      fs.readFileSync('./test/fixtures/ultimate_guitar_chordsheet_expected_chordpro_format.txt', 'utf8'),
    ).trimEnd();

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheet);
    const result = new ChordProFormatter().format(song).trimEnd();

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

  it('parses Key metadata', () => {
    const chordSheet = heredoc`
      Key: Am
      [Verse]
      Am     G
      Hello world`;

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheet);

    expect(song.key).toEqual('Am');
  });

  it('parses Capo metadata', () => {
    const chordSheet = heredoc`
      Capo: 2
      [Verse]
      Am     G
      Hello world`;

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheet);

    expect(song.capo).toEqual('2');
  });

  it('parses Capo metadata with "fret" suffix', () => {
    const chordSheet = heredoc`
      Capo: 3rd fret
      [Verse]
      Am     G
      Hello world`;

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheet);

    expect(song.capo).toEqual('3');
  });

  it('parses multiple metadata lines', () => {
    const chordSheet = heredoc`
      Key: G
      Capo: 2
      [Verse]
      G      D
      Hello world`;

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheet);

    expect(song.key).toEqual('G');
    expect(song.capo).toEqual('2');
  });

  it('parses Artist metadata', () => {
    const chordSheet = heredoc`
      Artist: The Beatles
      [Verse]
      Am     G
      Hello world`;

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheet);

    expect(song.artist).toEqual('The Beatles');
  });

  it('parses Title metadata', () => {
    const chordSheet = heredoc`
      Title: Let It Be
      [Verse]
      Am     G
      Hello world`;

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheet);

    expect(song.title).toEqual('Let It Be');
  });

  it('parses all common metadata', () => {
    const chordSheet = heredoc`
      Title: Let It Be
      Artist: The Beatles
      Album: Let It Be
      Year: 1970
      Key: C
      Capo: 0
      Tempo: 72
      [Verse]
      C      G
      Hello world`;

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheet);

    expect(song.title).toEqual('Let It Be');
    expect(song.artist).toEqual('The Beatles');
    expect(song.album).toEqual('Let It Be');
    expect(song.year).toEqual('1970');
    expect(song.key).toEqual('C');
    expect(song.capo).toEqual('0');
    expect(song.tempo).toEqual('72');
  });

  it('parses repeat notation x2', () => {
    const chordSheet = heredoc`
      [Intro]
      D A Bm G x2`;

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheet);
    const { lines } = song;

    expect(lines.length).toEqual(3);

    const line1Items = lines[1].items;
    expect(line1Items[0]).toBeChordLyricsPair('D', '');
    expect(line1Items[1]).toBeChordLyricsPair('A', '');
    expect(line1Items[2]).toBeChordLyricsPair('Bm', '');
    expect(line1Items[3]).toBeChordLyricsPair('G', 'x2');
  });

  it('parses repeat notation x3', () => {
    const chordSheet = 'C G Am F x3';

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheet);
    const { lines } = song;

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeChordLyricsPair('C', '');
    expect(line0Items[1]).toBeChordLyricsPair('G', '');
    expect(line0Items[2]).toBeChordLyricsPair('Am', '');
    expect(line0Items[3]).toBeChordLyricsPair('F', 'x3');
  });
});
