/* eslint quote-props: 0 */

import Key from '../../src/key';

const examples = {
  'Do': {
    '1': 'Do',
    'b1': 'Si',
    '#1': 'Do#',
    '2': 'Re',
    '#2': 'Re#',
    '7': 'Si',

    'I': 'Do',
    'bI': 'Si',
    '#I': 'Do#',
    'II': 'Re',
    '#II': 'Re#',
    'VII': 'Si',
  },

  'Do#': {
    '2': 'Re#',
    '#2': 'Mi',
    'b2': 'Re',
    'b5': 'Sol',

    'II': 'Re#',
    '#II': 'Mi',
    'bII': 'Re',
    'bV': 'Sol',
  },

  'Mib': {
    '2': 'Fa',
    '#2': 'Fa#',
    'b2': 'Mi',

    'II': 'Fa',
    '#II': 'Fa#',
    'bII': 'Mi',
  },
};

describe('Key', () => {
  describe('#toChordSolfege', () => {
    Object.entries(examples).forEach(([songKeyString, conversions]) => {
      const songKey = Key.parseOrFail(songKeyString);

      Object.entries(conversions).forEach(([numericKey, solfegeKey]) => {
        it(`converts ${numericKey} to ${solfegeKey} (actual key: ${songKey})`, () => {
          const key = Key.parseOrFail(numericKey);
          const keySolfegeString = key.toChordSolfegeString(songKey);
          expect(keySolfegeString).toEqual(solfegeKey);
        });
      });
    });
  });
});
