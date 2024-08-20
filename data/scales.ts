/* eslint no-multi-spaces: 0, array-bracket-spacing: 0, key-spacing: 0 */

import {
  FLAT,
  MAJOR,
  MINOR,
  NO_MODIFIER,
  NUMERAL,
  NUMERIC,
  SHARP,
  SOLFEGE,
  SYMBOL,
} from '../src/constants';

const americanScale = {
  [NO_MODIFIER]: ['C',  null, 'D',  null, 'E',  'F',  null, 'G',  null, 'A',  null, 'B' ],
  [SHARP]:       ['B#', 'C#', null, 'D#', null, 'E#', 'F#', null, 'G#', null, 'A#', null],
  [FLAT]:        [null, 'Db', null, 'Eb', 'Fb', null, 'Gb', null, 'Ab', null, 'Bb', 'Cb'],
};

const solfegeScale = {
  [NO_MODIFIER]: ['Do',  null, 'Re',  null, 'Mi',  'Fa',  null, 'Sol',  null, 'La',  null, 'Si' ],
  [SHARP]:       ['Si#', 'Do#', null, 'Re#', null, 'Mi#', 'Fa#', null, 'Sol#', null, 'La#', null],
  [FLAT]:        [null, 'Reb', null, 'Mib', 'Fab', null, 'Solb', null, 'Lab', null, 'Sib', 'Dob'],
};

const SCALES = {
  [SYMBOL]: {
    [MINOR]: americanScale,
    [MAJOR]: americanScale,
  },
  [SOLFEGE]: {
    [MINOR]: solfegeScale,
    [MAJOR]: solfegeScale,
  },
  [NUMERIC]: {
    [MINOR]: {
      [NO_MODIFIER]: ['1',  null, '2',  '3',  null,  '4',  null, '5', '6',  null, '7',  null],
      [SHARP]:       [null, '#1', null, '#2', '#3', null, '#4', null, '#5', '#6', null, '#7'],
      [FLAT]:        [null, 'b2', 'b3', null, 'b4', null, 'b5', 'b6', null, 'b7', null, 'b1'],
    },
    [MAJOR]: {
      [NO_MODIFIER]: ['1',  null, '2',  null, '3',  '4',  null, '5',  null, '6',  null, '7' ],
      [SHARP]:       ['#7', '#1', null, '#2', null, '#3', '#4', null, '#5', null, '#6', null],
      [FLAT]:        [null, 'b2', null, 'b3', 'b4', null, 'b5', null, 'b6', null, 'b7', 'b1'],
    },
  },
  [NUMERAL]: {
    [MINOR]: {
      [NO_MODIFIER]: ['I',  null,  'II',  'III',  null,   'IV', null,  'V',  'VI', null,  'VII', null],
      [SHARP]:       [null, '#I',  null,  '#II',  '#III', null, '#IV', null, '#V', '#VI',  null, '#VII'],
      [FLAT]:        [null, 'bII', 'bIII', null, 'bIV',  null, 'bV',  'bVI', null, 'bVII', null,  'bI'],
    },
    [MAJOR]: {
      [NO_MODIFIER]: ['I',    null,  'II', null,   'III', 'IV',   null,  'V',  null,  'VI',  null,   'VII'],
      [SHARP]:       ['#VII', '#I',  null, '#II',  null,  '#III', '#IV', null, '#V',  null,  '#VI',  null ],
      [FLAT]:        [null,   'bII', null, 'bIII', 'bIV', null,   'bV',  null, 'bVI', null,  'bVII', 'bI' ],
    },
  },
};

export default SCALES;
