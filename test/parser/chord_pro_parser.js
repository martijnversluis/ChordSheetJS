import { expect } from 'chai';

import '../matchers';
import ChordProParser from '../../src/parser/chord_pro_parser';

const chordSheet = `
{title: Let it be}
{subtitle: ChordSheetJS example version}
{Chorus}

Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
[C]Whisper words of [F]wis[G]dom, let it [F]be [C/E] [Dm] [C]`.substring(1);

describe('ChordProParser', () => {
  it('parses a ChordPro chord sheet correctly', () => {
    const song = new ChordProParser().parse(chordSheet);
    const lines = song.lines;

    expect(lines.length).to.equal(6);

    expect(lines[0].items.length).to.equal(1);
    expect(lines[0].items[0]).to.be.tag('title', 'Let it be');

    expect(lines[1].items.length).to.equal(1);
    expect(lines[1].items[0]).to.be.tag('subtitle', 'ChordSheetJS example version');

    expect(lines[2].items.length).to.equal(1);
    expect(lines[2].items[0]).to.be.tag('Chorus', null);

    expect(lines[3].items.length).to.equal(0);

    const line4Pairs = lines[4].items;
    expect(line4Pairs[0]).to.be.chordLyricsPair('', 'Let it ');
    expect(line4Pairs[1]).to.be.chordLyricsPair('Am', 'be, let it ');
    expect(line4Pairs[2]).to.be.chordLyricsPair('C/G', 'be, let it ');
    expect(line4Pairs[3]).to.be.chordLyricsPair('F', 'be, let it ');
    expect(line4Pairs[4]).to.be.chordLyricsPair('C', 'be');

    const lines5Pairs = lines[5].items;
    expect(lines5Pairs[0]).to.be.chordLyricsPair('C', 'Whisper words of ');
    expect(lines5Pairs[1]).to.be.chordLyricsPair('F', 'wis');
    expect(lines5Pairs[2]).to.be.chordLyricsPair('G', 'dom, let it ');
    expect(lines5Pairs[3]).to.be.chordLyricsPair('F', 'be ');
    expect(lines5Pairs[4]).to.be.chordLyricsPair('C/E', ' ');
    expect(lines5Pairs[5]).to.be.chordLyricsPair('Dm', ' ');
    expect(lines5Pairs[6]).to.be.chordLyricsPair('C', '');
  });

  it('parses meta data', () => {
    const song = new ChordProParser().parse(chordSheet);

    expect(song.title).to.equal('Let it be');
    expect(song.subtitle).to.equal('ChordSheetJS example version');
  });

  it('ignores comments', () => {
    const chordSheetWithComment = '# this is a comment\nLet it [Am]be, let it [C/G]be';
    const song = new ChordProParser().parse(chordSheetWithComment);

    expect(song.lines.length).to.equal(1);
  });
});
