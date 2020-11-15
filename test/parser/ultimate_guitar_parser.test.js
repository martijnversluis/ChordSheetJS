import fs from 'fs';

import '../matchers';
import UltimateGuitarParser from '../../src/parser/ultimate_guitar_parser';
import ChordProFormatter from '../../src/formatter/chord_pro_formatter';

describe('UltimateGuitarParser', () => {
  it('starts and ends a single verse tag correctly', () => {
    const chordSheetVerseTag = `
[Verse 1]`.substring(1);

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheetVerseTag);
    const { lines } = song;

    expect(lines.length).toEqual(2);

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeTag('start_of_verse', null);

    const line1Items = lines[1].items;
    expect(line1Items[0]).toBeTag('end_of_verse', null);
  });

  it('parses a single verse correctly', () => {
    const chordSheetVerse = `
[Verse 1]
C     G               Am
Lorem ipsum dolor sit amet,
C           G          F
consectetur adipiscing elit.`.substring(1);

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheetVerse);
    const { lines } = song;

    expect(lines.length).toEqual(4);

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeTag('start_of_verse', null);

    const line1Items = lines[1].items;
    expect(line1Items.length).toEqual(3);

    const line2Items = lines[2].items;
    expect(line2Items.length).toEqual(3);

    const line3Items = lines[3].items;
    expect(line3Items[0]).toBeTag('end_of_verse', null);
  });

  it('adds unknown sections as comments', () => {
    const chordSheetInstrumental = `
[Instrumental]
F  C Dm
`.substring(1); // to do: support chords-only line with no following lyrics or empty line

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheetInstrumental);
    const { lines } = song;

    expect(lines.length).toEqual(3);

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeTag('comment', 'Instrumental');

    const line1Items = lines[1].items;
    expect(line1Items.length).toEqual(3);

    const line2Items = lines[2].items;
    expect(line2Items.length).toEqual(0);
  });

  it('parses entire chordsheet with several sections correctly', () => {
    const chordSheet = fs.readFileSync('./test/fixtures/ultimate_guitar_chordsheet.txt', 'utf8');
    const expected = fs.readFileSync('./test/fixtures/ultimate_guitar_chordsheet_expected_chordpro_format.txt', 'utf8');

    const parser = new UltimateGuitarParser({ preserveWhitespace: false });
    const song = parser.parse(chordSheet);
    const result = new ChordProFormatter().format(song);

    expect(result).toEqual(expected);
  });
});
