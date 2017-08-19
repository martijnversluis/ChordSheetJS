import expect from 'expect';
import '../matchers';
import ChordProParser from '../../src/parser/chord_pro_parser';

const chordSheet = `
{title: Let it be}
{subtitle: ChordSheetJS example version}
{Chorus}

Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
[C]Whisper words of [G]wisdom, let it [F]be [C/E] [Dm] [C]`.substring(1);

describe('ChordProParser', () => {
  it('parses a ChordPro chord sheet correctly', () => {
    const song = new ChordProParser().parse(chordSheet);
    const lines = song.lines;

    expect(lines.length).toEqual(4);

    expect(lines[0].chordLyricsPairs.length).toEqual(1);
    expect(lines[0].chordLyricsPairs[0]).toBeTag('Chorus', '');

    expect(lines[1].chordLyricsPairs.length).toEqual(0);

    const line2Pairs = lines[2].chordLyricsPairs;
    expect(line2Pairs[0]).toBeChordLyricsPair('', 'Let it ');
    expect(line2Pairs[1]).toBeChordLyricsPair('Am', 'be, let it ');
    expect(line2Pairs[2]).toBeChordLyricsPair('C/G', 'be, let it ');
    expect(line2Pairs[3]).toBeChordLyricsPair('F', 'be, let it ');
    expect(line2Pairs[4]).toBeChordLyricsPair('C', 'be');

    const lines3Pairs = lines[3].chordLyricsPairs;
    expect(lines3Pairs[0]).toBeChordLyricsPair('C', 'Whisper words of ');
    expect(lines3Pairs[1]).toBeChordLyricsPair('G', 'wisdom, let it ');
    expect(lines3Pairs[2]).toBeChordLyricsPair('F', 'be ');
    expect(lines3Pairs[3]).toBeChordLyricsPair('C/E', ' ');
    expect(lines3Pairs[4]).toBeChordLyricsPair('Dm', ' ');
    expect(lines3Pairs[5]).toBeChordLyricsPair('C', '');
  });

  it('parses meta data', () => {
    const song = new ChordProParser().parse(chordSheet);

    expect(song.title).toEqual('Let it be');
    expect(song.subtitle).toEqual('ChordSheetJS example version');
  });

  it('ignores comments', () => {
    const chordSheetWithComment = "# this is a comment\nLet it [Am]be, let it [C/G]be";
    const song = new ChordProParser().parse(chordSheetWithComment);

    expect(song.lines.length).toEqual(1);
  });
});
