import Chord from '../../src/chord';
import ChordLyricsPair from '../../src/chord_sheet/chord_lyrics_pair';
import { heredoc } from '../util/utilities';
import {
  ChordProFormatter, ChordProParser, ChordsOverWordsFormatter, ChordsOverWordsParser, TextFormatter,
} from '../../src';

describe('changing the key of an existing song (symbol chords)', () => {
  it('updates the key directive and transposes the chords', () => {
    const chordpro = heredoc`
      {key: C}

      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`;

    const changedSheet = heredoc`
      {key: D}

      Let it [Bm]be, let it [D/A]be, let it [G]be, let it [D]be`;

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.changeKey('D');

    expect(updatedSong.key).toEqual('D');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('does not fail when the original song key is not set', () => {
    const chordSheet = heredoc`
      Let it [Bm]be, let it [D/A]be, let it [G]be, let it [D]be`;

    const song = new ChordProParser().parse(chordSheet);

    expect(() => song.changeKey('B')).toThrow(/Cannot change song key, the original key is unknown/);
  });

  it('supports programmatically setting the song key before changing key', () => {
    const chordSheet = heredoc`
      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`;

    const changedSheet = heredoc`
      {key: D}

      Let it [Bm]be, let it [D/A]be, let it [G]be, let it [D]be`;

    const song = new ChordProParser().parse(chordSheet);
    const updatedSong = song.setKey('C').changeKey('D');

    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('respects the accidental of the target key', () => {
    const chordProTestSong = '{key: E}\n\n[E]Let it be';
    const song = new ChordProParser().parse(chordProTestSong);
    const transposedSong = song.changeKey('Bb');
    const output = new TextFormatter().format(transposedSong);

    expect(output).toEqual('Bb\nLet it be');
  });

  it.each([
    ['{key: C}\n[F/F]x', 'Gb', 'Cb/Cb'],
    ['{key: C}\n[A#/A#]x', 'Gb', 'Fb/Fb'],
    ['{key: C}\n[E/E]x', 'C#', 'E#/E#'],
    ['{key: C}\n[B/B]x', 'F#', 'E#/E#'],
    ['{key: C}\n[A/A]x', 'G#', 'E#/E#'],
    ['{key: C}\n[D/D]x', 'D#m', 'E#/E#'],
    ['{key: C}\n[A/E]x', 'C#', 'A#/E#'],
    ['{key: C}\n[C/C#]x', 'Ebm', 'Eb/E'],
    ['{key: C}\n[C/F]x', 'Gb', 'Gb/Cb'],
    ['{key: C}\n[A#m/F]x', 'Gb', 'Fbm/Cb'],
    ['{key: Do}\n[La/Mi]x', 'Do#', 'La#/Mi#'],
    ['{key: Do}\n[Do/Do#]x', 'Mibm', 'Mib/Mi'],
  ])('preserves contextual root and bass spelling for %s changed to %s', (source, target, expected) => {
    const changedSong = new ChordProParser().parse(source).changeKey(target);
    const formatted = new ChordsOverWordsFormatter().format(changedSong);
    const roundTripped = new ChordsOverWordsParser().parse(formatted);
    const chord = roundTripped.lines
      .flatMap((line) => line.items)
      .find((item): item is ChordLyricsPair => item instanceof ChordLyricsPair)?.chords;

    expect(chord).toEqual(expected);
  });

  it.each([
    {
      sourceKey: 'E',
      targetKey: 'C#',
      source: ['E', 'A', 'E/G#', 'A', 'C#m'],
      preChange: ['C#', 'F#', 'C#/F', 'F#', 'A#m'],
      expected: ['C#', 'F#', 'C#/E#', 'F#', 'A#m'],
    },
    {
      sourceKey: 'C',
      targetKey: 'C#',
      source: ['Dsus', 'G', 'Em', 'C', 'D5'],
      preChange: ['D#sus', 'G#', 'Fm', 'C#', 'D#5'],
      expected: ['D#sus', 'G#', 'E#m', 'C#', 'D#5'],
    },
    {
      sourceKey: 'D',
      targetKey: 'Gb',
      source: ['D', 'G', 'A', 'D'],
      preChange: ['Gb', 'B', 'Db', 'Gb'],
      expected: ['Gb', 'Cb', 'Db', 'Gb'],
    },
    {
      sourceKey: 'C',
      targetKey: 'D#',
      source: ['G', 'C', 'Am7', 'F2', 'G'],
      preChange: ['A#', 'D#', 'Cm7', 'G#2', 'A#'],
      expected: ['A#', 'D#', 'B#m7', 'G#2', 'A#'],
    },
  ])(
    'changes only contextual spelling across a $sourceKey to $targetKey progression',
    ({
      sourceKey, targetKey, source, preChange, expected,
    }) => {
      const chordPro = `{key: ${sourceKey}}\n${source.map((chord) => `[${chord}]x`).join(' ')}`;
      const changedSong = new ChordProParser().parse(chordPro).changeKey(targetKey);
      const formatted = new ChordProFormatter().format(changedSong);
      const roundTripped = new ChordProParser().parse(formatted);
      const actual = roundTripped.lines
        .flatMap((line) => line.items)
        .filter((item): item is ChordLyricsPair => item instanceof ChordLyricsPair)
        .map((item) => item.chords)
        .filter((chord): chord is string => chord !== null);
      const semantics = (value: string) => {
        const chord = Chord.parseOrFail(value);
        return {
          rootPitch: chord.root?.effectiveGrade,
          rootMinor: chord.root?.minor,
          suffix: chord.suffix,
          bassPitch: chord.bass?.effectiveGrade ?? null,
          hasBass: chord.bass !== null,
          optional: chord.optional,
        };
      };
      const differences = actual.flatMap((chord, index) => (chord === preChange[index] ?
        [] :
        [{ index, before: preChange[index], after: chord }]));
      const expectedDifferences = expected.flatMap((chord, index) => (chord === preChange[index] ?
        [] :
        [{ index, before: preChange[index], after: chord }]));

      expect(actual).toEqual(expected);
      expect(actual).toHaveLength(preChange.length);
      actual.forEach((chord, index) => expect(semantics(chord)).toEqual(semantics(preChange[index])));
      expect(differences).toEqual(expectedDifferences);
    },
  );

  it.each([
    ['C#', 'D#m', '/E#', 5],
    ['G#', 'A#m', '/B#', 0],
  ])(
    'spells a slash-only bass against the preceding root when changing to %s',
    (targetKey, expectedRoot, expectedBass, expectedBassPitch) => {
      const chordPro = '{key: C}\n[C]old [Dm]root\n[/E]continuation';
      const changedSong = new ChordProParser().parse(chordPro).changeKey(targetKey);
      const formatted = new ChordProFormatter().format(changedSong);
      const roundTripped = new ChordProParser().parse(formatted);
      const chords = roundTripped.lines
        .flatMap((line) => line.items)
        .filter((item): item is ChordLyricsPair => item instanceof ChordLyricsPair)
        .map((item) => item.chord)
        .filter((chord): chord is Chord => chord !== null);

      expect(chords.map((chord) => chord.toString())).toEqual([targetKey, expectedRoot, expectedBass]);
      expect(chords[2].root).toBeNull();
      expect(chords[2].bass?.effectiveGrade).toEqual(expectedBassPitch);
      expect(formatted).toContain(`[${expectedRoot}]root\n[${expectedBass}]continuation`);
    },
  );

  it.each([
    ['/F', '/Cb', false],
    ['(/F)', '(/Cb)', true],
  ])(
    'spells the flat-side slash-only bass %s against the inherited root',
    (sourceBass, expectedBass, optional) => {
      const chordPro = `{key: C}\n[C]root\n[${sourceBass}]continuation`;
      const changedSong = new ChordProParser().parse(chordPro).changeKey('Gb');
      const formatted = new ChordProFormatter().format(changedSong);
      const roundTripped = new ChordProParser().parse(formatted);
      const chords = roundTripped.lines
        .flatMap((line) => line.items)
        .filter((item): item is ChordLyricsPair => item instanceof ChordLyricsPair)
        .map((item) => item.chord)
        .filter((chord): chord is Chord => chord !== null);

      expect(chords.map((chord) => chord.toString())).toEqual(['Gb', expectedBass]);
      expect(chords[1].root).toBeNull();
      expect(chords[1].bass?.toString()).toEqual('Cb');
      expect(chords[1].bass?.effectiveGrade).toEqual(11);
      expect(chords[1].optional).toEqual(optional);
      expect(formatted).toContain(`[Gb]root\n[${expectedBass}]continuation`);
    },
  );

  it('preserves the source bass degree for slash-only continuations', () => {
    const format = (source: string) => new ChordProFormatter().format(
      new ChordProParser().parse(`{key: C}\n${source}`).changeKey('C#'),
    );

    expect(format('[Eb/A]rooted')).toContain('[E/A#]rooted');
    expect(format('[Eb]root\n[/A]continuation')).toContain('[E]root\n[/A#]continuation');
  });

  it('leaves a slash-only bass unchanged when no root precedes it', () => {
    const song = new ChordProParser().parse('{key: C}\n[/E]continuation').changeKey('C#');

    expect(new ChordProFormatter().format(song)).toContain('[/F]continuation');
  });

  it('preserves inherited bass spelling through repeated transposition', () => {
    const song = new ChordProParser().parse('{key: C}\n[Dm]root\n[/E]continuation');
    const formatter = new ChordProFormatter();

    expect(formatter.format(song.transpose(1).transpose(1))).toEqual(formatter.format(song.transpose(2)));
    expect(formatter.format(song.transpose(2))).toContain('[Em]root\n[/F#]continuation');
  });

  it('keeps a requested G# tonic instead of rewriting it to Ab', () => {
    const song = new ChordProParser().parse('{key: C}\n[C]x').changeKey('G#');

    expect(song.key).toEqual('G#');
    expect(new ChordProFormatter().format(song)).toContain('[G#]');
  });
});

describe('changing the key of an existing song (solfege chords)', () => {
  it('updates the key directive and transposes the chords', () => {
    const chordpro = `
{key: Do}

Let it [Lam]be, let it [Do/Sol]be, let it [Fa]be, let it [Do]be`.substring(1);

    const changedSheet = `
{key: Re}

Let it [Sim]be, let it [Re/La]be, let it [Sol]be, let it [Re]be`.substring(1);

    const song = new ChordProParser().parse(chordpro);
    const updatedSong = song.changeKey('Re');

    expect(updatedSong.key).toEqual('Re');
    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });

  it('does not fail when the original song key is not set', () => {
    const chordSheet = `
Let it [Sim]be, let it [Re/La]be, let it [Sol]be, let it [Re]be`.substring(1);

    const song = new ChordProParser().parse(chordSheet);

    expect(() => song.changeKey('Si')).toThrow(/Cannot change song key, the original key is unknown/);
  });

  it('supports programmatically setting the song key before changing key', () => {
    const chordSheet = `
Let it [Lam]be, let it [Do/Sol]be, let it [Fa]be, let it [Do]be`.substring(1);

    const changedSheet = `
{key: Re}

Let it [Sim]be, let it [Re/La]be, let it [Sol]be, let it [Re]be`.substring(1);

    const song = new ChordProParser().parse(chordSheet);
    const updatedSong = song.setKey('Do').changeKey('Re');

    expect(new ChordProFormatter().format(updatedSong)).toEqual(changedSheet);
  });
});
