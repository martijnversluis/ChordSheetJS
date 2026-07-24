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
    'bVI': 'Fb',
    'VI': 'F',
    'VII': 'G',
  },

  'A': {
    'I': 'A',
    'i': 'Am',
    'II': 'B',
    'IImaj': 'B',
    'ii': 'Bm',
    'iii': 'C#m',
    'IV': 'D',
    'iv': 'Dm',
    'v': 'Em',
    'vi': 'F#m',
    'vii': 'G#m',
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
    'bII': 'Cb',
    'II': 'C',
    'bIII': 'Db',
    'III': 'D',
    'IV': 'Eb',
    'bV': 'Fb',
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
    'III/#V': 'E/G#',
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
    'III': 'E#',
    'IV': 'F#',
    'bV': 'G',
    'V': 'G#',
    'bVI': 'A',
    'VI': 'A#',
    'bVII': 'B',
    'VII': 'B#',
  },

  'Db': {
    'I': 'Db',
    'bII': 'D',
    'II': 'Eb',
    'bIII': 'Fb',
    'III': 'F',
    'III/#V': 'F/A',
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
    'bII': 'Fb',
    'II': 'F',
    'bIII': 'Gb',
    'III': 'G',
    'IV': 'Ab',
    'bV': 'A',
    'V': 'Bb',
    'bVI': 'Cb',
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
    'VII': 'D#',
  },

  'F': {
    'I': 'F',
    'bII': 'Gb',
    'II': 'G',
    'bIII': 'Ab',
    'III': 'A',
    'IV': 'Bb',
    'bV': 'Cb',
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
    'VII': 'E#',
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
    'II': 'A#',
    'bIII': 'B',
    'III': 'B#',
    'IV': 'C#',
    'bV': 'D',
    'V': 'D#',
    'bVI': 'E',
    'VI': 'E#',
    'bVII': 'F#',
    'VII': 'G',
  },
};

const minorExamples = {
  'Am': {
    'i': 'Cm',
    'bii': 'Dbm',
    'ii': 'Dm',
    'iii': 'Ebm',
    'biv': 'Fbm',
    'iv': 'Fm',
    'bv': 'Gbm',
    'v': 'G#m',
    'vi': 'Am',
    '#vi': 'A#m',
    'bvii': 'Bbm',
    'vii': 'Bbm'
    ,
  },

  'Bbm': {
    'i': 'Dbm',
    'bii': 'Dm',
    'ii': 'Ebm',
    'iii': 'Fbm',
    'biv': 'Fm',
    'iv': 'Gbm',
    'bv': 'Gm',
    'v': 'Am',
    'vi': 'Bbm',
    '#vi': 'Bm',
    'bvii': 'Cbm',
    'vii': 'Cbm',

  },

  'Bm': {
    'i': 'Dm',
    'bii': 'Ebm',
    'ii': 'Em',
    'iii': 'Fm',
    'biv': 'Gbm',
    'iv': 'Gm',
    'bv': 'Abm',
    'v': 'A#m',
    'vi': 'Bm',
    '#vi': 'B#m',
    'bvii': 'Cm',
    'vii': 'Cm',

  },

  'Cm': {
    'i': 'Ebm',
    'bii': 'Fbm',
    'ii': 'Fm',
    'iii': 'Gbm',
    'biv': 'Gm',
    'iv': 'Abm',
    'bv': 'Am',
    'v': 'Bm',
    'vi': 'Cm',
    '#vi': 'C#m',
    'bvii': 'Dbm',
    'vii': 'Dbm'
    ,
  },

  'C#m': {
    'i': 'Em',
    'bii': 'Fm',
    'ii': 'F#m',
    'iii': 'Gm',
    'biv': 'Abm',
    'iv': 'Am',
    'bv': 'Bbm',
    'v': 'B#m',
    'vi': 'C#m',
    '#vi': 'Dm',
    'bvii': 'Dm',
    'vii': 'Dm',

  },

  'Dm': {
    'i': 'Fm',
    'bii': 'Gbm',
    'ii': 'Gm',
    'iii': 'Abm',
    'biv': 'Am',
    'iv': 'Bbm',
    'bv': 'Cbm',
    'v': 'C#m',
    'vi': 'Dm',
    '#vi': 'D#m',
    'bvii': 'Ebm',
    'vii': 'Ebm'
    ,
  },

  'Ebm': {
    'i': 'Gbm',
    'bii': 'Gm',
    'ii': 'Abm',
    'iii': 'Am',
    'biv': 'Bbm',
    'iv': 'Cbm',
    'bv': 'Cm',
    'v': 'Dm',
    'vi': 'Ebm',
    '#vi': 'Em',
    'bvii': 'Fbm',
    'vii': 'Fbm'
    ,
  },

  'Em': {
    'i': 'Gm',
    'bii': 'Abm',
    'ii': 'Am',
    'iii': 'Bbm',
    'biv': 'Cbm',
    'iv': 'Cm',
    'bv': 'Dbm',
    'v': 'D#m',
    'vi': 'Em',
    '#vi': 'E#m',
    'bvii': 'Fm',
    'vii': 'Fm',

  },

  'Fm': {
    'i': 'Abm',
    'bii': 'Am',
    'ii': 'Bbm',
    'iii': 'Cbm',
    'biv': 'Cm',
    'iv': 'Dbm',
    'bv': 'Dm',
    'v': 'Em',
    'vi': 'Fm',
    '#vi': 'F#m',
    'bvii': 'Gbm',
    'vii': 'Gbm'
    ,
  },

  'F#m': {
    'i': 'Am',
    'bii': 'Bbm',
    'ii': 'Bm',
    'iii': 'Cm',
    'biv': 'Dbm',
    'iv': 'Dm',
    'bv': 'Ebm',
    'v': 'E#m',
    'vi': 'F#m',
    '#vi': 'Gm',
    'bvii': 'Gm',
    'vii': 'Gm',

  },

  'Gm': {
    'i': 'Bbm',
    'bii': 'Cbm',
    'ii': 'Cm',
    'iii': 'Dbm',
    'biv': 'Dm',
    'iv': 'Ebm',
    'bv': 'Fbm',
    'v': 'F#m',
    'vi': 'Gm',
    '#vi': 'G#m',
    'bvii': 'Abm',
    'vii': 'Abm'
    ,
  },

  'G#m': {
    'i': 'Bm',
    'bii': 'Cm',
    'ii': 'C#m',
    'iii': 'Dm',
    'biv': 'Ebm',
    'iv': 'Em',
    'bv': 'Fm',
    'v': 'Gm',
    'vi': 'G#m',
    '#vi': 'Am',
    'bvii': 'Am',
    'vii': 'Am',
  },
};

describe('numeral chords', () => {
  it.each([
    ['bV', '#', 'F#'],
    ['#IV', 'b', 'Gb'],
  ])('keeps explicit %s converted to %s in C', (input, accidental, expected) => {
    const chord = Chord.parseOrFail(input).useAccidental(accidental as '#' | 'b');

    expect(chord.toChordSymbolString('C')).toEqual(expected);
  });

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
