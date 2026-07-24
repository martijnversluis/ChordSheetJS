/* eslint quote-props: 0 */

import Key from '../../src/key';

const examples = {
  'C': {
    '1': 'C',
    'b1': 'Cb',
    '#1': 'C#',
    '2': 'D',
    '#2': 'D#',
    '7': 'B',

    'I': 'C',
    'bI': 'Cb',
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
    'b2': 'Fb',

    'II': 'F',
    '#II': 'F#',
    'bII': 'Fb',
  },
};

describe('Key', () => {
  describe('#toChordSymbol', () => {
    it.each([
      ['1', -1, 'C', 'B'],
      ['1', 2, 'Eb', 'F'],
      ['I', -1, 'C', 'B'],
      ['I', 2, 'Eb', 'F'],
      ['2m', 1, 'C', 'Ebm'],
      ['2m', -1, 'C', 'Dbm'],
      ['ii', 1, 'C', 'Ebm'],
      ['ii', -1, 'C', 'Dbm'],
    ])('uses the current degree after transposing %s by %s', (input, delta, context, expected) => {
      const converted = Key.parseOrFail(input).transpose(delta).toChordSymbolString(Key.parseOrFail(context));

      expect(converted).toEqual(expected);
    });

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
