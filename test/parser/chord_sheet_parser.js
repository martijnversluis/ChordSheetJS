import expect from 'expect';
import '../matchers';
import ChordSheetParser from '../../src/parser/chord_sheet_parser';

const chordSheet = `
       Am         C/G        F          C
Let it be, let it be, let it be, let it be
C                G              F  C/E Dm C
Whisper words of wisdom, let it be`.substring(1);

describe('ChordSheetParser', () => {
  it('parses a regular chord sheet correctly', () => {
    const parser = new ChordSheetParser();
    const song = parser.parse(chordSheet);
    const lines = song.lines;

    expect(lines.length).toEqual(2);

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeChordLyricsPair('      ', 'Let it ');
    expect(line0Items[1]).toBeChordLyricsPair('Am        ', 'be, let it ');
    expect(line0Items[2]).toBeChordLyricsPair('C/G       ', 'be, let it ');
    expect(line0Items[3]).toBeChordLyricsPair('F         ', 'be, let it ');
    expect(line0Items[4]).toBeChordLyricsPair('C', 'be');

    const line1Items = lines[1].items;
    expect(line1Items[0]).toBeChordLyricsPair('C               ', 'Whisper words of ');
    expect(line1Items[1]).toBeChordLyricsPair('G             ', 'wisdom, let it ');
    expect(line1Items[2]).toBeChordLyricsPair('F ', 'be');
    expect(line1Items[3]).toBeChordLyricsPair('C/E', '');
    expect(line1Items[4]).toBeChordLyricsPair('Dm', '');
    expect(line1Items[5]).toBeChordLyricsPair('C', '');
  });
});
