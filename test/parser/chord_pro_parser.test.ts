import '../matchers';

import { PART } from '../../src/constants';
import { heredoc } from '../utilities';

import {
  ABC,
  CHORUS,
  ChordProParser,
  LILYPOND,
  NONE,
  TAB,
  Tag,
  Ternary,
  VERSE,
} from '../../src';

describe('ChordProParser', () => {
  it('parses a ChordPro chord sheet correctly', () => {
    const chordSheet = heredoc`
      {title: Let it be}
      {subtitle: ChordSheetJS example version}
      {Chorus}

      Let it [Am]be, let it [C/A][C/G#]be, let it [F]be, let it [C]be
      [C]Whisper words of [F]wis[G]dom, let it [F]be [C/E] [Dm] [C]`;

    const song = new ChordProParser().parse(chordSheet);
    const { lines } = song;

    expect(lines.length).toEqual(6);

    expect(lines[0].items.length).toEqual(1);
    expect(lines[0].items[0]).toBeTag('title', 'Let it be');

    expect(lines[1].items.length).toEqual(1);
    expect(lines[1].items[0]).toBeTag('subtitle', 'ChordSheetJS example version');

    expect(lines[2].items.length).toEqual(1);
    expect(lines[2].items[0]).toBeTag('Chorus', '');

    expect(lines[3].items.length).toEqual(0);

    const line4Pairs = lines[4].items;
    expect(line4Pairs[0]).toBeChordLyricsPair('', 'Let it ');
    expect(line4Pairs[1]).toBeChordLyricsPair('Am', 'be, ');
    expect(line4Pairs[2]).toBeChordLyricsPair('', 'let it ');
    expect(line4Pairs[3]).toBeChordLyricsPair('C/A', '');
    expect(line4Pairs[4]).toBeChordLyricsPair('C/G#', 'be, ');
    expect(line4Pairs[5]).toBeChordLyricsPair('', 'let it ');
    expect(line4Pairs[6]).toBeChordLyricsPair('F', 'be, ');
    expect(line4Pairs[7]).toBeChordLyricsPair('', 'let it ');
    expect(line4Pairs[8]).toBeChordLyricsPair('C', 'be');

    const lines5Pairs = lines[5].items;
    expect(lines5Pairs[0]).toBeChordLyricsPair('C', 'Whisper ');
    expect(lines5Pairs[1]).toBeChordLyricsPair('', 'words of ');
    expect(lines5Pairs[2]).toBeChordLyricsPair('F', 'wis');
    expect(lines5Pairs[3]).toBeChordLyricsPair('G', 'dom, ');
    expect(lines5Pairs[4]).toBeChordLyricsPair('', 'let it ');
    expect(lines5Pairs[5]).toBeChordLyricsPair('F', 'be ');
    expect(lines5Pairs[6]).toBeChordLyricsPair('C/E', ' ');
    expect(lines5Pairs[7]).toBeChordLyricsPair('Dm', ' ');
    expect(lines5Pairs[8]).toBeChordLyricsPair('C', '');
  });

  it('correctly parses a directive with special characters', () => {
    const chordSheet = '{comment: Intro [Dm7] [F6/B] [Cmaj7] }';
    const song = new ChordProParser().parse(chordSheet);

    expect(song.lines[0].items[0]).toBeTag('comment', 'Intro [Dm7] [F6/B] [Cmaj7]');
  });

  it('correctly parses a directive containing curly brackets', () => {
    const chordSheet = '{comment: Some {comment\\} }';
    const song = new ChordProParser().parse(chordSheet);

    expect(song.lines[0].items[0]).toBeTag('comment', 'Some {comment}');
  });

  it('correctly parses multiple whitespace characters', () => {
    const chordSheet = '[C]Let it be         ';
    const song = new ChordProParser().parse(chordSheet);
    const { items } = song.lines[0];

    expect(items[0]).toBeChordLyricsPair('C', 'Let ');
    expect(items[1]).toBeChordLyricsPair('', 'it be         ');
  });

  it('correctly parses percent characters in lyrics', () => {
    const chordSheet = '[C]Let it be [Am]100%';
    const song = new ChordProParser().parse(chordSheet);
    const { items } = song.lines[0];

    expect(items[0]).toBeChordLyricsPair('C', 'Let ');
    expect(items[1]).toBeChordLyricsPair('', 'it be ');
    expect(items[2]).toBeChordLyricsPair('Am', '100%');
  });

  it('parses directive with empty value', () => {
    const song = new ChordProParser().parse('{c: }');
    expect(song.lines[0].items[0]).toBeTag('comment', '');
  });

  it('parses directive with trailing space', () => {
    const song = new ChordProParser().parse('{key: C}   ');
    expect(song.lines[0].items[0]).toBeTag('key', 'C');
  });

  it('parses meta data', () => {
    const chordSheet = heredoc`
      {title: Let it be}
      {subtitle: ChordSheetJS example version}`;

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

    expect(song.metadata.get('x_one_directive')).toEqual('Foo');
    expect(song.metadata.get('x_other_directive')).toEqual('Bar');
  });

  it('parses directives with attributes', () => {
    const chordSheet = '{start_of_verse: label="Verse 1"}';
    const song = new ChordProParser().parse(chordSheet);
    const tag = song.lines[0].items[0] as Tag;

    expect(tag.name).toEqual('start_of_verse');
    expect(tag.attributes).toEqual({ label: 'Verse 1' });
  });

  it('parses meta directives', () => {
    const chordSheetWithCustomMetaData = `
      {meta: one_directive Foo}
      {meta: other_directive Bar}
    `;

    const song = new ChordProParser().parse(chordSheetWithCustomMetaData);

    expect(song.metadata.get('one_directive')).toEqual('Foo');
    expect(song.metadata.get('other_directive')).toEqual('Bar');
  });

  it('can have multiple values for a meta directive', () => {
    const chordSheetWithMultipleComposers = `
      {composer: John}
      {composer: Jane}
    `;

    const song = new ChordProParser().parse(chordSheetWithMultipleComposers);

    expect(song.composer).toEqual(['John', 'Jane']);
  });

  it('correctly parses comments', () => {
    const chordSheetWithComment = '# this is a comment\nLet it [Am]be, let it [C/G]be';
    const song = new ChordProParser().parse(chordSheetWithComment);

    const line1Items = song.lines[0].items;
    expect(line1Items.length).toEqual(1);
    expect(line1Items[0]).toBeComment(' this is a comment');
    expect(song.lines.length).toEqual(2);
  });

  it('groups lines by paragraph', () => {
    const chordSheetWithParagraphs = heredoc`
      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
      [C]Whisper words of [F]wis[G]dom, let it [F]be [C/E] [Dm] [C]

      [Am]Whisper words of [Bb]wisdom, let it [F]be [C]`;

    const parser = new ChordProParser();
    const song = parser.parse(chordSheetWithParagraphs);
    const { paragraphs } = song;

    const paragraph0Lines = paragraphs[0].lines;

    const paragraph0Line0Items = paragraph0Lines[0].items;
    expect(paragraph0Line0Items[0]).toBeChordLyricsPair('', 'Let it ');
    expect(paragraph0Line0Items[1]).toBeChordLyricsPair('Am', 'be, ');
    expect(paragraph0Line0Items[2]).toBeChordLyricsPair('', 'let it ');
    expect(paragraph0Line0Items[3]).toBeChordLyricsPair('C/G', 'be, ');
    expect(paragraph0Line0Items[4]).toBeChordLyricsPair('', 'let it ');
    expect(paragraph0Line0Items[5]).toBeChordLyricsPair('F', 'be, ');
    expect(paragraph0Line0Items[6]).toBeChordLyricsPair('', 'let it ');
    expect(paragraph0Line0Items[7]).toBeChordLyricsPair('C', 'be');

    const paragraph0Line1Items = paragraph0Lines[1].items;
    expect(paragraph0Line1Items[0]).toBeChordLyricsPair('C', 'Whisper ');
    expect(paragraph0Line1Items[1]).toBeChordLyricsPair('', 'words of ');
    expect(paragraph0Line1Items[2]).toBeChordLyricsPair('F', 'wis');
    expect(paragraph0Line1Items[3]).toBeChordLyricsPair('G', 'dom, ');
    expect(paragraph0Line1Items[4]).toBeChordLyricsPair('', 'let it ');
    expect(paragraph0Line1Items[5]).toBeChordLyricsPair('F', 'be ');
    expect(paragraph0Line1Items[6]).toBeChordLyricsPair('C/E', ' ');
    expect(paragraph0Line1Items[7]).toBeChordLyricsPair('Dm', ' ');
    expect(paragraph0Line1Items[8]).toBeChordLyricsPair('C', '');

    const paragraph1Line0Items = paragraphs[1].lines[0].items;
    expect(paragraph1Line0Items[0]).toBeChordLyricsPair('Am', 'Whisper ');
    expect(paragraph1Line0Items[1]).toBeChordLyricsPair('', 'words of ');
    expect(paragraph1Line0Items[2]).toBeChordLyricsPair('Bb', 'wisdom, ');
    expect(paragraph1Line0Items[3]).toBeChordLyricsPair('', 'let it ');
    expect(paragraph1Line0Items[4]).toBeChordLyricsPair('F', 'be ');
    expect(paragraph1Line0Items[5]).toBeChordLyricsPair('C', '');
  });

  it('adds the type to lines', () => {
    const markedChordSheet = heredoc`
      {start_of_verse}
      Let it [Am]be
      {end_of_verse}
      [C]Whisper words of [F]wis[G]dom
      {start_of_chorus}
      Let it [F]be [C]
      {end_of_chorus}
      {start_of_part}
      [Gm][F][/][/][|]
      {end_of_part}`;

    const parser = new ChordProParser();
    const song = parser.parse(markedChordSheet);
    const lineTypes = song.lines.map((line) => line.type);

    expect(lineTypes).toEqual([VERSE, VERSE, VERSE, NONE, CHORUS, CHORUS, CHORUS, PART, PART, PART]);
    expect(parser.warnings).toHaveLength(0);
  });

  it('supports custom section types', () => {
    const markedChordSheet = heredoc`
      {start_of_coda: Coda 1}
      Let it [Am]be
      {end_of_coda}
    `;

    const parser = new ChordProParser();
    const { lines } = parser.parse(markedChordSheet);
    expect(lines[0].type).toEqual('coda');
    expect(parser.warnings).toHaveLength(0);
  });

  it('is forgiving to unended custom sections', () => {
    const markedChordSheet = heredoc`
      {start_of_coda}
      Let it [Am]be

      {start_of_interlude}
      [C]Speaking words of [G]wisdom
    `;

    const parser = new ChordProParser();
    const { lines } = parser.parse(markedChordSheet);
    const lineTypes = lines.map((line) => line.type);
    expect(lineTypes).toEqual(['coda', 'coda', 'coda', 'interlude', 'interlude']);
    expect(parser.warnings).toHaveLength(1);
  });

  it('adds the transposeKey to lines', () => {
    const chordSheetWithTranspose = `
{key: A}

This part is [A]key

{transpose: 4}
This part is [C#]key

{transpose: D}
This part is [D]key
`.trim();

    const parser = new ChordProParser();
    const song = parser.parse(chordSheetWithTranspose);
    const keys = song.bodyParagraphs.map((paragraph) => paragraph.lines[0].transposeKey);

    expect(keys[0]).toBe(null);
    expect(keys[1]).toEqual('4');
    expect(keys[2]).toEqual('D');
  });

  it('adds the key to lines', () => {
    const chordSheetWithTranspose = `
{key: A}

This part is [A]key

{new_key: D}
This part is [D]key

{nk: G}
This part is [G]key
`.trim();

    const parser = new ChordProParser();
    const song = parser.parse(chordSheetWithTranspose);
    const keys = song.bodyParagraphs.map((paragraph) => paragraph.lines[0].key);

    expect(keys[0]).toBe('A');
    expect(keys[1]).toEqual('D');
    expect(keys[2]).toEqual('G');
  });

  it('adds the key & transposeKey to the same to lines', () => {
    const chordSheetWithTranspose = `
{key: A}

This part is [A]key

{transpose: 4}
{new_key: D}
This part is [D]key

{transpose: D}
{nk: G}
This part is [G]key
`.trim();

    const parser = new ChordProParser();
    const song = parser.parse(chordSheetWithTranspose);
    const keys = song.bodyParagraphs.map((paragraph) => paragraph.lines[0].key);
    const transposeKeys = song.bodyParagraphs.map((paragraph) => paragraph.lines[0].transposeKey);

    expect(keys[0]).toBe('A');
    expect(transposeKeys[1]).toEqual('4');
    expect(keys[1]).toEqual('D');
    expect(transposeKeys[2]).toEqual('D');
    expect(keys[2]).toEqual('G');
  });

  it('allows escaped special characters in tags', () => {
    const chordSheet = '{title: my \\{title\\}}';
    const song = new ChordProParser().parse(chordSheet);
    expect(song.title).toEqual('my {title}');
  });

  it('allows conditional directives', () => {
    const chordSheet = '{title-guitar: Guitar song}';
    const song = new ChordProParser().parse(chordSheet);

    const tag = song.lines[0].items[0] as Tag;

    expect(tag).toBeTag('title', 'Guitar song', 'guitar');
  });

  it('allows negated conditional directives', () => {
    const chordSheet = '{title-guitar!: Guitar song}';
    const song = new ChordProParser().parse(chordSheet);

    const tag = song.lines[0].items[0] as Tag;

    expect(tag).toBeTag('title', 'Guitar song', 'guitar');

    expect(tag.isNegated).toBe(true);
  });

  it('parses annotation', () => {
    const chordSheet = '[*Full band!]Let it be';
    const song = new ChordProParser().parse(chordSheet);

    expect(song.lines[0].items[0]).toBeChordLyricsPair('', 'Let it be', 'Full band!');
  });

  it('parses simple ternaries', () => {
    const chordSheet = '%{title}';
    const song = new ChordProParser().parse(chordSheet);
    const expression = song.lines[0].items[0];

    expect(expression).toBeTernary({
      variable: 'title',
      valueTest: null,
      trueExpression: [],
      falseExpression: [],
    });
  });

  it('parses ternaries with a self-referencing true expression', () => {
    const chordSheet = '%{artist|%{}}';
    const song = new ChordProParser().parse(chordSheet);
    const expression = song.lines[0].items[0] as Ternary;

    expect(expression).toBeTernary({
      variable: 'artist',
      valueTest: null,
      falseExpression: [],
    });

    expect(expression.trueExpression).toHaveLength(1);
    expect(expression.trueExpression[0]).toBeTernary({
      variable: null,
      valueTest: null,
      trueExpression: [],
      falseExpression: [],
    });
  });

  it('parses ternaries with value test', () => {
    const chordSheet = '%{artist=X|artist is X|artist is not X}';
    const song = new ChordProParser().parse(chordSheet);
    const expression = song.lines[0].items[0] as Ternary;

    expect(expression).toBeTernary({
      variable: 'artist',
      valueTest: 'X',
    });

    expect(expression.trueExpression).toHaveLength(1);
    expect(expression.trueExpression[0]).toBeLiteral('artist is X');
    expect(expression.falseExpression).toHaveLength(1);
    expect(expression.falseExpression[0]).toBeLiteral('artist is not X');
  });

  it('parses nested ternaries', () => {
    const chordSheet = '%{title|title is set and c is %{c|set|unset}|title is unset}';
    const song = new ChordProParser().parse(chordSheet);
    const expression = song.lines[0].items[0] as Ternary;

    expect(expression).toBeTernary({
      variable: 'title',
      valueTest: null,
    });

    expect(expression.trueExpression).toHaveLength(2);
    expect(expression.trueExpression[0]).toBeLiteral('title is set and c is ');
    expect(expression.trueExpression[1] as Ternary).toBeTernary({
      variable: 'c',
      valueTest: null,
    });

    expect((expression.trueExpression[1] as Ternary).trueExpression).toHaveLength(1);
    expect((expression.trueExpression[1] as Ternary).trueExpression[0]).toBeLiteral('set');

    expect((expression.trueExpression[1] as Ternary).falseExpression).toHaveLength(1);
    expect((expression.trueExpression[1] as Ternary).falseExpression[0]).toBeLiteral('unset');

    expect(expression.falseExpression).toHaveLength(1);
    expect(expression.falseExpression[0]).toBeLiteral('title is unset');
  });

  it('Allows unescaped pipe characters outside of meta expressions', () => {
    const chordSheet = '|: Let it be :|';
    const song = new ChordProParser().parse(chordSheet);

    expect(song.lines[0].items[0]).toBeChordLyricsPair('', '|: Let it be :|');
  });

  it('does not chop off the first word when chopFirstWord is false', () => {
    const chordSheet = '[Am]Whisper words of ';

    const parser = new ChordProParser();
    const song = parser.parse(chordSheet, { chopFirstWord: false });

    expect(song.lines[0].items[0]).toBeChordLyricsPair('Am', 'Whisper words of ');
  });

  describe('it is forgiving to syntax errors', () => {
    it('allows dangling ]', () => {
      const chordSheetWithError = `
Let it [Am]be
[C]Whisper wor]ds of [F]wis[G]dom`;

      expect(() => new ChordProParser().parse(chordSheetWithError)).not.toThrow();
    });

    it('allows dangling }', () => {
      const chordSheetWithError = `
Let it [Am]be
[C]Whisper wor}ds of [F]wis[G]dom`;

      expect(() => new ChordProParser().parse(chordSheetWithError)).not.toThrow();
    });
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

  describe('when encountering {start_of_verse} while the current section type is not none', () => {
    it('adds a parser warning', () => {
      const invalidChordSheet = '{start_of_chorus}\n{start_of_verse}';

      const parser = new ChordProParser();
      parser.parse(invalidChordSheet);

      expect(parser.warnings).toHaveLength(1);
      expect(parser.warnings[0].toString()).toMatch(/unexpected.+start_of_verse.+current.+chorus.+line 2/i);
    });
  });

  it('parses start_of_tab', () => {
    const markedChordSheet = heredoc`
      {start_of_tab: Intro}
      D                       G             A7
      e|---2-----0--2-----2--0------------0----------------------0----|
      B|---3--3--------3--------3--0--3--(0)--3--0--2--0--2--3--(2)---|
      G|---2-----------------------0-------------0--------------------|
      D|---0-----------------------0-------------2--------------------|
      A|---------------------------2-------------0--------------------|
      E|---------------------------3----------------------------------|
      {end_of_tab}

      {start_of_verse}
      [D]Here comes the sun [G]Here comes [E7]the sun
      {end_of_verse}`;

    const parser = new ChordProParser();
    const song = parser.parse(markedChordSheet);
    const paragraphTypes = song.paragraphs.map((line) => line.type);

    expect(paragraphTypes).toEqual([TAB, VERSE]);
    expect(parser.warnings).toHaveLength(0);
  });

  it('supports CR line endings', () => {
    const chordSheet = 'Let it [Am]be, let it [C/G]be,\rlet it [F]be, let it [C]be';

    const parser = new ChordProParser();
    const song = parser.parse(chordSheet);
    const { lines } = song;
    const [{ items: line0Items }, { items: line1Items }] = lines;

    expect(lines).toHaveLength(2);

    expect(line0Items[0]).toBeChordLyricsPair('', 'Let it ');
    expect(line0Items[1]).toBeChordLyricsPair('Am', 'be, ');
    expect(line0Items[2]).toBeChordLyricsPair('', 'let it ');
    expect(line0Items[3]).toBeChordLyricsPair('C/G', 'be,');
    expect(line1Items[0]).toBeChordLyricsPair('', 'let it ');
    expect(line1Items[1]).toBeChordLyricsPair('F', 'be, ');
    expect(line1Items[2]).toBeChordLyricsPair('', 'let it ');
    expect(line1Items[3]).toBeChordLyricsPair('C', 'be');
  });

  it('supports LF line endings', () => {
    const chordSheet = 'Let it [Am]be, let it [C/G]be,\nlet it [F]be, let it [C]be';

    const parser = new ChordProParser();
    const song = parser.parse(chordSheet);
    const { lines } = song;
    const [{ items: line0Items }, { items: line1Items }] = lines;

    expect(lines).toHaveLength(2);

    expect(line0Items[0]).toBeChordLyricsPair('', 'Let it ');
    expect(line0Items[1]).toBeChordLyricsPair('Am', 'be, ');
    expect(line0Items[2]).toBeChordLyricsPair('', 'let it ');
    expect(line0Items[3]).toBeChordLyricsPair('C/G', 'be,');
    expect(line1Items[0]).toBeChordLyricsPair('', 'let it ');
    expect(line1Items[1]).toBeChordLyricsPair('F', 'be, ');
    expect(line1Items[2]).toBeChordLyricsPair('', 'let it ');
    expect(line1Items[3]).toBeChordLyricsPair('C', 'be');
  });

  it('supports CRLF line endings', () => {
    const chordSheet = 'Let it [Am]be, let it [C/G]be,\r\nlet it [F]be, let it [C]be';

    const parser = new ChordProParser();
    const song = parser.parse(chordSheet);
    const { lines } = song;
    const [{ items: line0Items }, { items: line1Items }] = lines;

    expect(lines).toHaveLength(2);

    expect(line0Items[0]).toBeChordLyricsPair('', 'Let it ');
    expect(line0Items[1]).toBeChordLyricsPair('Am', 'be, ');
    expect(line0Items[2]).toBeChordLyricsPair('', 'let it ');
    expect(line0Items[3]).toBeChordLyricsPair('C/G', 'be,');
    expect(line1Items[0]).toBeChordLyricsPair('', 'let it ');
    expect(line1Items[1]).toBeChordLyricsPair('F', 'be, ');
    expect(line1Items[2]).toBeChordLyricsPair('', 'let it ');
    expect(line1Items[3]).toBeChordLyricsPair('C', 'be');
  });

  it('parses tab sections', () => {
    const chordSheet = heredoc`
      {start_of_tab: Intro}
      Tab line 1
      Tab line 2
      {end_of_tab}
      {c:Verse}
    `;

    const parser = new ChordProParser();
    const song = parser.parse(chordSheet);
    const { paragraphs } = song;
    const [paragraph, secondParagraph] = paragraphs;
    const { lines } = paragraph;

    expect(paragraphs).toHaveLength(2);
    expect(paragraph.type).toEqual(TAB);
    expect(lines).toHaveLength(3);
    expect(lines[0].items[0]).toBeTag('start_of_tab', 'Intro');
    expect(lines[1].items[0]).toBeLiteral('Tab line 1');
    expect(lines[2].items[0]).toBeLiteral('Tab line 2');

    expect(secondParagraph.lines[0].items[0]).toBeTag('comment', 'Verse');
  });

  it('parses ABC sections', () => {
    const chordSheet = heredoc`
      {start_of_abc: Intro}
      ABC line 1
      ABC line 2
      {end_of_abc}
    `;

    const parser = new ChordProParser();
    const song = parser.parse(chordSheet);
    const { paragraphs } = song;
    const paragraph = paragraphs[0];
    const { lines } = paragraph;

    expect(paragraphs).toHaveLength(1);
    expect(paragraph.type).toEqual(ABC);
    expect(lines).toHaveLength(3);
    expect(lines[0].items[0]).toBeTag('start_of_abc', 'Intro');
    expect(lines[1].items[0]).toBeLiteral('ABC line 1');
    expect(lines[2].items[0]).toBeLiteral('ABC line 2');
  });

  it('allows trailing spaces in ABC sections', () => {
    const chordSheet = heredoc`
      {start_of_abc: Intro}
      e3 B| g>B f>B| ef| eB F>B| E4:|

      {end_of_abc}
    `;

    const parser = new ChordProParser();
    const song = parser.parse(chordSheet);
    const { paragraphs, bodyParagraphs } = song;
    const paragraph = paragraphs[0];
    const { lines } = paragraph;

    expect(paragraphs).toHaveLength(1);
    expect(paragraph.type).toEqual(ABC);
    expect(lines).toHaveLength(3);
    expect(lines[0].items[0]).toBeTag('start_of_abc', 'Intro');
    expect(lines[1].items[0]).toBeLiteral('e3 B| g>B f>B| ef| eB F>B| E4:|');
    expect(lines[2].items[0]).toBeLiteral('');
    expect(bodyParagraphs).toHaveLength(1);
  });

  it('parses LY sections', () => {
    const chordSheet = heredoc`
      {start_of_ly: Intro}
      LY line 1
      LY line 2
      {end_of_ly}
    `;

    const parser = new ChordProParser();
    const song = parser.parse(chordSheet);
    const { paragraphs } = song;
    const paragraph = paragraphs[0];
    const { lines } = paragraph;

    expect(paragraphs).toHaveLength(1);
    expect(paragraph.type).toEqual(LILYPOND);
    expect(lines).toHaveLength(3);

    expect(lines[0].items[0]).toBeTag('start_of_ly', 'Intro');
    expect(lines[1].items[0]).toBeLiteral('LY line 1');
    expect(lines[2].items[0]).toBeLiteral('LY line 2');
  });

  it('parses conditional sections', () => {
    const chordSheet = heredoc`
      {start_of_ly-guitar: Intro}
      LY line 1
      LY line 2
      {end_of_ly}
    `;

    const parser = new ChordProParser();
    const song = parser.parse(chordSheet);
    const { paragraphs } = song;
    const paragraph = paragraphs[0];
    const { lines } = paragraph;

    expect(paragraphs).toHaveLength(1);
    expect(paragraph.type).toEqual(LILYPOND);
    expect(paragraph.selector).toEqual('guitar');
    expect(lines).toHaveLength(3);

    expect(lines[0].items[0]).toBeTag('start_of_ly', 'Intro', 'guitar');
    expect(lines[1].items[0]).toBeLiteral('LY line 1');
    expect(lines[2].items[0]).toBeLiteral('LY line 2');

    expect(lines.every((line) => line.selector === 'guitar')).toBe(true);
  });

  it('parses soft line breaks when enabled', () => {
    const chordSheet = heredoc`
      [Am]Let it be,\\ let it [C/G]be
    `;

    const parser = new ChordProParser();
    const song = parser.parse(chordSheet, { softLineBreaks: true });
    const { items } = song.lines[0];

    expect(items[0]).toBeChordLyricsPair('Am', 'Let ');
    expect(items[1]).toBeChordLyricsPair('', 'it be,');
    expect(items[2]).toBeSoftLineBreak();
    expect(items[3]).toBeChordLyricsPair('', 'let it ');
    expect(items[4]).toBeChordLyricsPair('C/G', 'be');
  });

  it('supports soft line breaks directly following a bracket', () => {
    const chordSheet = String.raw`[A]\ [B]bar`;
    const parser = new ChordProParser();
    const song = parser.parse(chordSheet, { softLineBreaks: true });

    const { items } = song.lines[0];

    expect(items[0]).toBeChordLyricsPair('A', '');
    expect(items[1]).toBeSoftLineBreak();
    expect(items[2]).toBeChordLyricsPair('B', 'bar');
  });

  it('does not parse soft line breaks when disabled', () => {
    const chordSheet = heredoc`
      [Am]Let it be,\\ let it [C/G]be
    `;

    const parser = new ChordProParser();
    const song = parser.parse(chordSheet);
    const { items } = song.lines[0];

    expect(items[0]).toBeChordLyricsPair('Am', 'Let ');
    expect(items[1]).toBeChordLyricsPair('', 'it be, let it ');
    expect(items[2]).toBeChordLyricsPair('C/G', 'be');
  });

  describe('{define} chord definitions', () => {
    it('parses chord definitions with finger numbers', () => {
      const chordSheet = '{define: D7 base-fret 3 frets x 3 2 3 1 x fingers 1 2 3 4 5 6 }';

      const parser = new ChordProParser();
      const song = parser.parse(chordSheet);
      const tag = song.lines[0].items[0];
      const { chordDefinition } = (tag as Tag);

      expect(tag).toBeTag('define', 'D7 base-fret 3 frets x 3 2 3 1 x fingers 1 2 3 4 5 6');

      expect(chordDefinition).toEqual({
        name: 'D7',
        baseFret: 3,
        frets: ['x', 3, 2, 3, 1, 'x'],
        fingers: [1, 2, 3, 4, 5, 6],
      });
    });

    it('parses chord definitions without finger numbers', () => {
      const chordSheet = '{define: D7 base-fret 3 frets x 3 2 3 1 x }';

      const parser = new ChordProParser();
      const song = parser.parse(chordSheet);
      const tag = song.lines[0].items[0];
      const { chordDefinition } = (tag as Tag);

      expect(tag).toBeTag('define', 'D7 base-fret 3 frets x 3 2 3 1 x');

      expect(chordDefinition).toEqual({
        name: 'D7',
        baseFret: 3,
        frets: ['x', 3, 2, 3, 1, 'x'],
        fingers: [],
      });
    });

    it('parses conditional chord definitions', () => {
      const chordSheet = '{define-guitar: Am base-fret 1 frets 0 2 2 1 0 0}';
      const parser = new ChordProParser();
      const song = parser.parse(chordSheet);
      const tag = song.lines[0].items[0] as Tag;

      expect(tag).toBeTag('define', 'Am base-fret 1 frets 0 2 2 1 0 0', 'guitar');
      expect(tag.isNegated).toBe(false);

      expect(tag.chordDefinition).toEqual({
        name: 'Am',
        baseFret: 1,
        frets: [0, 2, 2, 1, 0, 0],
        fingers: [],
      });
    });

    it('parses negated conditional chord definitions', () => {
      const chordSheet = '{define-guitar!: Am base-fret 1 frets 0 2 2 1 0 0}';
      const parser = new ChordProParser();
      const song = parser.parse(chordSheet);
      const tag = song.lines[0].items[0] as Tag;

      expect(tag).toBeTag('define', 'Am base-fret 1 frets 0 2 2 1 0 0', 'guitar');
      expect(tag.isNegated).toBe(true);

      expect(tag.chordDefinition).toEqual({
        name: 'Am',
        baseFret: 1,
        frets: [0, 2, 2, 1, 0, 0],
        fingers: [],
      });
    });
  });

  describe('{chord} chord definitions', () => {
    it('parses chord definitions with finger numbers', () => {
      const chordSheet = '{chord: D7 base-fret 3 frets x 3 2 3 1 x fingers 1 2 3 4 5 6 }';

      const parser = new ChordProParser();
      const song = parser.parse(chordSheet);
      const tag = song.lines[0].items[0];
      const { chordDefinition } = (tag as Tag);

      expect(tag).toBeTag('chord', 'D7 base-fret 3 frets x 3 2 3 1 x fingers 1 2 3 4 5 6');

      expect(chordDefinition).toEqual({
        name: 'D7',
        baseFret: 3,
        frets: ['x', 3, 2, 3, 1, 'x'],
        fingers: [1, 2, 3, 4, 5, 6],
      });
    });

    it('parses chord definitions without finger numbers', () => {
      const chordSheet = '{chord: D7 base-fret 3 frets x 3 2 3 1 x }';

      const parser = new ChordProParser();
      const song = parser.parse(chordSheet);
      const tag = song.lines[0].items[0];
      const { chordDefinition } = (tag as Tag);

      expect(tag).toBeTag('chord', 'D7 base-fret 3 frets x 3 2 3 1 x');

      expect(chordDefinition).toEqual({
        name: 'D7',
        baseFret: 3,
        frets: ['x', 3, 2, 3, 1, 'x'],
        fingers: [],
      });
    });

    it('parses conditional chord definitions', () => {
      const chordSheet = '{chord-ukulele: D7 base-fret 3 frets x 3 2 3 1 x }';

      const parser = new ChordProParser();
      const song = parser.parse(chordSheet);
      const tag = song.lines[0].items[0] as Tag;

      expect(tag).toBeTag('chord', 'D7 base-fret 3 frets x 3 2 3 1 x', 'ukulele');
      expect(tag.isNegated).toBe(false);

      expect(tag.chordDefinition).toEqual({
        name: 'D7',
        baseFret: 3,
        frets: ['x', 3, 2, 3, 1, 'x'],
        fingers: [],
      });
    });

    it('parses negated conditional chord definitions', () => {
      const chordSheet = '{chord-guitar!: Am base-fret 1 frets 0 2 2 1 0 0}';
      const parser = new ChordProParser();
      const song = parser.parse(chordSheet);
      const tag = song.lines[0].items[0] as Tag;

      expect(tag).toBeTag('chord', 'Am base-fret 1 frets 0 2 2 1 0 0', 'guitar');
      expect(tag.isNegated).toBe(true);

      expect(tag.chordDefinition).toEqual({
        name: 'Am',
        baseFret: 1,
        frets: [0, 2, 2, 1, 0, 0],
        fingers: [],
      });
    });
  });

  it('adds uses label of part type section for line type', () => {
    const markedChordSheet = heredoc`
      {start_of_verse}
      Let it [Am]be
      {end_of_verse}
      {start_of_part: Intro}
      Let it [Am]be
      {end_of_part}`;

    const parser = new ChordProParser();
    const song = parser.parse(markedChordSheet);
    const lineTypes = song.lines.map((line) => line.type);

    expect(lineTypes).toEqual([VERSE, VERSE, VERSE, 'intro', 'intro', 'intro']);
    expect(parser.warnings).toHaveLength(0);
  });

  it('part short form can make verse and chord paragraph types', () => {
    const markedChordSheet = heredoc`
      {p: Intro (2x)}
      [Gm][F]
      {ep}
      {p: Verse 1}
      [Gm] This is the [F]first verse
      {ep}
      {p: Chorus 1 *2}
      [Gm] This is the [F]first chorus
      {ep}`;

    const parser = new ChordProParser();
    const song = parser.parse(markedChordSheet);
    const lineTypes = song.lines.map((line) => line.type);

    expect(lineTypes).toEqual(['intro', 'intro', 'intro', VERSE, VERSE, VERSE, CHORUS, CHORUS, CHORUS]);
    expect(parser.warnings).toHaveLength(0);
  });
});
