import Line from '../../src/chord_sheet/line';
import Song from '../../src/chord_sheet/song';

import { Key } from '../../src';
import { eachTestCase } from '../utilities';
import { renderChord } from '../../src/helpers';

describe('renderChord helper', () => {
  describe('chord transposition symbol', () => {
    eachTestCase(`
      #  | songKey | capo | lineKey | lineTransposeKey | renderKey | decapo | outcome |
      -- | ------- | ---- | ------- | ---------------- | --------- | ------ | ------- |
       1 |         |      |         |                  |           |        | "Em7"   |
       2 |         |      |         |                  | "F"       |        | "Em7"   |
       3 |         |      |         | "A"              |           |        | "Em7"   |
       4 |         |      |         | "A"              | "F"       |        | "Em7"   |
       5 |         |      | "Bb"    |                  | "F"       |        | "Em7"   |
       6 |         |      | "Bb"    | "A"              | "F"       |        | "Em7"   |
       7 |         | 3    |         |                  |           | true   | "Dbm7"  |
       8 |         | 3    |         |                  | "F"       | true   | "Dbm7"  |
       9 |         | 3    |         | "A"              |           | true   | "Dbm7"  |
      10 |         | 3    |         | "A"              | "F"       | true   | "Dbm7"  |
      11 |         | 3    | "Bb"    |                  |           | true   | "Dbm7"  |
      12 |         | 3    | "Bb"    |                  | "F"       | true   | "Dbm7"  |
      13 |         | 3    | "Bb"    | "A"              |           | true   | "Dbm7"  |
      14 |         | 3    | "Bb"    | "A"              | "F"       | true   | "Dbm7"  |
      15 | "G"     |      |         |                  |           |        | "Em7"   |
      16 | "G"     |      |         |                  | "F"       |        | "Dm7"   |
      17 | "G"     |      |         | "A"              | "F"       |        | "Em7"   |
      18 | "G"     |      | "Bb"    |                  |           |        | "Em7"   |
      19 | "G"     |      | "Bb"    |                  | "F"       |        | "Dm7"   |
      20 | "G"     |      | "Bb"    | "A"              |           |        | "Gbm7"  |
      21 | "G"     |      | "Bb"    | "A"              | "F"       |        | "Em7"   |
      22 | "G"     | 3    |         |                  |           | true   | "C#m7"  |
      23 | "G"     | 3    |         |                  | "F"       | true   | "Bm7"   |
      24 | "G"     | 3    |         | "A"              |           | true   | "Ebm7"  |
      25 | "G"     | 3    |         | "A"              | "F"       | true   | "C#m7"  |
      26 | "G"     | 3    | "Bb"    |                  | "F"       | true   | "Bm7"   |
      27 | "G"     | 3    | "Bb"    | "A"              |           | true   | "Ebm7"  |
      28 | "G"     | 3    | "Bb"    | "A"              | "F"       | true   | "Dbm7"  |
      29 |         | 3    |         |                  |           | false  | "Em7"   |
      30 |         | 3    |         |                  | "F"       | false  | "Em7"   |
      31 |         | 3    |         | "A"              |           | false  | "Em7"   |
      32 |         | 3    |         | "A"              | "F"       | false  | "Em7"   |
      33 |         | 3    | "Bb"    |                  |           | false  | "Em7"   |
      34 |         | 3    | "Bb"    |                  | "F"       | false  | "Em7"   |
      35 |         | 3    | "Bb"    | "A"              |           | false  | "Em7"   |
      36 |         | 3    | "Bb"    | "A"              | "F"       | false  | "Em7"   |
      37 | "G"     | 3    |         |                  |           | false  | "Em7"   |
      38 | "G"     | 3    |         |                  | "F"       | false  | "Dm7"   |
      39 | "G"     | 3    |         | "A"              |           | false  | "F#m7"  |
      40 | "G"     | 3    |         | "A"              | "F"       | false  | "Em7"   |
      41 | "G"     | 3    | "Bb"    |                  | "F"       | false  | "Dm7"   |
      42 | "G"     | 3    | "Bb"    | "A"              |           | false  | "Gbm7"  |
      43 | "G"     | 3    | "Bb"    | "A"              | "F"       | false  | "Em7"   |
    `, ({
      songKey, capo, lineKey, lineTransposeKey, renderKey, decapo, outcome,
    }) => {
      const song = new Song();
      song.metadata.add('key', songKey);
      song.metadata.add('capo', capo);

      const line = new Line();
      line.key = lineKey;
      line.transposeKey = lineTransposeKey;

      const renderedChord = renderChord('Em7', line, song, { renderKey: Key.wrap(renderKey), decapo });
      expect(renderedChord).toEqual(outcome);
    });

    it('respects a higher # rendering key', () => {
      const song = new Song();
      song.metadata.add('key', 'A');
      const renderedChord = renderChord('A', new Line(), song, { renderKey: Key.parse('A#') });
      expect(renderedChord).toEqual('A#');
    });

    it('respects a lower # rendering key', () => {
      const song = new Song();
      song.metadata.add('key', 'A');
      const renderedChord = renderChord('A', new Line(), song, { renderKey: Key.parse('G#') });
      expect(renderedChord).toEqual('G#');
    });

    it('respects a higher b rendering key', () => {
      const song = new Song();
      song.metadata.add('key', 'A');
      const renderedChord = renderChord('A', new Line(), song, { renderKey: Key.parse('Bb') });
      expect(renderedChord).toEqual('Bb');
    });

    it('respects a lower b rendering key', () => {
      const song = new Song();
      song.metadata.add('key', 'A');
      const renderedChord = renderChord('A', new Line(), song, { renderKey: Key.parse('Ab') });
      expect(renderedChord).toEqual('Ab');
    });
  });

  describe('chord transposition solfege', () => {
    eachTestCase(`
      #  | songKey   | capo | lineKey | lineTransposeKey | renderKey | decapo | outcome  |
      -- | -------   | ---- | ------- | ---------------- | --------- | ------ | -------  |
       1 |           |      |         |                  |           |        | "Mim7"   |
       2 |           |      |         |                  | "Fa"      |        | "Mim7"   |
       3 |           |      |         | "La"             |           |        | "Mim7"   |
       4 |           |      |         | "La"             | "Fa"      |        | "Mim7"   |
       5 |           |      | "Sib"   |                  | "Fa"      |        | "Mim7"   |
       6 |           |      | "Sib"   | "La"             | "Fa"      |        | "Mim7"   |
       7 |           | 3    |         |                  |           | true   | "Rebm7"  |
       8 |           | 3    |         |                  | "Fa"      | true   | "Rebm7"  |
       9 |           | 3    |         | "La"             |           | true   | "Rebm7"  |
      10 |           | 3    |         | "La"             | "Fa"      | true   | "Rebm7"  |
      11 |           | 3    | "Sib"   |                  |           | true   | "Rebm7"  |
      12 |           | 3    | "Sib"   |                  | "Fa"      | true   | "Rebm7"  |
      13 |           | 3    | "Sib"   | "La"             |           | true   | "Rebm7"  |
      14 |           | 3    | "Sib"   | "La"             | "Fa"      | true   | "Rebm7"  |
      15 | "Sol"     |      |         |                  |           |        | "Mim7"   |
      16 | "Sol"     |      |         |                  | "Fa"      |        | "Rem7"   |
      17 | "Sol"     |      |         | "La"             | "Fa"      |        | "Mim7"   |
      18 | "Sol"     |      | "Sib"   |                  |           |        | "Mim7"   |
      19 | "Sol"     |      | "Sib"   |                  | "Fa"      |        | "Rem7"   |
      20 | "Sol"     |      | "Sib"   | "La"             |           |        | "Solbm7" |
      21 | "Sol"     |      | "Sib"   | "La"             | "Fa"      |        | "Mim7"   |
      22 | "Sol"     | 3    |         |                  |           | true   | "Do#m7"  |
      23 | "Sol"     | 3    |         |                  | "Fa"      | true   | "Sim7"   |
      24 | "Sol"     | 3    |         | "La"             |           | true   | "Mibm7"  |
      25 | "Sol"     | 3    |         | "La"             | "Fa"      | true   | "Do#m7"  |
      26 | "Sol"     | 3    | "Sib"   |                  | "Fa"      | true   | "Sim7"   |
      27 | "Sol"     | 3    | "Sib"   | "La"             |           | true   | "Mibm7"  |
      28 | "Sol"     | 3    | "Sib"   | "La"             | "Fa"      | true   | "Rebm7"  |
      29 |           | 3    |         |                  |           | false  | "Mim7"   |
      30 |           | 3    |         |                  | "Fa"      | false  | "Mim7"   |
      31 |           | 3    |         | "La"             |           | false  | "Mim7"   |
      32 |           | 3    |         | "La"             | "Fa"      | false  | "Mim7"   |
      33 |           | 3    | "Sib"   |                  |           | false  | "Mim7"   |
      34 |           | 3    | "Sib"   |                  | "Fa"      | false  | "Mim7"   |
      35 |           | 3    | "Sib"   | "La"             |           | false  | "Mim7"   |
      36 |           | 3    | "Sib"   | "La"             | "Fa"      | false  | "Mim7"   |
      37 | "Sol"     | 3    |         |                  |           | false  | "Mim7"   |
      38 | "Sol"     | 3    |         |                  | "Fa"      | false  | "Rem7"   |
      39 | "Sol"     | 3    |         | "La"             |           | false  | "Fa#m7"  |
      40 | "Sol"     | 3    |         | "La"             | "Fa"      | false  | "Mim7"   |
      41 | "Sol"     | 3    | "Sib"   |                  | "Fa"      | false  | "Rem7"   |
      42 | "Sol"     | 3    | "Sib"   | "La"             |           | false  | "Solbm7" |
      43 | "Sol"     | 3    | "Sib"   | "La"             | "Fa"      | false  | "Mim7"   |
    `, ({
      songKey, capo, lineKey, lineTransposeKey, renderKey, decapo, outcome,
    }) => {
      const song = new Song();
      song.metadata.add('key', songKey);
      song.metadata.add('capo', capo);

      const line = new Line();
      line.key = lineKey;
      line.transposeKey = lineTransposeKey;

      const renderedChord = renderChord('Mim7', line, song, { renderKey: Key.wrap(renderKey), decapo });
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
