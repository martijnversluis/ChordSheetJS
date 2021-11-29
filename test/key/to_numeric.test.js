/* eslint quote-props: 0 */

import { Key } from '../../src';

import '../matchers';

const examples = {
  'C': {
    'C': '1',
    'C#': '#1',
    'D': '2',
    'D#': '#2',
    'B': '7',
  },

  'C#': {
    'D#': '2',
    'E': '#2',
    'D': '#1',
    'G': '#4',
  },

  'Eb': {
    'F': '2',
    'Gb': 'b3',
    'E': 'b2',
  },

  'B': {
    'F#': '5',
    'A#': '7',
  },
};

describe('Key', () => {
  describe('toNumeric', () => {
    Object.entries(examples).forEach(([songKeyString, conversions]) => {
      const songKey = Key.parse(songKeyString);

      Object.entries(conversions).forEach(([symbolKey, numericKey]) => {
        it(`converts ${symbolKey} to ${numericKey} (actual key: ${songKey})`, () => {
          const key = Key.parse(symbolKey);
          const numericString = key.toNumericString(songKey);
          expect(numericString).toEqual(numericKey);
        });
      });
    });

    it('returns a clone when the key is already numeric', () => {
      const key = new Key({ note: 5, modifier: '#' });
      const numericKey = key.toNumeric();

      expect(numericKey).toBeKey({ note: 5, modifier: '#' });
      expect(numericKey).not.toBe(key);
    });
  });
});
