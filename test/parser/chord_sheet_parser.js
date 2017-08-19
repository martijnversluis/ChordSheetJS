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

    const line0Pairs = lines[0].chordLyricsPairs;
    expect(line0Pairs[0]).toBeChordLyricsPair('', 'Let it ');
    expect(line0Pairs[1]).toBeChordLyricsPair('Am', 'be, let it ');
    expect(line0Pairs[2]).toBeChordLyricsPair('C/G', 'be, let it ');
    expect(line0Pairs[3]).toBeChordLyricsPair('F', 'be, let it ');
    expect(line0Pairs[4]).toBeChordLyricsPair('C', 'be');

    const line1Pairs = lines[1].chordLyricsPairs;
    expect(line1Pairs[0]).toBeChordLyricsPair('C', 'Whisper words of ');
    expect(line1Pairs[1]).toBeChordLyricsPair('G', 'wisdom, let it ');
    expect(line1Pairs[2]).toBeChordLyricsPair('F', 'be');
    expect(line1Pairs[3]).toBeChordLyricsPair('C/E', '');
    expect(line1Pairs[4]).toBeChordLyricsPair('Dm', '');
    expect(line1Pairs[5]).toBeChordLyricsPair('C', '');
  });
});
