/* eslint quote-props: 0 */

import { Chord } from '../../src';

const majorExamples = {
  'Ab': {
    'I': 'Ab',
    'bII': 'A',
    'II': 'Bb',
    'bIII': 'Cb',
    'III': 'C',
    'IV': 'Db',
    'bV': 'D',
    'V': 'Eb',
    'bVI': 'E',
    'VI': 'F',
    'VII': 'G',
  },

  'A': {
    'I': 'A',
    'i': 'Am',
    'II': 'B',
    'IImaj': 'B',
    'ii': 'Bm',
    'IV': 'D',
    'I/III': 'A/C#',
    'III': 'C#',
    'V/VII': 'E/G#',
    'bIII': 'C',
    'VII': 'G#',
    'VIIdim': 'G#dim',
    '#Isus': 'A#sus',
  },

  'Bb': {
    'I': 'Bb',
    'bII': 'B',
    'II': 'C',
    'bIII': 'Db',
    'III': 'D',
    'IV': 'Eb',
    'bV': 'E',
    'V': 'F',
    'bVI': 'Gb',
    'VI': 'G',
    'bVII': 'Ab',
    'VII': 'A',
  },

  'B': {
    'I': 'B',
    'bII': 'C',
    'II': 'C#',
    'bIII': 'D',
    'III': 'D#',
    'IV': 'E',
    'bV': 'F',
    'V': 'F#',
    'bVI': 'G',
    'VI': 'G#',
    'bVII': 'A',
    'VII': 'A#',
  },

  'Cb': {
    'I': 'Cb',
    'bII': 'C',
    'II': 'Db',
    'bIII': 'D',
    'III': 'Eb',
    'IV': 'Fb',
    'bV': 'F',
    'V': 'Gb',
    'bVI': 'G',
    'VI': 'Ab',
    'bVII': 'A',
    'VII': 'Bb',
  },

  'C': {
    'I': 'C',
    'bII': 'Db',
    'II': 'D',
    'bIII': 'Eb',
    'III': 'E',
    'III(VII)/#V': 'E(VII)/G#',
    'IV': 'F',
    'bV': 'Gb',
    'V': 'G',
    'bVI': 'Ab',
    'VI': 'A',
    'bVII': 'Bb',
    'VII': 'B',
  },

  'C#': {
    'I': 'C#',
    'bII': 'D',
    'II': 'D#',
    'bIII': 'E',
    'III': 'F',
    'IV': 'F#',
    'bV': 'G',
    'V': 'G#',
    'bVI': 'A',
    'VI': 'A#',
    'bVII': 'B',
    'VII': 'C',
  },

  'Db': {
    'I': 'Db',
    'bII': 'D',
    'II': 'Eb',
    'bIII': 'E',
    'III': 'F',
    'IIIVII/#V': 'FVII/A',
    'IV': 'Gb',
    'bV': 'G',
    'V': 'Ab',
    'bVI': 'A',
    'VI': 'Bb',
    'bVII': 'Cb',
    'VII': 'C',
  },

  'D': {
    'I': 'D',
    'bII': 'Eb',
    'II': 'E',
    'bIII': 'F',
    'III': 'F#',
    'IV': 'G',
    'bV': 'Ab',
    'V': 'A',
    'bVI': 'Bb',
    'VI': 'B',
    'bVII': 'C',
    'VII': 'C#',
  },

  'Eb': {
    'I': 'Eb',
    'bII': 'E',
    'II': 'F',
    'bIII': 'Gb',
    'III': 'G',
    'IV': 'Ab',
    'bV': 'A',
    'V': 'Bb',
    'bVI': 'B',
    'VI': 'C',
    'bVII': 'Db',
    'VII': 'D',
  },

  'E': {
    'I': 'E',
    'bII': 'F',
    'II': 'F#',
    'bIII': 'G',
    'III': 'G#',
    'IV': 'A',
    'bV': 'Bb',
    'V': 'B',
    'bVI': 'C',
    'VI': 'C#',
    'bVII': 'D',
    'VII': 'Eb',
  },

  'F': {
    'I': 'F',
    'bII': 'Gb',
    'II': 'G',
    'bIII': 'Ab',
    'III': 'A',
    'IV': 'Bb',
    'bV': 'B',
    'V': 'C',
    'bVI': 'Db',
    'VI': 'D',
    'bVII': 'Eb',
    'VII': 'E',
  },

  'F#': {
    'I': 'F#',
    'bII': 'G',
    'II': 'G#',
    'bIII': 'A',
    'III': 'A#',
    'IV': 'B',
    'bV': 'C',
    'V': 'C#',
    'bVI': 'D',
    'VI': 'D#',
    'bVII': 'E',
    'VII': 'F',
  },

  'Gb': {
    'I': 'Gb',
    'bII': 'G',
    'II': 'Ab',
    'bIII': 'A',
    'III': 'Bb',
    'IV': 'Cb',
    'bV': 'C',
    'V': 'Db',
    'bVI': 'D',
    'VI': 'Eb',
    'bVII': 'Fb',
    'VII': 'F',
  },

  'G': {
    'I': 'G',
    'bII': 'Ab',
    'II': 'A',
    'bIII': 'Bb',
    'III': 'B',
    'IV': 'C',
    'bV': 'Db',
    'V': 'D',
    'bVI': 'Eb',
    'VI': 'E',
    'bVII': 'F',
    'VII': 'F#',
  },

  'G#': {
    'I': 'G#',
    'bII': 'A',
    'II': 'Bb',
    'bIII': 'B',
    'III': 'C',
    'IV': 'C#',
    'bV': 'D',
    'V': 'Eb',
    'bVI': 'E',
    'VI': 'F',
    'bVII': 'Gb',
    'VII': 'G',
  },
};

const minorExamples = {
  'Am': {
    'i': 'Am',
    'bii': 'Bbm',
    'ii': 'Bm',
    'IIIm': 'Cm',
    'biv': 'Dbm',
    'iv': 'Dm',
    'bv': 'Ebm',
    'v': 'Em',
    'vi': 'Fm',
    '#vi': 'Gbm',
    'bvii': 'Gm',
    'vii': 'Abm',
  },

  'Bbm': {
    'i': 'Bbm',
    'bii': 'Bm',
    'ii': 'Cm',
    'IIIm': 'Dbm',
    'biv': 'Dm',
    'iv': 'Ebm',
    'bv': 'Em',
    'v': 'Fm',
    'vi': 'F#m',
    '#vi': 'Gm',
    'bvii': 'Abm',
    'vii': 'Am',
  },

  'Bm': {
    'i': 'Bm',
    'bii': 'Cm',
    'ii': 'C#m',
    'IIIm': 'Dm',
    'biv': 'Ebm',
    'iv': 'Em',
    'bv': 'Fm',
    'v': 'F#m',
    'vi': 'Gm',
    '#vi': 'G#m',
    'bvii': 'Am',
    'vii': 'Bbm',
  },

  'Cm': {
    'i': 'Cm',
    'bii': 'Dbm',
    'ii': 'Dm',
    'IIIm': 'Ebm',
    'biv': 'Em',
    'iv': 'Fm',
    'bv': 'Gbm',
    'v': 'Gm',
    'vi': 'Abm',
    '#vi': 'Am',
    'bvii': 'Bbm',
    'vii': 'Bm',
  },

  'C#m': {
    'i': 'C#m',
    'bii': 'Dm',
    'ii': 'Ebm',
    'IIIm': 'Em',
    'biv': 'Fm',
    'iv': 'F#m',
    'bv': 'Gm',
    'v': 'G#m',
    'vi': 'Am',
    '#vi': 'Bbm',
    'bvii': 'Bm',
    'vii': 'Cm',
  },

  'Dm': {
    'i': 'Dm',
    'bii': 'Ebm',
    'ii': 'Em',
    'IIIm': 'Fm',
    'biv': 'Gbm',
    'iv': 'Gm',
    'bv': 'Abm',
    'v': 'Am',
    'vi': 'Bbm',
    '#vi': 'Bm',
    'bvii': 'Cm',
    'vii': 'Dbm',
  },

  'Ebm': {
    'i': 'Ebm',
    'bii': 'Em',
    'ii': 'Fm',
    'IIIm': 'Gbm',
    'biv': 'Gm',
    'iv': 'Abm',
    'bv': 'Am',
    'v': 'Bbm',
    'vi': 'Bm',
    '#vi': 'Cm',
    'bvii': 'Dbm',
    'vii': 'Dm',
  },

  'Em': {
    'i': 'Em',
    'bii': 'Fm',
    'ii': 'F#m',
    'IIIm': 'Gm',
    'biv': 'Abm',
    'iv': 'Am',
    'bv': 'Bbm',
    'v': 'Bm',
    'vi': 'Cm',
    '#vi': 'Dbm',
    'bvii': 'Dm',
    'vii': 'Ebm',
  },

  'Fm': {
    'i': 'Fm',
    'bii': 'Gbm',
    'ii': 'Gm',
    'IIIm': 'Abm',
    'biv': 'Am',
    'iv': 'Bbm',
    'bv': 'Bm',
    'v': 'Cm',
    'vi': 'Dbm',
    '#vi': 'Dm',
    'bvii': 'Ebm',
    'vii': 'Em',
  },

  'F#m': {
    'i': 'F#m',
    'bii': 'Gm',
    'ii': 'G#m',
    'IIIm': 'Am',
    'biv': 'Bbm',
    'iv': 'Bm',
    'bv': 'Cm',
    'v': 'C#m',
    'vi': 'Dm',
    '#vi': 'Ebm',
    'bvii': 'Em',
    'vii': 'Fm',
  },

  'Gm': {
    'i': 'Gm',
    'bii': 'Abm',
    'ii': 'Am',
    'IIIm': 'Bbm',
    'biv': 'Bm',
    'iv': 'Cm',
    'bv': 'Dbm',
    'v': 'Dm',
    'vi': 'Ebm',
    '#vi': 'Em',
    'bvii': 'Fm',
    'vii': 'Gbm',
  },

  'G#m': {
    'i': 'G#m',
    'bii': 'Am',
    'ii': 'A#m',
    'IIIm': 'Bm',
    'biv': 'Cm',
    'iv': 'C#m',
    'bv': 'Dm',
    'v': 'D#m',
    'vi': 'Em',
    '#vi': 'Fm',
    'bvii': 'Gbm',
    'vii': 'Gm',
  },
};

describe('numeral chords', () => {
  describe('toChordSymbol', () => {
    describe('major Keys', () => {
      Object.entries(majorExamples).forEach(([key, conversions]) => {
        describe(`For key ${key}`, () => {
          const keyChord = Chord.parseOrFail(key);
          const songKey = keyChord.root;

          Object.entries(conversions).forEach(([numeralChord, chordSymbol]) => {
            it(`converts ${numeralChord} to ${chordSymbol}`, () => {
              const chord = Chord.parseOrFail(numeralChord);
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

          Object.entries(conversions).forEach(([numeralChord, chordSymbol]) => {
            it(`converts ${numeralChord} to ${chordSymbol}`, () => {
              const chord = Chord.parseOrFail(numeralChord);
              const chordSymbolString = chord.toChordSymbolString(songKey);
              expect(chordSymbolString).toEqual(chordSymbol);
            });
          });
        });
      });
    });
  });
});
