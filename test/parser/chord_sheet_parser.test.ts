import { ChordSheetParser } from '../../src';

import '../matchers';

const chordSheet = `
       Am         C/G        F          C
Let it be, let it be, let it be, let it be
C                F  G           F  C/E Dm C
Whisper words of wisdom, let it be`.substring(1);

describe('ChordSheetParser', () => {
  it('parses a regular chord sheet correctly', () => {
    const parser = new ChordSheetParser();
    const song = parser.parse(chordSheet);
    const { lines } = song;

    expect(lines.length).toEqual(2);

    const line0Items = lines[0].items;
    expect(line0Items[0]).toBeChordLyricsPair('      ', 'Let it ');
    expect(line0Items[1]).toBeChordLyricsPair('Am        ', 'be, let it ');
    expect(line0Items[2]).toBeChordLyricsPair('C/G       ', 'be, let it ');
    expect(line0Items[3]).toBeChordLyricsPair('F         ', 'be, let it ');
    expect(line0Items[4]).toBeChordLyricsPair('C', 'be');

    const line1Items = lines[1].items;
    expect(line1Items[0]).toBeChordLyricsPair('C               ', 'Whisper words of ');
    expect(line1Items[1]).toBeChordLyricsPair('F ', 'wis');
    expect(line1Items[2]).toBeChordLyricsPair('G          ', 'dom, let it ');
    expect(line1Items[3]).toBeChordLyricsPair('F ', 'be');
    expect(line1Items[4]).toBeChordLyricsPair('C/E', '');
    expect(line1Items[5]).toBeChordLyricsPair('Dm', '');
    expect(line1Items[6]).toBeChordLyricsPair('C', '');
  });

  it('groups lines by paragraph', () => {
    const chordSheetWithParagraphs = `
       Am         C/G        F          C
Let it be, let it be, let it be, let it be
C                F  G           F  C/E Dm C
Whisper words of wisdom, let it be

Am               Bb             F  C
Whisper words of wisdom, let it be`.substring(1);

    const parser = new ChordSheetParser();
    const song = parser.parse(chordSheetWithParagraphs);
    const { paragraphs } = song;

    const paragraph0Lines = paragraphs[0].lines;

    const paragraph0Line0Items = paragraph0Lines[0].items;
    expect(paragraph0Line0Items[0]).toBeChordLyricsPair('      ', 'Let it ');
    expect(paragraph0Line0Items[1]).toBeChordLyricsPair('Am        ', 'be, let it ');
    expect(paragraph0Line0Items[2]).toBeChordLyricsPair('C/G       ', 'be, let it ');
    expect(paragraph0Line0Items[3]).toBeChordLyricsPair('F         ', 'be, let it ');
    expect(paragraph0Line0Items[4]).toBeChordLyricsPair('C', 'be');

    const paragraph0Line1Items = paragraph0Lines[1].items;
    expect(paragraph0Line1Items[0]).toBeChordLyricsPair('C               ', 'Whisper words of ');
    expect(paragraph0Line1Items[1]).toBeChordLyricsPair('F ', 'wis');
    expect(paragraph0Line1Items[2]).toBeChordLyricsPair('G          ', 'dom, let it ');
    expect(paragraph0Line1Items[3]).toBeChordLyricsPair('F ', 'be');
    expect(paragraph0Line1Items[4]).toBeChordLyricsPair('C/E', '');
    expect(paragraph0Line1Items[5]).toBeChordLyricsPair('Dm', '');
    expect(paragraph0Line1Items[6]).toBeChordLyricsPair('C', '');

    const paragraph1Line0Items = paragraphs[1].lines[0].items;
    expect(paragraph1Line0Items[0]).toBeChordLyricsPair('Am              ', 'Whisper words of ');
    expect(paragraph1Line0Items[1]).toBeChordLyricsPair('Bb            ', 'wisdom, let it ');
    expect(paragraph1Line0Items[2]).toBeChordLyricsPair('F ', 'be');
    expect(paragraph1Line0Items[3]).toBeChordLyricsPair('C', '');
  });

  describe('with option preserveWhitespace:true', () => {
    it('parses a regular chord sheet correctly', () => {
      const parser = new ChordSheetParser({ preserveWhitespace: true });
      const song = parser.parse(chordSheet);
      const { lines } = song;

      expect(lines.length).toEqual(2);

      const line0Items = lines[0].items;
      expect(line0Items[0]).toBeChordLyricsPair('      ', 'Let it ');
      expect(line0Items[1]).toBeChordLyricsPair('Am        ', 'be, let it ');
      expect(line0Items[2]).toBeChordLyricsPair('C/G       ', 'be, let it ');
      expect(line0Items[3]).toBeChordLyricsPair('F         ', 'be, let it ');
      expect(line0Items[4]).toBeChordLyricsPair('C', 'be');

      const line1Items = lines[1].items;
      expect(line1Items[0]).toBeChordLyricsPair('C               ', 'Whisper words of ');
      expect(line1Items[1]).toBeChordLyricsPair('F ', 'wis');
      expect(line1Items[2]).toBeChordLyricsPair('G          ', 'dom, let it ');
      expect(line1Items[3]).toBeChordLyricsPair('F ', 'be');
      expect(line1Items[4]).toBeChordLyricsPair('C/E', '');
      expect(line1Items[5]).toBeChordLyricsPair('Dm', '');
      expect(line1Items[6]).toBeChordLyricsPair('C', '');
    });
  });

  describe('with option preserveWhitespace:false', () => {
    it('parses a regular chord sheet correctly', () => {
      const parser = new ChordSheetParser({ preserveWhitespace: false });
      const song = parser.parse(chordSheet);
      const { lines } = song;

      expect(lines.length).toEqual(2);

      const line0Items = lines[0].items;
      expect(line0Items[0]).toBeChordLyricsPair('', 'Let it ');
      expect(line0Items[1]).toBeChordLyricsPair('Am', 'be, let it ');
      expect(line0Items[2]).toBeChordLyricsPair('C/G', 'be, let it ');
      expect(line0Items[3]).toBeChordLyricsPair('F', 'be, let it ');
      expect(line0Items[4]).toBeChordLyricsPair('C', 'be');

      const line1Items = lines[1].items;
      expect(line1Items[0]).toBeChordLyricsPair('C', 'Whisper words of ');
      expect(line1Items[1]).toBeChordLyricsPair('F', 'wis');
      expect(line1Items[2]).toBeChordLyricsPair('G', 'dom, let it ');
      expect(line1Items[3]).toBeChordLyricsPair('F', 'be');
      expect(line1Items[4]).toBeChordLyricsPair('C/E', '');
      expect(line1Items[5]).toBeChordLyricsPair('Dm', '');
      expect(line1Items[6]).toBeChordLyricsPair('C', '');
    });
  });
});
