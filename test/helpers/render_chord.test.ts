import Song from '../../src/chord_sheet/song';
import Line from '../../src/chord_sheet/line';
import { renderChord } from '../../src/helpers';
import { eachTestCase } from '../utilities';
import { Key } from '../../src';

describe('renderChord helper', () => {
  describe('chord transposition symbol', () => {
    eachTestCase(`
      #  | songKey | capo | lineKey | lineTransposeKey | renderKey | outcome |
      -- | ------- | ---- | ------- | ---------------- | --------- | ------- |
       1 |         |      |         |                  |           | "Em7"   |
       2 |         |      |         |                  | "F"       | "Em7"   |
       3 |         |      |         | "A"              |           | "Em7"   |
       4 |         |      |         | "A"              | "F"       | "Em7"   |
       5 |         |      | "Bb"    |                  | "F"       | "Em7"   |
       6 |         |      | "Bb"    | "A"              | "F"       | "Em7"   |
       7 |         | 3    |         |                  |           | "Dbm7"  |
       8 |         | 3    |         |                  | "F"       | "Dbm7"  |
       9 |         | 3    |         | "A"              |           | "Dbm7"  |
      10 |         | 3    |         | "A"              | "F"       | "Dbm7"  |
      11 |         | 3    | "Bb"    |                  |           | "Dbm7"  |
      12 |         | 3    | "Bb"    |                  | "F"       | "Dbm7"  |
      13 |         | 3    | "Bb"    | "A"              |           | "Dbm7"  |
      14 |         | 3    | "Bb"    | "A"              | "F"       | "Dbm7"  |
      15 | "G"     |      |         |                  |           | "Em7"   |
      16 | "G"     |      |         |                  | "F"       | "Dm7"   |
      17 | "G"     |      |         | "A"              | "F"       | "Em7"   |
      18 | "G"     |      | "Bb"    |                  |           | "Em7"   |
      19 | "G"     |      | "Bb"    |                  | "F"       | "Dm7"   |
      20 | "G"     |      | "Bb"    | "A"              |           | "Gbm7"  |
      21 | "G"     |      | "Bb"    | "A"              | "F"       | "Em7"   |
      22 | "G"     | 3    |         |                  |           | "C#m7"  |
      23 | "G"     | 3    |         |                  | "F"       | "Bm7"   |
      24 | "G"     | 3    |         | "A"              |           | "Ebm7"  |
      25 | "G"     | 3    |         | "A"              | "F"       | "C#m7"  |
      26 | "G"     | 3    | "Bb"    |                  | "F"       | "Bm7"   |
      27 | "G"     | 3    | "Bb"    | "A"              |           | "Ebm7"  |
      28 | "G"     | 3    | "Bb"    | "A"              | "F"       | "C#m7"  |
    `, ({
      songKey, capo, lineKey, lineTransposeKey, renderKey, outcome,
    }) => {
      const song = new Song();
      song.metadata.add('key', songKey);
      song.metadata.add('capo', capo);

      const line = new Line();
      line.key = lineKey;
      line.transposeKey = lineTransposeKey;

      const renderedChord = renderChord('Em7', line, song, { renderKey: Key.wrap(renderKey) });
      expect(renderedChord).toEqual(outcome);
    });
  });

  describe('chord transposition solfege', () => {
    eachTestCase(`
      #  | songKey   | capo | lineKey | lineTransposeKey | renderKey | outcome  |
      -- | -------   | ---- | ------- | ---------------- | --------- | -------  |
       1 |           |      |         |                  |           | "Mim7"   |
       2 |           |      |         |                  | "Fa"      | "Mim7"   |
       3 |           |      |         | "La"             |           | "Mim7"   |
       4 |           |      |         | "La"             | "Fa"      | "Mim7"   |
       5 |           |      | "Sib"   |                  | "Fa"      | "Mim7"   |
       6 |           |      | "Sib"   | "La"             | "Fa"      | "Mim7"   |
       7 |           | 3    |         |                  |           | "Rebm7"  |
       8 |           | 3    |         |                  | "Fa"      | "Rebm7"  |
       9 |           | 3    |         | "La"             |           | "Rebm7"  |
      10 |           | 3    |         | "La"             | "Fa"      | "Rebm7"  |
      11 |           | 3    | "Sib"   |                  |           | "Rebm7"  |
      12 |           | 3    | "Sib"   |                  | "Fa"      | "Rebm7"  |
      13 |           | 3    | "Sib"   | "La"             |           | "Rebm7"  |
      14 |           | 3    | "Sib"   | "La"             | "Fa"      | "Rebm7"  |
      15 | "Sol"     |      |         |                  |           | "Mim7"   |
      16 | "Sol"     |      |         |                  | "Fa"      | "Rem7"   |
      17 | "Sol"     |      |         | "La"             | "Fa"      | "Mim7"   |
      18 | "Sol"     |      | "Sib"   |                  |           | "Mim7"   |
      19 | "Sol"     |      | "Sib"   |                  | "Fa"      | "Rem7"   |
      20 | "Sol"     |      | "Sib"   | "La"             |           | "Solbm7" |
      21 | "Sol"     |      | "Sib"   | "La"             | "Fa"      | "Mim7"   |
      22 | "Sol"     | 3    |         |                  |           | "Do#m7"  |
      23 | "Sol"     | 3    |         |                  | "Fa"      | "Sim7"   |
      24 | "Sol"     | 3    |         | "La"             |           | "Mibm7"  |
      25 | "Sol"     | 3    |         | "La"             | "Fa"      | "Do#m7"  |
      26 | "Sol"     | 3    | "Sib"   |                  | "Fa"      | "Sim7"   |
      27 | "Sol"     | 3    | "Sib"   | "La"             |           | "Mibm7"  |
      28 | "Sol"     | 3    | "Sib"   | "La"             | "Fa"      | "Do#m7"  |
    `, ({
      songKey, capo, lineKey, lineTransposeKey, renderKey, outcome,
    }) => {
      const song = new Song();
      song.metadata.add('key', songKey);
      song.metadata.add('capo', capo);

      const line = new Line();
      line.key = lineKey;
      line.transposeKey = lineTransposeKey;

      const renderedChord = renderChord('Mim7', line, song, { renderKey: Key.wrap(renderKey) });
      expect(renderedChord).toEqual(outcome);
    });
  });

  describe('chord styles', () => {
    eachTestCase(`
      #  | chordString | songKey | chordStyle | outcome |
      -- | ----------- | ------- | ---------- | ------- |
       1 | "Gm"        |         | "symbol"   | "Gm"    |
       2 | "Gm"        | "Bb"    | "symbol"   | "Gm"    |
       s | "Gm"        | "Bb"    | "number"   | "6"     |
       s | "Gm"        | "Bb"    | "numeral"  | "vi"    |
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
      15 | "Solm"      |         | "solfege"  | "Solm"  |
      16 | "Solm"      | "Sib"   | "solfege"  | "Solm"  |
      17 | "IV"        | "Sib"   | "solfege"  | "Mib"   |
      18 | "4"         | "Sib"   | "solfege"  | "Mib"   |
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
