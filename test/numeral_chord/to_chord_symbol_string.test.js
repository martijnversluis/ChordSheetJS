/* eslint quote-props: 0 */

import { Chord } from '../../src';

const examples = [
  [
    ['C', 'Am'],
    {
      'I': 'C',
      'bI': 'B',
      '#I': 'C#',
      'i': 'Cm',
      '#i': 'C#m',
      'II': 'D',
      'ii': 'Dm',
      '#II': 'D#',
      '#ii': 'D#m',
      'VII': 'B',
      '#Isus4': 'C#sus4',
    },
  ],

  [
    ['C#', 'A#m'],
    {
      'II': 'D#',
      'ii': 'D#m',
      '#II': 'E',
      '#ii': 'Em',
      'bII': 'D',
      'bii': 'Dm',
      'bV/#VII': 'G/C#',
    },
  ],

  [
    ['Eb', 'Cm'],
    {
      'II': 'F',
      'ii': 'Fm',
      '#II': 'Gb',
      '#ii': 'Gbm',
      'bII': 'E',
      'bii': 'Em',
    },
  ],
];

describe('numeral chords', () => {
  describe('#toChordSymbol', () => {
    examples.forEach(([keys, conversions]) => {
      keys.forEach((key) => {
        describe(`For key ${key}`, () => {
          const keyChord = Chord.parse(key);
          let songKey = keyChord.root;

          if (keyChord.suffix === 'm') {
            songKey = songKey.transpose(-9);
          }

          Object.entries(conversions).forEach(([numericChord, chordSymbol]) => {
            it(`converts ${numericChord} to ${chordSymbol}`, () => {
              const chord = Chord.parse(numericChord);
              const chordSymbolString = chord.toChordSymbolString(songKey);
              expect(chordSymbolString).toEqual(chordSymbol);
            });
          });
        });
      });
    });
  });
});
