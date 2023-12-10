import { eachTestCase } from '../utilities';
import { chopFirstWord } from '../../src/parser/parser_helpers';

describe('parser helpers', () => {
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
