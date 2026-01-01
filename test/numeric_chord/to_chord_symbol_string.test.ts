/* eslint quote-props: 0 */

import { Chord } from '../../src';

const majorExamples = {
  'Ab': {
    '1': 'Ab',

    'b2': 'A',

    '2': 'Bb',

    'b3': 'Cb',

    '3': 'C',
    '4': 'Db',
    'b5': 'D',
    '5': 'Eb',
    'b6': 'E',
    '6': 'F',
    '7': 'G',
  },

  'A': {
    '1': 'A',
    '1m': 'Am',
    '2': 'B',
    '2maj': 'B',
    '2m': 'Bm',
    '4': 'D',
    '1/3': 'A/C#',
    '3': 'C#',
    '5/7': 'E/G#',
    'b3': 'C',
    '7': 'G#',
    '7dim': 'G#dim',
    '#1sus': 'A#sus',
  },

  'Bb': {
    '1': 'Bb',
    'b2': 'Cb',
    '2': 'C',
    'b3': 'Db',
    '3': 'D',
    '4': 'Eb',
    'b5': 'E',
    '5': 'F',
    'b6': 'Gb',
    '6': 'G',
    'b7': 'Ab',
    '7': 'A',
  },

  'B': {
    '1': 'B',
    'b2': 'C',
    '2': 'C#',
    'b3': 'D',
    '3': 'D#',
    '4': 'E',
    'b5': 'F',
    '5': 'F#',
    'b6': 'G',
    '6': 'G#',
    'b7': 'A',
    '7': 'A#',
  },

  'Cb': {
    '1': 'Cb',
    'b2': 'C',
    '2': 'Db',
    'b3': 'D',
    '3': 'Eb',
    '4': 'Fb',
    'b5': 'F',
    '5': 'Gb',
    'b6': 'G',
    '6': 'Ab',
    'b7': 'A',
    '7': 'Bb',
  },

  'C': {
    '1': 'C',
    'b2': 'Db',
    '2': 'D',
    'b3': 'Eb',
    '3': 'E',
    '3(7)/#5': 'E(7)/G#',
    '4': 'F',
    'b5': 'Gb',
    '5': 'G',
    'b6': 'Ab',
    '6': 'A',
    'b7': 'Bb',
    '7': 'B',
  },

  'C#': {
    '1': 'C#',
    'b2': 'D',
    '2': 'D#',
    'b3': 'E',
    '3': 'F',
    '4': 'F#',
    'b5': 'G',
    '5': 'G#',
    'b6': 'A',
    '6': 'A#',
    'b7': 'B',
    '7': 'C',
  },

  'Db': {
    '1': 'Db',
    'b2': 'D',
    '2': 'Eb',
    'b3': 'E',
    '3': 'F',
    '37/#5': 'F7/A',
    '4': 'Gb',
    'b5': 'G',
    '5': 'Ab',
    'b6': 'A',
    '6': 'Bb',
    'b7': 'B',
    '7': 'C',
  },

  'D': {
    '1': 'D',
    'b2': 'Eb',
    '2': 'E',
    'b3': 'F',
    '3': 'F#',
    '4': 'G',
    'b5': 'Ab',
    '5': 'A',
    'b6': 'Bb',
    '6': 'B',
    'b7': 'C',
    '7': 'C#',
  },

  'Eb': {
    '1': 'Eb',
    'b2': 'E',
    '2': 'F',
    'b3': 'Gb',
    '3': 'G',
    '4': 'Ab',
    'b5': 'A',
    '5': 'Bb',
    'b6': 'B',
    '6': 'C',
    'b7': 'Db',
    '7': 'D',
  },

  'E': {
    '1': 'E',
    'b2': 'F',
    '2': 'F#',
    'b3': 'G',
    '3': 'G#',
    '4': 'A',
    'b5': 'Bb',
    '5': 'B',
    'b6': 'C',
    '6': 'C#',
    'b7': 'D',
    '7': 'D#',
  },

  'F': {
    '1': 'F',
    'b2': 'Gb',
    '2': 'G',
    'b3': 'Ab',
    '3': 'A',
    '4': 'Bb',
    'b5': 'B',
    '5': 'C',
    'b6': 'Db',
    '6': 'D',
    'b7': 'Eb',
    '7': 'E',
  },

  'F#': {
    '1': 'F#',
    'b2': 'G',
    '2': 'G#',
    'b3': 'A',
    '3': 'A#',
    '4': 'B',
    'b5': 'C',
    '5': 'C#',
    'b6': 'D',
    '6': 'D#',
    'b7': 'E',
    '7': 'F',
  },

  'Gb': {
    '1': 'Gb',
    'b2': 'G',
    '2': 'Ab',
    'b3': 'A',
    '3': 'Bb',
    '4': 'Cb',
    'b5': 'C',
    '5': 'Db',
    'b6': 'D',
    '6': 'Eb',
    'b7': 'Fb',
    '7': 'F',
  },

  'G': {
    '1': 'G',
    'b2': 'Ab',
    '2': 'A',
    'b3': 'Bb',
    '3': 'B',
    '4': 'C',
    'b5': 'Db',
    '5': 'D',
    'b6': 'Eb',
    '6': 'E',
    'b7': 'F',
    '7': 'F#',
  },

  'G#': {
    '1': 'G#',
    'b2': 'A',
    '2': 'Bb',
    'b3': 'B',
    '3': 'C',
    '4': 'C#',
    'b5': 'D',
    '5': 'Eb',
    'b6': 'E',
    '6': 'F',
    'b7': 'Gb',
    '7': 'G',
  },
};

const minorExamples = {
  'Am': {
    '1m': 'Cm',
    'b2m': 'Dbm',
    '2m': 'Dm',
    '3m': 'Ebm',
    'b4m': 'Em',
    '4m': 'Fm',
    'b5m': 'Gbm',
    '5m': 'Abm',
    '6m': 'Am',
    '#6m': 'Bbm',
    'b7m': 'Bbm',
    '7m': 'Bbm'
    ,
  },

  'Bbm': {
    '1m': 'Dbm',
    'b2m': 'Dm',
    '2m': 'Ebm',
    '3m': 'Em',
    'b4m': 'Fm',
    '4m': 'Gbm',
    'b5m': 'Gm',
    '5m': 'Am',
    '6m': 'Bbm',
    '#6m': 'Bm',
    'b7m': 'Bm',
    '7m': 'Bm',

  },

  'Bm': {
    '1m': 'Dm',
    'b2m': 'Ebm',
    '2m': 'Em',
    '3m': 'Fm',
    'b4m': 'F#m',
    '4m': 'Gm',
    'b5m': 'Abm',
    '5m': 'Bbm',
    '6m': 'Bm',
    '#6m': 'Cm',
    'b7m': 'Cm',
    '7m': 'Cm',

  },

  'Cm': {
    '1m': 'D#m',
    'b2m': 'Em',
    '2m': 'Fm',
    '3m': 'F#m',
    'b4m': 'Gm',
    '4m': 'G#m',
    'b5m': 'Am',
    '5m': 'Bm',
    '6m': 'Cm',
    '#6m': 'C#m',
    'b7m': 'C#m',
    '7m': 'C#m'
    ,
  },

  'C#m': {
    '1m': 'Em',
    'b2m': 'Fm',
    '2m': 'F#m',
    '3m': 'Gm',
    'b4m': 'G#m',
    '4m': 'Am',
    'b5m': 'Bbm',
    '5m': 'Cm',
    '6m': 'C#m',
    '#6m': 'Dm',
    'b7m': 'Dm',
    '7m': 'Dm',

  },

  'Dm': {
    '1m': 'Fm',
    'b2m': 'Gbm',
    '2m': 'Gm',
    '3m': 'Abm',
    'b4m': 'Am',
    '4m': 'Bbm',
    'b5m': 'Bm',
    '5m': 'C#m',
    '6m': 'Dm',
    '#6m': 'Ebm',
    'b7m': 'Ebm',
    '7m': 'Ebm'
    ,
  },

  'Ebm': {
    '1m': 'Gbm',
    'b2m': 'Gm',
    '2m': 'Abm',
    '3m': 'Am',
    'b4m': 'Bbm',
    '4m': 'Cbm',
    'b5m': 'Cm',
    '5m': 'Dm',
    '6m': 'Ebm',
    '#6m': 'Fbm',
    'b7m': 'Fbm',
    '7m': 'Fbm'
    ,
  },

  'Em': {
    '1m': 'Gm',
    'b2m': 'Abm',
    '2m': 'Am',
    '3m': 'Bbm',
    'b4m': 'Bm',
    '4m': 'Cm',
    'b5m': 'Dbm',
    '5m': 'Ebm',
    '6m': 'Em',
    '#6m': 'Fm',
    'b7m': 'Fm',
    '7m': 'Fm',

  },

  'Fm': {
    '1m': 'G#m',
    'b2m': 'Am',
    '2m': 'Bbm',
    '3m': 'Bm',
    'b4m': 'Cm',
    '4m': 'C#m',
    'b5m': 'Dm',
    '5m': 'Em',
    '6m': 'Fm',
    '#6m': 'F#m',
    'b7m': 'F#m',
    '7m': 'F#m'
    ,
  },

  'F#m': {
    '1m': 'Am',
    'b2m': 'Bbm',
    '2m': 'Bm',
    '3m': 'Cm',
    'b4m': 'Dbm',
    '4m': 'Dm',
    'b5m': 'Ebm',
    '5m': 'Fm',
    '6m': 'F#m',
    '#6m': 'Gm',
    'b7m': 'Gm',
    '7m': 'Gm',

  },

  'Gm': {
    '1m': 'A#m',
    'b2m': 'Bm',
    '2m': 'Cm',
    '3m': 'C#m',
    'b4m': 'Dm',
    '4m': 'D#m',
    'b5m': 'Em',
    '5m': 'F#m',
    '6m': 'Gm',
    '#6m': 'G#m',
    'b7m': 'G#m',
    '7m': 'G#m'
    ,
  },

  'G#m': {
    '1m': 'Bm',
    'b2m': 'Cm',
    '2m': 'C#m',
    '3m': 'Dm',
    'b4m': 'D#m',
    '4m': 'Em',
    'b5m': 'Fm',
    '5m': 'Gm',
    '6m': 'G#m',
    '#6m': 'Am',
    'b7m': 'Am',
    '7m': 'Am',
  },
};

describe('numeric chords', () => {
  describe('#toChordSymbol', () => {
    describe('major Keys', () => {
      Object.entries(majorExamples).forEach(([key, conversions]) => {
        describe(`For key ${key}`, () => {
          const keyChord = Chord.parseOrFail(key);
          const songKey = keyChord.root;

          Object.entries(conversions).forEach(([numericChord, chordSymbol]) => {
            it(`converts ${numericChord} to ${chordSymbol}`, () => {
              const chord = Chord.parseOrFail(numericChord);
              const chordSymbolString = chord.toChordSymbolString(songKey);
              expect(chordSymbolString).toEqual(chordSymbol);
            });
          });
        });
      });
    });

    describe('minor Keys', () => {
      Object.entries(minorExamples).forEach(([key, conversions]) => {
        describe(`For key ${key}`, () => {
          const keyChord = Chord.parseOrFail(key);
          const songKey = keyChord.root;

          Object.entries(conversions).forEach(([numericChord, chordSymbol]) => {
            it(`converts ${numericChord} to ${chordSymbol}`, () => {
              const chord = Chord.parseOrFail(numericChord);
              const symbolChord = chord.toChordSymbol(songKey);
              const symbolChordString = symbolChord.toString();
              expect(symbolChordString).toEqual(chordSymbol);
            });
          });
        });
      });
    });
  });
});
