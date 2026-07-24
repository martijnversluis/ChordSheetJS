/**
 * Preferred enharmonic spellings by context and effective pitch.
 *
 * Numeric keys are chromatic pitches where C = 0, C#/Db = 1, ... B/Cb = 11.
 * Values use chord-symbol notation; Key converts them back to the caller's notation.
 */
const enharmonics: Record<string, Partial<Record<number, string>>> = {
  'Ab': {
    11: 'Cb',
  },
  'Bb': {
    11: 'Cb',
  },
  'Cb': {
    4: 'Fb',
    10: 'Bb',
    11: 'Cb',
  },
  'Cbm': {
    4: 'Fb',
    10: 'Bb',
    11: 'Cb',
  },
  'C': {
    1: 'Db',
    3: 'Eb',
    6: 'Gb',
    8: 'Ab',
    10: 'Bb',
  },
  'C#': {
    0: 'B#',
    3: 'D#',
    5: 'E#',
    10: 'A#',
  },
  'Db': {
    6: 'Gb',
    8: 'Ab',
    10: 'Bb',
    11: 'B',
  },
  'D': {
    3: 'Eb',
    6: 'F#',
    10: 'Bb',
  },
  'D#': {
    0: 'B#',
    5: 'E#',
    10: 'A#',
  },
  'D#m': {
    0: 'B#',
    5: 'E#',
    10: 'A#',
  },
  'Eb': {
    3: 'Eb',
    4: 'Fb',
    6: 'Gb',
    8: 'Ab',
    10: 'Bb',
    11: 'Cb',
  },
  'Ebm': {
    3: 'Eb',
    4: 'Fb',
    6: 'Gb',
    8: 'Ab',
    10: 'Bb',
    11: 'Cb',
  },
  'E': {
    1: 'C#',
    3: 'D#',
    8: 'G#',
    10: 'Bb',
  },
  'E#': {
    0: 'B#',
    5: 'E#',
  },
  'E#m': {
    0: 'B#',
    5: 'E#',
  },
  'F': {
    3: 'Eb',
    6: 'Gb',
    8: 'Ab',
    10: 'Bb',
  },
  'Fb': {
    4: 'Fb',
    11: 'Cb',
  },
  'Fbm': {
    4: 'Fb',
    11: 'Cb',
  },
  'F#': {
    0: 'B#',
    3: 'D#',
    5: 'E#',
    10: 'A#',
  },
  'Gb': {
    3: 'Eb',
    4: 'Fb',
    8: 'Ab',
    10: 'Bb',
    11: 'Cb',
  },
  'Gbm': {
    3: 'Eb',
    4: 'Fb',
    8: 'Ab',
    10: 'Bb',
    11: 'Cb',
  },
  'G': {
    1: 'Db',
    3: 'Eb',
    8: 'Ab',
    10: 'Bb',
  },
  'G#': {
    0: 'B#',
    3: 'D#',
    5: 'E#',
    10: 'A#',
  },
  'Am': {
    1: 'Db',
    3: 'Eb',
    6: 'Gb',
    8: 'Ab',
    10: 'Bb',
  },
  'B': {
    3: 'D#',
  },
  'Bbm': {
    6: 'F#',
    11: 'B',
  },
  'Bm': {
    3: 'Eb',
    10: 'Bb',
  },
  'C#m': {
    0: 'B#',
    3: 'D#',
    5: 'E#',
    6: 'F#',
    10: 'A#',
  },
  'Cm': {
    1: 'Db',
    3: 'Eb',
    6: 'Gb',
    8: 'Ab',
    10: 'Bb',
  },
  'Dm': {
    1: 'Db',
    3: 'Eb',
    6: 'Gb',
    8: 'Ab',
    10: 'Bb',
  },
  'Em': {
    1: 'Db',
    3: 'Eb',
    10: 'Bb',
  },
  'F#m': {
    0: 'B#',
    1: 'C#',
    3: 'D#',
    5: 'E#',
    6: 'F#',
    8: 'G#',
    10: 'A#',
  },
  'Fm': {
    1: 'Db',
    3: 'Eb',
    6: 'Gb',
    8: 'Ab',
    10: 'Bb',
  },
  'Gm': {
    1: 'Db',
    3: 'Eb',
    6: 'Gb',
    8: 'Ab',
    10: 'Bb',
  },
  'G#m': {
    0: 'B#',
    3: 'D#',
    5: 'E#',
    10: 'A#',
  },
};

export default enharmonics;
