import '../matchers';
import ChordProParser from '../../src/parser/chord_pro_parser';
import { CHORUS, NONE, VERSE } from '../../src/constants';

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

    expect(lines.length).toEqual(6);

    expect(lines[0].items.length).toEqual(1);
    expect(lines[0].items[0]).toBeTag('title', 'Let it be');

    expect(lines[1].items.length).toEqual(1);
    expect(lines[1].items[0]).toBeTag('subtitle', 'ChordSheetJS example version');

    expect(lines[2].items.length).toEqual(1);
    expect(lines[2].items[0]).toBeTag('Chorus', null);

    expect(lines[3].items.length).toEqual(0);

    const line4Pairs = lines[4].items;
    expect(line4Pairs[0]).toBeChordLyricsPair('', 'Let it ');
    expect(line4Pairs[1]).toBeChordLyricsPair('Am', 'be, let it ');
    expect(line4Pairs[2]).toBeChordLyricsPair('C/G', 'be, let it ');
    expect(line4Pairs[3]).toBeChordLyricsPair('F', 'be, let it ');
    expect(line4Pairs[4]).toBeChordLyricsPair('C', 'be');

    const lines5Pairs = lines[5].items;
    expect(lines5Pairs[0]).toBeChordLyricsPair('C', 'Whisper words of ');
    expect(lines5Pairs[1]).toBeChordLyricsPair('F', 'wis');
    expect(lines5Pairs[2]).toBeChordLyricsPair('G', 'dom, let it ');
    expect(lines5Pairs[3]).toBeChordLyricsPair('F', 'be ');
    expect(lines5Pairs[4]).toBeChordLyricsPair('C/E', ' ');
    expect(lines5Pairs[5]).toBeChordLyricsPair('Dm', ' ');
    expect(lines5Pairs[6]).toBeChordLyricsPair('C', '');
  });

  it('parses meta data', () => {
    const song = new ChordProParser().parse(chordSheet);

    expect(song.title).toEqual('Let it be');
    expect(song.subtitle).toEqual('ChordSheetJS example version');
  });

  it('parses custom meta data', () => {
    const chordSheetWithCustomMetaData = `
      {x_one_directive: Foo}
      {x_other_directive: Bar}
    `;

    const song = new ChordProParser().parse(chordSheetWithCustomMetaData);

    expect(song.metadata.x_one_directive).toEqual('Foo');
    expect(song.metadata.x_other_directive).toEqual('Bar');
  });

  it('can have multiple values for a meta directive', () => {
    const chordSheetWithMultipleComposers = `
      {composer: John}
      {composer: Jane}
    `;

    const song = new ChordProParser().parse(chordSheetWithMultipleComposers);

    expect(song.composer).toEqual(['John', 'Jane']);
  });

  it('ignores comments', () => {
    const chordSheetWithComment = '# this is a comment\nLet it [Am]be, let it [C/G]be';
    const song = new ChordProParser().parse(chordSheetWithComment);

    expect(song.lines.length).toEqual(1);
  });

  it('groups lines by paragraph', () => {
    const chordSheetWithParagraphs = `
Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
[C]Whisper words of [F]wis[G]dom, let it [F]be [C/E] [Dm] [C]

[Am]Whisper words of [Bb]wisdom, let it [F]be [C]`.substring(1);

    const parser = new ChordProParser();
    const song = parser.parse(chordSheetWithParagraphs);
    const paragraphs = song.paragraphs;

    const paragraph0Lines = paragraphs[0].lines;

    const paragraph0Line0Items = paragraph0Lines[0].items;
    expect(paragraph0Line0Items[0]).toBeChordLyricsPair('', 'Let it ');
    expect(paragraph0Line0Items[1]).toBeChordLyricsPair('Am', 'be, let it ');
    expect(paragraph0Line0Items[2]).toBeChordLyricsPair('C/G', 'be, let it ');
    expect(paragraph0Line0Items[3]).toBeChordLyricsPair('F', 'be, let it ');
    expect(paragraph0Line0Items[4]).toBeChordLyricsPair('C', 'be');

    const paragraph0Line1Items = paragraph0Lines[1].items;
    expect(paragraph0Line1Items[0]).toBeChordLyricsPair('C', 'Whisper words of ');
    expect(paragraph0Line1Items[1]).toBeChordLyricsPair('F', 'wis');
    expect(paragraph0Line1Items[2]).toBeChordLyricsPair('G', 'dom, let it ');
    expect(paragraph0Line1Items[3]).toBeChordLyricsPair('F', 'be ');
    expect(paragraph0Line1Items[4]).toBeChordLyricsPair('C/E', ' ');
    expect(paragraph0Line1Items[5]).toBeChordLyricsPair('Dm', ' ');
    expect(paragraph0Line1Items[6]).toBeChordLyricsPair('C', '');

    const paragraph1Line0Items = paragraphs[1].lines[0].items;
    expect(paragraph1Line0Items[0]).toBeChordLyricsPair('Am', 'Whisper words of ');
    expect(paragraph1Line0Items[1]).toBeChordLyricsPair('Bb', 'wisdom, let it ');
    expect(paragraph1Line0Items[2]).toBeChordLyricsPair('F', 'be ');
    expect(paragraph1Line0Items[3]).toBeChordLyricsPair('C', '');
  });

  it('adds the type to lines', () => {
    const markedChordSheet = `
{start_of_verse}
Let it [Am]be
{end_of_verse}
C]Whisper words of [F]wis[G]dom
{start_of_chorus}
Let it [F]be [C]
{end_of_chorus}`.substring(1);

    const parser = new ChordProParser();
    const song = parser.parse(markedChordSheet);
    const lineTypes = song.lines.map(line => line.type);

    expect(lineTypes).toEqual([NONE, VERSE, NONE, NONE, NONE, CHORUS, NONE]);
    expect(parser.warnings).toHaveLength(0);
  });

  describe('when encountering {end_of_chorus} while the current section type is not chorus', () => {
    it('adds a parser warning', () => {
      const invalidChordSheet = '{end_of_chorus}';

      const parser = new ChordProParser();
      parser.parse(invalidChordSheet);

      expect(parser.warnings).toHaveLength(1);
      expect(parser.warnings[0].toString()).toMatch(/unexpected.+end_of_chorus.+current.+none.+line 1/i);
    });
  });

  describe('when encountering {end_of_verse} while the current section type is not verse', () => {
    it('adds a parser warning', () => {
      const invalidChordSheet = '{end_of_verse}';

      const parser = new ChordProParser();
      parser.parse(invalidChordSheet);

      expect(parser.warnings).toHaveLength(1);
      expect(parser.warnings[0].toString()).toMatch(/unexpected.+end_of_verse.+current.+none.+line 1/i);
    });
  });

  describe('when encountering {start_of_chorus} while the current section type is not none', () => {
    it('adds a parser warning', () => {
      const invalidChordSheet = '{start_of_verse}\n{start_of_chorus}';

      const parser = new ChordProParser();
      parser.parse(invalidChordSheet);

      expect(parser.warnings).toHaveLength(1);
      expect(parser.warnings[0].toString()).toMatch(/unexpected.+start_of_chorus.+current.+verse.+line 2/i);
    });
  });

  describe('when encountering {start_of_chorus} while the current section type is not none', () => {
    it('adds a parser warning', () => {
      const invalidChordSheet = '{start_of_chorus}\n{start_of_verse}';

      const parser = new ChordProParser();
      parser.parse(invalidChordSheet);

      expect(parser.warnings).toHaveLength(1);
      expect(parser.warnings[0].toString()).toMatch(/unexpected.+start_of_verse.+current.+chorus.+line 2/i);
    });
  });
});
