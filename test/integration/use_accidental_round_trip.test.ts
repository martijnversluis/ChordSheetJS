import { ChordProFormatter, ChordProParser } from '../../src';

describe('useAccidental round-trip conversion', () => {
  const parser = new ChordProParser();
  const formatter = new ChordProFormatter();

  const testCases = [
    // Input      To b       Back to #
    ['[D/A#]', '[D/Bb]', '[D/A#]'],
    ['[D/B#]', '[D/C]', '[D/C]'],
    ['[D/C#]', '[D/Db]', '[D/C#]'],
    ['[D/D#]', '[D/Eb]', '[D/D#]'],
    ['[D/E#]', '[D/F]', '[D/F]'],
    ['[D/F#]', '[D/Gb]', '[D/F#]'],
    ['[D/G#]', '[D/Ab]', '[D/G#]'],
    ['[A/A#]', '[A/Bb]', '[A/A#]'],
    ['[A/B#]', '[A/C]', '[A/C]'],
    ['[A/C#]', '[A/Db]', '[A/C#]'],
    ['[A/D#]', '[A/Eb]', '[A/D#]'],
    ['[A/E#]', '[A/F]', '[A/F]'],
    ['[A/F#]', '[A/Gb]', '[A/F#]'],
    ['[A/G#]', '[A/Ab]', '[A/G#]'],
  ];

  describe('converting to flat and back to sharp', () => {
    it.each(testCases)(
      '%s -> %s -> %s',
      (input, expectedFlat, expectedSharp) => {
        const song = parser.parse(input);
        const toFlat = song.useAccidental('b');
        const backToSharp = toFlat.useAccidental('#');

        expect(formatter.format(toFlat).trim()).toEqual(expectedFlat);
        expect(formatter.format(backToSharp).trim()).toEqual(expectedSharp);
      },
    );
  });
});
