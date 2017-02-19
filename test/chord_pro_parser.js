import expect from 'expect';
import './matchers';
import ChordProParser from '../lib/parser/chord_pro_parser';

const chordSheet = `
{title: Let it be}
{Chorus}

Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
[C]Whisper words of [G]wisdom, let it [F]be [C/E] [Dm] [C]`.substring(1);

describe('ChordProParser', () => {
  it('parses a ChordPro chord sheet correctly', () => {
    const parser = new ChordProParser();
    const song = parser.parse(chordSheet);
    const lines = song.lines;

    expect(lines.length).toEqual(5);

    expect(lines[0].items.length).toEqual(1);
    expect(lines[0].items[0]).toBeTag('title', 'Let it be');

    expect(lines[1].items.length).toEqual(1);
    expect(lines[1].items[0]).toBeTag('Chorus', '');

    expect(lines[2].items.length).toEqual(0);

    const line3Items = lines[3].items;
    expect(line3Items[0]).toBeItem('', 'Let it ');
    expect(line3Items[1]).toBeItem('Am', 'be, let it ');
    expect(line3Items[2]).toBeItem('C/G', 'be, let it ');
    expect(line3Items[3]).toBeItem('F', 'be, let it ');
    expect(line3Items[4]).toBeItem('C', 'be');

    const lines4Items = lines[4].items;
    expect(lines4Items[0]).toBeItem('C', 'Whisper words of ');
    expect(lines4Items[1]).toBeItem('G', 'wisdom, let it ');
    expect(lines4Items[2]).toBeItem('F', 'be ');
    expect(lines4Items[3]).toBeItem('C/E', ' ');
    expect(lines4Items[4]).toBeItem('Dm', ' ');
    expect(lines4Items[5]).toBeItem('C', '');
  });
});
