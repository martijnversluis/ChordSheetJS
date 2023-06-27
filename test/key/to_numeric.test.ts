/* eslint quote-props: 0 */

import { Key, NUMERIC } from '../../src';
import { FLAT, SHARP } from '../../src/constants';

const examples = {
  'C': {
    'C': '1',
    'C#': '#1',
    'D': '2',
    'D#': '#2',
    'B': '7',

    'I': '1',
    '#I': '#1',
    'II': '2',
    '#II': '#2',
    'VII': '7',
  },

  'C#': {
    'D#': '2',
    'E': '#2',
    'D': '#1',
    'G': '#4',

    'II': '2',
    '#II': '#2',
    '#I': '#1',
    '#IV': '#4',
  },

  'Eb': {
    'F': '2',
    'Gb': 'b3',
    'E': 'b2',

    'II': '2',
    'bIII': 'b3',
    'bII': 'b2',
  },

  'B': {
    'F#': '5',
    'A#': '7',

    'V': '5',
    'VII': '7',
  },
};

describe('Key', () => {
  describe('toNumeric', () => {
    Object.entries(examples).forEach(([songKeyString, conversions]) => {
      const songKey = Key.parse(songKeyString);

      Object.entries(conversions).forEach(([symbolKey, numericKey]) => {
        it(`converts ${symbolKey} to ${numericKey} (actual key: ${songKey})`, () => {
          const key = Key.parseOrFail(symbolKey);
          const numericString = key.toNumericString(songKey);
          expect(numericString).toEqual(numericKey);
        });
      });
    });

    it('returns a clone when the key is already numeric', () => {
      const key = new Key({
        grade: 5,
        type: NUMERIC,
        modifier: SHARP,
        preferredModifier: FLAT,
        minor: false,
      });

      const numericKey = key.toNumeric();

      expect(numericKey).toEqual(key);
      expect(numericKey).not.toBe(key);
    });
  });
});
