/* eslint quote-props: 0 */

import { toChordSymbol, parseChord } from '../../src';

const examples = [
  [
    ['C', 'Am'],
    {
      '1': 'C',
      'b1': 'B',
      '#1': 'C#',
      '1M': 'C',
      '1m': 'Cm',
      '#1m': 'C#m',
      '2': 'Dm',
      '2M': 'D',
      '2m': 'Dm',
      '#2M': 'D#',
      '7': 'Bdim',
      '#1sus4': 'C#sus4',
    },
  ],

  [
    ['C#', 'A#m'],
    {
      '2': 'D#m',
      '#2': 'Em',
      'b2': 'Dm',
      'b5/#7': 'G/C#',
    },
  ],

  [
    ['Eb', 'Cm'],
    {
      '2': 'Fm',
      '#2': 'Gbm',
      'b2': 'Em',
    },
  ],
];

describe('numeric chords', () => {
  describe('#toChordSymbol', () => {
    examples.forEach(([keys, conversions]) => {
      keys.forEach((key) => {
        describe(`For key ${key}`, () => {
          Object.entries(conversions).forEach(([numericChord, chordSymbol]) => {
            it(`converts ${numericChord} to ${chordSymbol}`, () => {
              const chord = parseChord(numericChord);
              expect(toChordSymbol(chord, key).toString()).toEqual(chordSymbol);
            });
          });
        });
      });
    });
  });
});
