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

    expect(lines[0].items.length).toEqual(1);
    expect(lines[0].items[0]).toBeTag('Chorus', '');

    expect(lines[1].items.length).toEqual(0);

    const line2Items = lines[2].items;
    expect(line2Items[0]).toBeItem('', 'Let it ');
    expect(line2Items[1]).toBeItem('Am', 'be, let it ');
    expect(line2Items[2]).toBeItem('C/G', 'be, let it ');
    expect(line2Items[3]).toBeItem('F', 'be, let it ');
    expect(line2Items[4]).toBeItem('C', 'be');

    const lines3Items = lines[3].items;
    expect(lines3Items[0]).toBeItem('C', 'Whisper words of ');
    expect(lines3Items[1]).toBeItem('G', 'wisdom, let it ');
    expect(lines3Items[2]).toBeItem('F', 'be ');
    expect(lines3Items[3]).toBeItem('C/E', ' ');
    expect(lines3Items[4]).toBeItem('Dm', ' ');
    expect(lines3Items[5]).toBeItem('C', '');
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
