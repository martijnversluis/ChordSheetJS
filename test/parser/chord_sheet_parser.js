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
    expect(line0Items[0]).toBeItem('', 'Let it ');
    expect(line0Items[1]).toBeItem('Am', 'be, let it ');
    expect(line0Items[2]).toBeItem('C/G', 'be, let it ');
    expect(line0Items[3]).toBeItem('F', 'be, let it ');
    expect(line0Items[4]).toBeItem('C', 'be');

    const lines1Items = lines[1].items;
    expect(lines1Items[0]).toBeItem('C', 'Whisper words of ');
    expect(lines1Items[1]).toBeItem('G', 'wisdom, let it ');
    expect(lines1Items[2]).toBeItem('F', 'be');
    expect(lines1Items[3]).toBeItem('C/E', '');
    expect(lines1Items[4]).toBeItem('Dm', '');
    expect(lines1Items[5]).toBeItem('C', '');
  });
});
