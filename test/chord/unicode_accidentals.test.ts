import Chord from '../../src/chord';
import ChordProParser from '../../src/parser/chord_pro_parser';
import Key from '../../src/key';
import { FLAT, SHARP } from '../../src/constants';

describe('Unicode accidentals', () => {
  it('parses Unicode chord roots and slash basses into canonical accidentals', () => {
    const chord = Chord.parseOrFail('F♯7♭9/C♯');

    expect(chord.root?.accidental).toBe(SHARP);
    expect(chord.bass?.accidental).toBe(SHARP);
    expect(chord.extensions).toBe('7♭9');
    expect(chord.toString()).toBe('F#7♭9/C#');
    expect(chord.toString({ useUnicodeModifier: true })).toBe('F♯7♭9/C♯');
  });

  it.each([
    ['B♭', FLAT, 'Bb'],
    ['F♯', SHARP, 'F#'],
    ['♭3', FLAT, 'b3'],
    ['♯IV', SHARP, '#IV'],
  ])('parses Unicode keys: %s', (input, accidental, output) => {
    const key = Key.parse(input);

    expect(key?.accidental).toBe(accidental);
    expect(key?.toString()).toBe(output);
    expect(key?.toString({ useUnicodeModifier: true })).toBe(input);
  });

  it('recognizes direct Unicode chord input in ChordPro songs', () => {
    const song = new ChordProParser().parse('[F♯7♭9/C♯]word');

    expect(song.getChords()).toEqual(['F#7♭9/C#']);
  });
});

describe('Unicode chord-quality symbols', () => {
  it.each(['CΔ7', 'C∆7', 'C△7', 'C°7', 'Cø7', 'C⌀7'])('preserves %s as chord content', (input) => {
    expect(Chord.parseOrFail(input).toString()).toBe(input);
  });

  it('recognizes chord-quality symbols in ChordPro songs', () => {
    const song = new ChordProParser().parse('[CΔ7]major [C°7]diminished [Cø7]half diminished');

    expect(song.getChords()).toEqual(['CΔ7', 'C°7', 'Cø7']);
  });

  it.each([
    ['Cm7', 'm', '7'],
    ['Cmin7', 'min', '7'],
    ['CMIN7', 'MIN', '7'],
    ['CMi7', 'Mi', '7'],
    ['Cmadd2', 'm', 'add2'],
    ['C-7', '-', '7'],
    ['C-5', null, '-5'],
    ['Cmaj7', 'maj', '7'],
    ['Cma7', 'ma', '7'],
    ['CM7', 'M', '7'],
    ['CΔ7', 'Δ', '7'],
    ['C∆7', '∆', '7'],
    ['C△7', '△', '7'],
    ['Cdim7', 'dim', '7'],
    ['C°7', '°', '7'],
    ['Cø7', 'ø', '7'],
    ['C⌀7', '⌀', '7'],
    ['Caug7', 'aug', '7'],
    ['Csus4', 'sus4', null],
  ])('classifies the quality and extensions in %s', (input, quality, extensions) => {
    const chord = Chord.parseOrFail(input);

    expect(chord.quality).toBe(quality);
    expect(chord.extensions).toBe(extensions);
  });
});
