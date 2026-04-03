import { chopFirstWord, isWideCharacter, buildVisualColumnMap } from '../../src/parser/parser_helpers';
import { eachTestCase } from '../util/utilities';

describe('parser helpers', () => {
  describe('isWideCharacter', () => {
    it('returns true for CJK characters', () => {
      expect(isWideCharacter('人')).toBe(true);
      expect(isWideCharacter('가')).toBe(true);  // Hangul
      expect(isWideCharacter('あ')).toBe(true);  // Hiragana
    });

    it('returns false for Latin characters', () => {
      expect(isWideCharacter('A')).toBe(false);
      expect(isWideCharacter(' ')).toBe(false);
      expect(isWideCharacter('#')).toBe(false);
    });
  });

  describe('buildVisualColumnMap', () => {
    it('maps 1:1 for Latin-only text', () => {
      expect(buildVisualColumnMap('abc')).toEqual([0, 1, 2]);
    });

    it('maps CJK characters to 2 visual columns each', () => {
      // '人a' → 人 takes cols 0,1 and 'a' takes col 2
      expect(buildVisualColumnMap('人a')).toEqual([0, 0, 1]);
    });

    it('handles mixed CJK and Latin text', () => {
      // '人ab世' → 人(0,0) a(1) b(2) 世(3,3)
      expect(buildVisualColumnMap('人ab世')).toEqual([0, 0, 1, 2, 3, 3]);
    });
  });

  describe('chopFirstWord', () => {
    eachTestCase(`
      # | string            | outcome                 |
      - | ----------------- | ----------------------- |
      1 | "one"             | ["one", null          ] |
      2 | " one"            | ["", "one"            ] |
      3 | "one "            | ["one ", null         ] |
      4 | " one "           | ["", "one "           ] |
      5 | "one two"         | ["one", "two"         ] |
      6 | " one two"        | ["", "one two"        ] |
      7 | "one two "        | ["one", "two "        ] |
      8 | " one two "       | ["", "one two "       ] |
      8 | " one two three"  | ["", "one two three"  ] |
      8 | " one two three " | ["", "one two three " ] |
    `, ({ string, outcome }) => {
      expect(chopFirstWord(string)).toEqual(outcome);
    });
  });
});
