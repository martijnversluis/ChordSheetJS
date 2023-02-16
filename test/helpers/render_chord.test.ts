import Song from '../../src/chord_sheet/song';
import Line from '../../src/chord_sheet/line';
import { renderChord } from '../../src/helpers';
import Key from '../../src/key';
import { eachTestCase } from '../utilities';

describe('renderChord helper', () => {
  // describe('chord transposition', () => {
  //   eachTestCase(`
  //     #  | songKey | capo | lineKey | lineTransposeKey | renderKey | outcome |
  //     -- | ------- | ---- | ------- | ---------------- | --------- | ------- |
  //      1 |         |      |         |                  |           | "Em7"   |
  //      2 |         |      |         |                  | "F"       | "Em7"   |
  //      3 |         |      |         | "A"              |           | "Em7"   |
  //      4 |         |      |         | "A"              | "F"       | "Em7"   |
  //      5 |         |      | "Bb"    |                  | "F"       | "Em7"   |
  //      6 |         |      | "Bb"    | "A"              | "F"       | "Em7"   |
  //      7 |         | 3    |         |                  |           | "Dbm7"  |
  //      8 |         | 3    |         |                  | "F"       | "Dbm7"  |
  //      9 |         | 3    |         | "A"              |           | "Dbm7"  |
  //     10 |         | 3    |         | "A"              | "F"       | "Dbm7"  |
  //     11 |         | 3    | "Bb"    |                  |           | "Dbm7"  |
  //     12 |         | 3    | "Bb"    |                  | "F"       | "Dbm7"  |
  //     13 |         | 3    | "Bb"    | "A"              |           | "Dbm7"  |
  //     14 |         | 3    | "Bb"    | "A"              | "F"       | "Dbm7"  |
  //     15 | "G"     |      |         |                  |           | "Em7"   |
  //     16 | "G"     |      |         |                  | "F"       | "Dm7"   |
  //     17 | "G"     |      |         | "A"              | "F"       | "Em7"   |
  //     18 | "G"     |      | "Bb"    |                  |           | "Em7"   |
  //     19 | "G"     |      | "Bb"    |                  | "F"       | "Dm7"   |
  //     20 | "G"     |      | "Bb"    | "A"              |           | "Gbm7"  |
  //     21 | "G"     |      | "Bb"    | "A"              | "F"       | "Em7"   |
  //     22 | "G"     | 3    |         |                  |           | "C#m7"  |
  //     23 | "G"     | 3    |         |                  | "F"       | "Bm7"   |
  //     24 | "G"     | 3    |         | "A"              |           | "Ebm7"  |
  //     25 | "G"     | 3    |         | "A"              | "F"       | "C#m7"  |
  //     26 | "G"     | 3    | "Bb"    |                  | "F"       | "Bm7"   |
  //     27 | "G"     | 3    | "Bb"    | "A"              |           | "Ebm7"  |
  //     28 | "G"     | 3    | "Bb"    | "A"              | "F"       | "C#m7"  |
  //   `, ({
  //     songKey, capo, lineKey, lineTransposeKey, renderKey, outcome,
  //   }) => {
  //     const song = new Song();
  //     song.metadata.add('key', songKey);
  //     song.metadata.add('capo', capo);
  //
  //     const line = new Line();
  //     line.key = lineKey;
  //     line.transposeKey = lineTransposeKey;
  //
  //     const renderedChord = renderChord('Em7', line, song, Key.wrap(renderKey));
  //     expect(renderedChord).toEqual(outcome);
  //   });
  // });

  describe('chord styles', () => {
    eachTestCase(`
      #  | chordString | songKey | chordStyle | outcome |
      -- | ----------- | ------- | ---------- | ------- |
       1 | "Gm"        |         | "symbol"   | "Gm"    |
       2 | "Gm"        | "Bb"    | "symbol"   | "Gm"    |
       f | "Gm"        | "Bb"    | "number"   | "6"     |
       4 | "Gm"        | "Bb"    | "numeral"  | "vi"    |
       5 | "IV"        |         | "numeral"  | "IV"    |
       6 | "IV"        |         | "number"   | "4"     |
       7 | "IV"        | "Bb"    | "symbol"   | "Eb"    |
       8 | "IV"        | "Bb"    | "numeral"  | "IV"    | 
       9 | "IV"        | "Bb"    | "number"   | "4"     |
      10 | "4"         |         | "numeral"  | "IV"    |
      11 | "4"         |         | "number"   | "4"     |
      12 | "4"         | "Bb"    | "symbol"   | "Eb"    |
      13 | "4"         | "Bb"    | "numeral"  | "IV"    |
      14 | "4"         | "Bb"    | "number"   | "4"     | 
    `, ({
      chordString, songKey, chordStyle, outcome,
    }) => {
      const song = new Song();
      song.metadata.add('key', songKey);
      song.metadata.add('chord_style', chordStyle);

      const line = new Line();

      const renderedChord = renderChord(chordString, line, song);
      expect(renderedChord).toEqual(outcome);
    });
  });
});
