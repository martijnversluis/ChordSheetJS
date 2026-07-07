import '../util/matchers';

import songWithIntro from '../fixtures/song_with_intro';

import { ContentType } from '../../src/serialized_types';
import { GRID } from '../../src/constants';
import { exampleSongSolfege, exampleSongSymbol } from '../fixtures/song';

import {
  ABC, ChordProFormatter, ChordProParser, ChordsOverWordsFormatter, ChordsOverWordsParser, LILYPOND, TAB,
  TEXTBLOCK,
} from '../../src';

import {
  chordLyricsPair,
  createSongFromAst, heredoc, section,
} from '../util/utilities';

describe('ChordsOverWordsFormatter', () => {
  it('formats a symbol song to a text chord sheet correctly', () => {
    const formatter = new ChordsOverWordsFormatter();

    const expectedChordSheet = heredoc`
      title: Let it be
      subtitle: ChordSheetJS example version
      composer: John Lennon,Paul McCartney
      key: C
      x_some_setting:

      Written by: John Lennon,Paul McCartney

      Verse 1
             Am           C/G        F          C
      Let it be, \\ let it be, let it be, let it be
      D       strong   G  A           G  D/F# Em D
      Whisper words of wisdom, let it be

      comment: Breakdown
      Em               F              C  G
      Whisper words of wisdom, let it be

      Chorus 2
      G                F              C  G
      Whisper words of wisdom, let it be

      Solo 1
      G
      Solo line 1
      C
      Solo line 2

      Tab 1
      Tab line 1
      Tab line 2

      ABC 1
      ABC line 1
      ABC line 2

      LY 1
      LY line 1
      LY line 2

      Bridge 1
      Bridge line

      Grid 1
      Grid line 1
      Grid line 2

      Disclaimer
      Textblock line 1
      Textblock line 2`;

    expect(formatter.format(exampleSongSymbol)).toEqual(expectedChordSheet);
  });

  it('formats a solfege song to a text chord sheet correctly', () => {
    const formatter = new ChordsOverWordsFormatter();

    const expectedChordSheet = heredoc`
title: Let it be
subtitle: ChordSheetJS example version
composer: John Lennon,Paul McCartney
key: Do
x_some_setting:

Written by: John Lennon,Paul McCartney

Verse 1
       Lam        Do/Sol     Fa         Do
Let it be, let it be, let it be, let it be
Re      strong   Sol La          Sol Re/Fa# Mim Re
Whisper words of wis dom, let it be

comment: Breakdown
Mim              Fa             Do Sol
Whisper words of wisdom, let it be

Chorus 2
Mim              Fa             Do Sol
Whisper words of wisdom, let it be

Solo 1
Sol
Solo line 1
Do
Solo line 2

Tab 1
Tab line 1
Tab line 2

ABC 1
ABC line 1
ABC line 2

LY 1
LY line 1
LY line 2

Bridge 1
Bridge line

Grid 1
Grid line 1
Grid line 2

Disclaimer
Textblock line 1
Textblock line 2`;

    expect(formatter.format(exampleSongSolfege)).toEqual(expectedChordSheet);
  });

  it('omits the lyrics line when it is empty', () => {
    const formatter = new ChordsOverWordsFormatter();

    const expectedChordSheet = heredoc`
      Intro:  C
             Am         C/G        F          C
      Let it be, let it be, let it be, let it be`;

    expect(formatter.format(songWithIntro)).toEqual(expectedChordSheet);
  });

  it('preserves directive names by default', () => {
    const chordpro = heredoc`
      {t: My Song}
      {st: The Subtitle}
      {c: Opt. Key Change}
      [C]Hi`;

    const expectedChordSheet = heredoc`
      t: My Song
      st: The Subtitle

      c: Opt. Key Change
      C
      Hi`;

    const song = new ChordProParser().parse(chordpro);

    expect(new ChordsOverWordsFormatter().format(song)).toEqual(expectedChordSheet);
  });

  it('normalizes directive names to long names when configured', () => {
    const chordpro = heredoc`
      {t: My Song}
      {st: The Subtitle}
      {c: Opt. Key Change}
      [C]Hi`;

    const expectedChordSheet = heredoc`
      title: My Song
      subtitle: The Subtitle

      comment: Opt. Key Change
      C
      Hi`;

    const song = new ChordProParser().parse(chordpro);
    const formatter = new ChordsOverWordsFormatter({ directiveNameNormalization: 'prefer-long' });

    expect(formatter.format(song)).toEqual(expectedChordSheet);
  });

  it('normalizes directive names to short names when configured', () => {
    const chordpro = heredoc`
      {title: My Song}
      {subtitle: The Subtitle}
      {comment: Opt. Key Change}
      [C]Hi`;

    const expectedChordSheet = heredoc`
      t: My Song
      st: The Subtitle

      c: Opt. Key Change
      C
      Hi`;

    const song = new ChordProParser().parse(chordpro);
    const formatter = new ChordsOverWordsFormatter({ directiveNameNormalization: 'prefer-short' });

    expect(formatter.format(song)).toEqual(expectedChordSheet);
  });

  it('normalizes directive names per directive when configured', () => {
    const chordpro = heredoc`
      {t: My Song}
      {comment: Opt. Key Change}
      [C]Hi`;

    const expectedChordSheet = heredoc`
      title: My Song

      c: Opt. Key Change
      C
      Hi`;

    const song = new ChordProParser().parse(chordpro);
    const formatter = new ChordsOverWordsFormatter({
      directiveNameNormalization: { default: 'prefer-long', comment: 'prefer-short' },
    });

    expect(formatter.format(song)).toEqual(expectedChordSheet);
  });

  it('omits bare comment directive names even when short comment names are preferred', () => {
    const chordpro = heredoc`
      {t: My Song}
      {comment: Verse 1}
      {c: Chorus}
      [C]Hi`;

    const expectedChordSheet = heredoc`
      title: My Song

      Verse 1
      Chorus
      C
      Hi`;

    const song = new ChordProParser().parse(chordpro);
    const formatter = new ChordsOverWordsFormatter({
      directiveNameNormalization: { default: 'prefer-long', comment: 'prefer-short' },
    });

    expect(formatter.format(song)).toEqual(expectedChordSheet);
  });

  it('preserves nk directives in body content', () => {
    const chordpro = heredoc`
      {title: My Song}
      {key: C}

      {c: Verse}
      [C]Hi
      {nk: G}
      [G]There`;

    const expectedChordSheet = heredoc`
      title: My Song
      key: C

      Verse
      C
      Hi
      nk: G
      D
      There`;

    const song = new ChordProParser().parse(chordpro);
    const chordSheet = new ChordsOverWordsFormatter({
      directiveNameNormalization: { comment: 'prefer-short' },
    }).format(song);

    expect(chordSheet).toEqual(expectedChordSheet);
    expect(
      new ChordProFormatter({ directiveNameNormalization: { comment: 'prefer-short' } })
        .format(new ChordsOverWordsParser().parse(chordSheet)),
    ).toContain('{nk: G}');
  });

  it('allows to disable normalizing chords', () => {
    const formatter = new ChordsOverWordsFormatter({ normalizeChords: false });

    const song = createSongFromAst([
      [chordLyricsPair('Dsus4', 'Let it be')],
    ]);

    const expectedChordSheet = heredoc`
      Dsus4
      Let it be`;

    expect(formatter.format(song)).toEqual(expectedChordSheet);
  });

  describe('conditional metadata', () => {
    it('excludes metadata with a non-matching selector', () => {
      const song = new ChordProParser().parse(heredoc`
        {title: My Song}
        {artist-guitar: Guitar John}
        {artist: Generic Jane}

        [Am]Hello
      `);

      const formatter = new ChordsOverWordsFormatter({ instrument: { type: 'ukulele' } });
      const result = formatter.format(song);

      expect(result).toContain('artist: Generic Jane');
      expect(result).not.toContain('Guitar John');
    });

    it('includes metadata with a matching selector', () => {
      const song = new ChordProParser().parse(heredoc`
        {title: My Song}
        {artist-guitar: Guitar John}
        {artist: Generic Jane}

        [Am]Hello
      `);

      const formatter = new ChordsOverWordsFormatter({ instrument: { type: 'guitar' } });
      const result = formatter.format(song);

      expect(result).toContain('artist: Guitar John,Generic Jane');
    });
  });

  describe('conditional sections', () => {
    it('excludes sections with a non-matching selector', () => {
      const song = new ChordProParser().parse(heredoc`
        {title: My Song}

        {start_of_verse-guitar: Verse}
        [Am]Guitar verse
        {end_of_verse}

        {start_of_verse: Verse}
        [C]Common verse
        {end_of_verse}
      `);

      const formatter = new ChordsOverWordsFormatter({ instrument: { type: 'ukulele' } });
      const result = formatter.format(song);

      expect(result).not.toContain('Guitar verse');
      expect(result).toContain('Common verse');
    });

    it('includes sections with a matching selector', () => {
      const song = new ChordProParser().parse(heredoc`
        {title: My Song}

        {start_of_verse-guitar: Verse}
        [Am]Guitar verse
        {end_of_verse}

        {start_of_verse: Verse}
        [C]Common verse
        {end_of_verse}
      `);

      const formatter = new ChordsOverWordsFormatter({ instrument: { type: 'guitar' } });
      const result = formatter.format(song);

      expect(result).toContain('Guitar verse');
      expect(result).toContain('Common verse');
    });
  });

  describe('delegates', () => {
    [ABC, GRID, LILYPOND, TAB, TEXTBLOCK].forEach((type) => {
      describe(`for ${type}`, () => {
        it('uses a configured delegate', () => {
          const song = createSongFromAst([
            ...section(type as ContentType, `${type} section`, {}, `${type} line 1\n${type} line 2`),
          ]);

          const configuration = {
            delegates: {
              [type]: (content: string) => content.toUpperCase(),
            },
          };

          const expectedOutput = heredoc`
            ${type} section
            ${type.toUpperCase()} LINE 1
            ${type.toUpperCase()} LINE 2
          `;

          expect(new ChordsOverWordsFormatter(configuration).format(song)).toEqual(expectedOutput);
        });

        it('defaults to the default delegate', () => {
          const song = createSongFromAst([
            ...section(type as ContentType, `${type} section`, {}, `${type} line 1\n${type} line 2`),
          ]);

          const configuration = {};

          const expectedOutput = heredoc`
            ${type} section
            ${type} line 1
            ${type} line 2
          `;

          expect(new ChordsOverWordsFormatter(configuration).format(song)).toEqual(expectedOutput);
        });
      });
    });
  });

  describe('pango markup', () => {
    it('strips pango markup from lyrics output', () => {
      const song = createSongFromAst([
        [chordLyricsPair('C', 'Roses are <b>red</b>')],
      ]);

      const formatted = new ChordsOverWordsFormatter().format(song);

      expect(formatted).toContain('Roses are red');
      expect(formatted).not.toContain('<b>');
    });

    it('calculates alignment based on stripped text length', () => {
      const song = createSongFromAst([
        [
          chordLyricsPair('C', '<span color="red">Roses</span> are '),
          chordLyricsPair('G', 'red'),
        ],
      ]);

      const formatted = new ChordsOverWordsFormatter().format(song);
      const lines = formatted.split('\n');

      expect(lines[1]).toBe('Roses are red');
    });
  });
});
