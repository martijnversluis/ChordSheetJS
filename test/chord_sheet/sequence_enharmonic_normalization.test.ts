import ChordLyricsPair from '../../src/chord_sheet/chord_lyrics_pair';
import {
  ChordProFormatter, ChordProParser, ChordsOverWordsFormatter, TextFormatter,
} from '../../src';

function chordsIn(song): string[] {
  return song.lines
    .flatMap((line) => line.items)
    .filter((item): item is ChordLyricsPair => item instanceof ChordLyricsPair)
    .map((item) => item.chords)
    .filter(Boolean);
}

describe('sequence-aware enharmonic normalization', () => {
  it('returns the original song without a second mapping pass when no diminished chord exists', () => {
    const source = new ChordProParser().parse('{key: G}\n[C]x [G]x [Am]x');

    expect(source.normalizeChordSequences()).toBe(source);
  });

  it('spells a diminished seventh as the leading tone of the chord it resolves into', () => {
    const source = new ChordProParser().parse('{key: F}\n[Dbdim7]rise [Dm]home');

    const normalized = source.normalizeChords();

    expect(chordsIn(normalized)).toEqual(['C#dim7', 'Dm']);
  });

  it.each([
    ['dim', 'D#dim'],
    ['dim7', 'D#dim7'],
    ['o', 'D#o'],
    ['o7', 'D#o7'],
  ])('applies the leading-tone rule to the fully diminished %s suffix', (suffix, expected) => {
    const source = new ChordProParser().parse(`{key: G}\n[Eb${suffix}]rise [Em]home`);

    expect(chordsIn(source.normalizeChords(null, { normalizeSuffix: false }))).toEqual([expected, 'Em']);
  });

  it('uses B# as the leading tone of C# instead of the easier but functionally wrong C', () => {
    const source = new ChordProParser().parse('{key: E}\n[Cdim7]rise [C#m]home');

    expect(chordsIn(source.normalizeChords())).toEqual(['B#dim7', 'C#m']);
  });

  it('applies the same leading-tone rule to solfege chords', () => {
    const source = new ChordProParser().parse('{key: Sol}\n[Mibdim7]rise [Mim]home');

    expect(chordsIn(source.normalizeChords())).toEqual(['Re#dim7', 'Mim']);
  });

  it('falls back without inventing or locking a double accidental', () => {
    const source = new ChordProParser().parse('{key: C}\n[Gdim7]rise [G#]home');

    const normalized = source.normalizeChords();
    const diminished = normalized.lines
      .flatMap((line) => line.items)
      .find((item): item is ChordLyricsPair => item instanceof ChordLyricsPair)?.chord;

    expect(chordsIn(normalized)).toEqual(['Gdim7', 'G#']);
    expect(diminished?.root?.sequenceSpelling).toBe(false);
    expect(diminished?.root?.contextualSpelling).toBe(false);
  });

  it('uses the following rooted chord even when it starts on the next line', () => {
    const source = new ChordProParser().parse('{key: G}\n[Ebdim7]rise\n[Em]home');

    expect(chordsIn(source.normalizeChords())).toEqual(['D#dim7', 'Em']);
  });

  it('applies the same rule to chord tokens in grid sections', () => {
    const source = new ChordProParser().parse(
      '{key: F}\n{start_of_grid}\n|| Dbdim7 . | Dm . |\n{end_of_grid}',
    );

    const formatted = new ChordProFormatter({ normalizeChords: true }).format(source);

    expect(formatted).toContain('|| C#dim7 . | Dm . |');
  });

  it('preserves grid leading-tone spelling while changing the progression from F to G', () => {
    const source = new ChordProParser().parse(
      '{key: F}\n{start_of_grid}\n|| C#dim7 . | Dm . |\n{end_of_grid}',
    );

    const formatted = new ChordProFormatter({ normalizeChords: false }).format(source.changeKey('G'));

    expect(formatted).toContain('|| D#dim7 . | Em . |');
  });

  it('preserves the leading-tone spelling while changing the whole progression from F to G', () => {
    const source = new ChordProParser().parse('{key: F}\n[Bb]x [C#dim7]x [Dm]x');

    expect(chordsIn(source.changeKey('G'))).toEqual(['C', 'D#dim7', 'Em']);
  });

  it('preserves the correctly spelled Kingdom progression through an E to F to E round trip', () => {
    const source = new ChordProParser().parse(
      '{key: E}\n[A]x [B#dim7]x [C#m]x [D/C]x [G#7(#9#5)]x [F#7/A#]x',
    );

    const inF = source.changeKey('F');
    const backInE = inF.changeKey('E');

    expect(chordsIn(inF)).toEqual(['Bb', 'C#dim7', 'Dm', 'Eb/Db', 'A7(#9#5)', 'G7/B']);
    expect(chordsIn(backInE)).toEqual(['A', 'B#dim7', 'C#m', 'D/C', 'G#7(#9#5)', 'F#7/A#']);
  });

  it.each([
    ['{key: G}\n[Ebdim7]x [G]x', ['Ebdim7', 'G']],
    ['{key: G}\n[Cdim7]x [C]x', ['Cdim7', 'C']],
    ['{key: G}\n[Ebmaj7]x [Em]x', ['Ebmaj7', 'Em']],
    ['{key: G}\n[Ebm7b5]x [Em]x', ['Ebm7b5', 'Em']],
    ['{key: G}\n[Ebm(b5)]x [Em]x', ['Ebm(b5)', 'Em']],
    ['{key: G}\n[Ebdim7]x', ['Ebdim7']],
  ])('does not infer a leading-tone spelling without the exact diminished resolution: %s', (text, expected) => {
    const normalized = new ChordProParser().parse(text).normalizeChords(null, { normalizeSuffix: false });
    expect(chordsIn(normalized)).toEqual(expected);
  });

  it.each([
    ['{key: G}\n[Ebdim7]x [N.C.]rest [Em]home', ['Ebdim7', 'N.C.', 'Em']],
    ['{key: G}\n[Ebdim7]x [/B]pedal [Em]home', ['Ebdim7', '/B', 'Em']],
  ])('does not infer across an explicit no-chord or rootless harmonic event', (text, expected) => {
    expect(chordsIn(new ChordProParser().parse(text).normalizeChords())).toEqual(expected);
  });

  it.each([
    '{key: G}\n[Ebdim7]x\n\n[Em]x',
    '{key: G}\n[Ebdim7]x\n{start_of_verse}\n[Em]x\n{end_of_verse}',
  ])('does not carry the sequence rule across a phrase or section boundary', (text) => {
    expect(chordsIn(new ChordProParser().parse(text).normalizeChords())).toEqual(['Ebdim7', 'Em']);
  });

  it('does not carry the sequence rule across an explicit key change', () => {
    const source = new ChordProParser().parse('{key: G}\n[Ebdim7]x\n{new_key: E}\n[Em]x');

    expect(chordsIn(source.normalizeChords())).toEqual(['Ebdim7', 'Em']);
  });

  it('keeps an explicit accidental request stronger than the sequence rule', () => {
    let isFirstChord = true;
    const source = new ChordProParser()
      .parse('{key: G}\n[Ebdim7]x [Em]x')
      .mapChordLyricsPairs((pair) => {
        if (!isFirstChord) return pair;
        isFirstChord = false;
        return pair.changeChord((chord) => chord.set({ root: chord.root?.useAccidental('b') }));
      });

    expect(chordsIn(source.normalizeChords())).toEqual(['Ebdim7', 'Em']);
  });

  it('keeps root pitches unchanged when it corrects the spelling', () => {
    const source = new ChordProParser().parse('{key: G}\n[Ebdim7]x [Em]x');
    const before = source.lines
      .flatMap((line) => line.items)
      .filter((item): item is ChordLyricsPair => item instanceof ChordLyricsPair)
      .map((item) => item.chord?.root?.effectiveGrade);

    const after = source.normalizeChords().lines
      .flatMap((line) => line.items)
      .filter((item): item is ChordLyricsPair => item instanceof ChordLyricsPair)
      .map((item) => item.chord?.root?.effectiveGrade);

    expect(after).toEqual(before);
  });
});

describe('formatter sequence normalization flag', () => {
  const source = new ChordProParser().parse('{key: G}\n[Ebdim7]rise [Em]home');

  it('runs sequence normalization when normalizeChords is enabled', () => {
    const chordPro = new ChordProFormatter({ normalizeChords: true }).format(source);
    const chordsOverWords = new ChordsOverWordsFormatter({ normalizeChords: true }).format(source);
    const text = new TextFormatter({ normalizeChords: true }).format(source);

    expect(chordPro).toContain('[D#dim7]rise [Em]home');
    expect(chordsOverWords).toContain('D#dim7 Em');
    expect(text).toContain('D#dim7 Em');
  });

  it('retains the sequence rule through formatter-time key transposition', () => {
    const inF = new ChordProParser().parse('{key: F}\n[C#dim7]rise [Dm]home');

    const text = new TextFormatter({ key: 'G', normalizeChords: true }).format(inF);

    expect(text).toContain('D#dim7 Em');
    expect(text).not.toContain('Ebdim7');
  });

  it('retains the sequence rule while removing a capo', () => {
    const withCapo = new ChordProParser().parse('{key: F}\n{capo: 2}\n[C#dim7]rise [Dm]home');

    const text = new TextFormatter({ decapo: true, normalizeChords: true }).format(withCapo);

    expect(text).toContain('Bdim7 Cm');
    expect(text).not.toContain('Cbdim7');
  });

  it('preserves the source when normalizeChords is disabled', () => {
    const chordPro = new ChordProFormatter({ normalizeChords: false }).format(source);
    const chordsOverWords = new ChordsOverWordsFormatter({ normalizeChords: false }).format(source);
    const text = new TextFormatter({ normalizeChords: false }).format(source);

    expect(chordPro).toContain('[Ebdim7]rise [Em]home');
    expect(chordsOverWords).toContain('Ebdim7 Em');
    expect(text).toContain('Ebdim7 Em');
  });
});
