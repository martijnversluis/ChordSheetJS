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
