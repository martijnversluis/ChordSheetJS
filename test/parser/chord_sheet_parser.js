import { expect } from 'chai';

import '../matchers';
import ChordSheetParser from '../../src/parser/chord_sheet_parser';

const chordSheet = `
       Am         C/G        F          C
Let it be, let it be, let it be, let it be
C                F  G           F  C/E Dm C
Whisper words of wisdom, let it be`.substring(1);

describe('ChordSheetParser', () => {
  it('parses a regular chord sheet correctly', () => {
    const parser = new ChordSheetParser();
    const song = parser.parse(chordSheet);
    const lines = song.lines;

    expect(lines.length).to.equal(2);

    const line0Items = lines[0].items;
    expect(line0Items[0]).to.be.chordLyricsPair('      ', 'Let it ');
    expect(line0Items[1]).to.be.chordLyricsPair('Am        ', 'be, let it ');
    expect(line0Items[2]).to.be.chordLyricsPair('C/G       ', 'be, let it ');
    expect(line0Items[3]).to.be.chordLyricsPair('F         ', 'be, let it ');
    expect(line0Items[4]).to.be.chordLyricsPair('C', 'be');

    const line1Items = lines[1].items;
    expect(line1Items[0]).to.be.chordLyricsPair('C               ', 'Whisper words of ');
    expect(line1Items[1]).to.be.chordLyricsPair('F ', 'wis');
    expect(line1Items[2]).to.be.chordLyricsPair('G          ', 'dom, let it ');
    expect(line1Items[3]).to.be.chordLyricsPair('F ', 'be');
    expect(line1Items[4]).to.be.chordLyricsPair('C/E', '');
    expect(line1Items[5]).to.be.chordLyricsPair('Dm', '');
    expect(line1Items[6]).to.be.chordLyricsPair('C', '');
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
    const paragraphs = song.paragraphs;

    const paragraph0Lines = paragraphs[0].lines;

    const paragraph0Line0Items = paragraph0Lines[0].items;
    expect(paragraph0Line0Items[0]).to.be.chordLyricsPair('      ', 'Let it ');
    expect(paragraph0Line0Items[1]).to.be.chordLyricsPair('Am        ', 'be, let it ');
    expect(paragraph0Line0Items[2]).to.be.chordLyricsPair('C/G       ', 'be, let it ');
    expect(paragraph0Line0Items[3]).to.be.chordLyricsPair('F         ', 'be, let it ');
    expect(paragraph0Line0Items[4]).to.be.chordLyricsPair('C', 'be');

    const paragraph0Line1Items = paragraph0Lines[1].items;
    expect(paragraph0Line1Items[0]).to.be.chordLyricsPair('C               ', 'Whisper words of ');
    expect(paragraph0Line1Items[1]).to.be.chordLyricsPair('F ', 'wis');
    expect(paragraph0Line1Items[2]).to.be.chordLyricsPair('G          ', 'dom, let it ');
    expect(paragraph0Line1Items[3]).to.be.chordLyricsPair('F ', 'be');
    expect(paragraph0Line1Items[4]).to.be.chordLyricsPair('C/E', '');
    expect(paragraph0Line1Items[5]).to.be.chordLyricsPair('Dm', '');
    expect(paragraph0Line1Items[6]).to.be.chordLyricsPair('C', '');

    const paragraph1Line0Items = paragraphs[1].lines[0].items;
    expect(paragraph1Line0Items[0]).to.be.chordLyricsPair('Am              ', 'Whisper words of ');
    expect(paragraph1Line0Items[1]).to.be.chordLyricsPair('Bb            ', 'wisdom, let it ');
    expect(paragraph1Line0Items[2]).to.be.chordLyricsPair('F ', 'be');
    expect(paragraph1Line0Items[3]).to.be.chordLyricsPair('C', '');
  });

  context('with option preserveWhitespace:true', () => {
    it('parses a regular chord sheet correctly', () => {
      const parser = new ChordSheetParser({ preserveWhitespace: true });
      const song = parser.parse(chordSheet);
      const lines = song.lines;

      expect(lines.length).to.equal(2);

      const line0Items = lines[0].items;
      expect(line0Items[0]).to.be.chordLyricsPair('      ', 'Let it ');
      expect(line0Items[1]).to.be.chordLyricsPair('Am        ', 'be, let it ');
      expect(line0Items[2]).to.be.chordLyricsPair('C/G       ', 'be, let it ');
      expect(line0Items[3]).to.be.chordLyricsPair('F         ', 'be, let it ');
      expect(line0Items[4]).to.be.chordLyricsPair('C', 'be');

      const line1Items = lines[1].items;
      expect(line1Items[0]).to.be.chordLyricsPair('C               ', 'Whisper words of ');
      expect(line1Items[1]).to.be.chordLyricsPair('F ', 'wis');
      expect(line1Items[2]).to.be.chordLyricsPair('G          ', 'dom, let it ');
      expect(line1Items[3]).to.be.chordLyricsPair('F ', 'be');
      expect(line1Items[4]).to.be.chordLyricsPair('C/E', '');
      expect(line1Items[5]).to.be.chordLyricsPair('Dm', '');
      expect(line1Items[6]).to.be.chordLyricsPair('C', '');
    });
  });

  context('with option preserveWhitespace:false', () => {
    it('parses a regular chord sheet correctly', () => {
      const parser = new ChordSheetParser({ preserveWhitespace: false });
      const song = parser.parse(chordSheet);
      const lines = song.lines;

      expect(lines.length).to.equal(2);

      const line0Items = lines[0].items;
      expect(line0Items[0]).to.be.chordLyricsPair('', 'Let it ');
      expect(line0Items[1]).to.be.chordLyricsPair('Am', 'be, let it ');
      expect(line0Items[2]).to.be.chordLyricsPair('C/G', 'be, let it ');
      expect(line0Items[3]).to.be.chordLyricsPair('F', 'be, let it ');
      expect(line0Items[4]).to.be.chordLyricsPair('C', 'be');

      const line1Items = lines[1].items;
      expect(line1Items[0]).to.be.chordLyricsPair('C', 'Whisper words of ');
      expect(line1Items[1]).to.be.chordLyricsPair('F', 'wis');
      expect(line1Items[2]).to.be.chordLyricsPair('G', 'dom, let it ');
      expect(line1Items[3]).to.be.chordLyricsPair('F', 'be');
      expect(line1Items[4]).to.be.chordLyricsPair('C/E', '');
      expect(line1Items[5]).to.be.chordLyricsPair('Dm', '');
      expect(line1Items[6]).to.be.chordLyricsPair('C', '');
    });
  });
});
