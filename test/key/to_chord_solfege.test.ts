/* eslint quote-props: 0 */

import Key from '../../src/key';

const examples = {
  'Do': {
    '1': 'Do',
    'b1': 'Dob',
    '#1': 'Do#',
    '2': 'Re',
    '#2': 'Re#',
    '7': 'Si',

    'I': 'Do',
    'bI': 'Dob',
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
    'b2': 'Fab',

    'II': 'Fa',
    '#II': 'Fa#',
    'bII': 'Fab',
  },
};

describe('Key', () => {
  describe('#toChordSolfege', () => {
    it.each([
      ['2m', 1, 'Do', 'Mibm'],
      ['2m', -1, 'Do', 'Rebm'],
      ['ii', 1, 'Do', 'Mibm'],
      ['ii', -1, 'Do', 'Rebm'],
    ])('uses the current minor degree after transposing %s by %s', (input, delta, context, expected) => {
      const converted = Key.parseOrFail(input).transpose(delta).toChordSolfegeString(Key.parseOrFail(context));

      expect(converted).toEqual(expected);
    });

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
