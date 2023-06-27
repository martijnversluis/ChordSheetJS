/* eslint quote-props: 0 */

import Key from '../../src/key';

const examples = {
  'C': {
    '1': 'C',
    'b1': 'B',
    '#1': 'C#',
    '2': 'D',
    '#2': 'D#',
    '7': 'B',

    'I': 'C',
    'bI': 'B',
    '#I': 'C#',
    'II': 'D',
    '#II': 'D#',
    'VII': 'B',
  },

  'C#': {
    '2': 'D#',
    '#2': 'E',
    'b2': 'D',
    'b5': 'G',

    'II': 'D#',
    '#II': 'E',
    'bII': 'D',
    'bV': 'G',
  },

  'Eb': {
    '2': 'F',
    '#2': 'F#',
    'b2': 'E',

    'II': 'F',
    '#II': 'F#',
    'bII': 'E',
  },
};

describe('Key', () => {
  describe('#toChordSymbol', () => {
    Object.entries(examples).forEach(([songKeyString, conversions]) => {
      const songKey = Key.parseOrFail(songKeyString);

      Object.entries(conversions).forEach(([numericKey, symbolKey]) => {
        it(`converts ${numericKey} to ${symbolKey} (actual key: ${songKey})`, () => {
          const key = Key.parseOrFail(numericKey);
          const keySymbolString = key.toChordSymbolString(songKey);
          expect(keySymbolString).toEqual(symbolKey);
        });
      });
    });
  });
});
