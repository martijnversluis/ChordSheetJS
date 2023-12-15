const enharmonics: Record<string, Record<string, string>> = {
  'Ab': {
    'B': 'Cb',
  },
  'Cb': {
    'B': 'Cb',
    'A#': 'Bb',
    'E': 'Fb',
  },
  'C': {
    'C#': 'Db',
    'D#': 'Eb',
    'F#': 'Gb',
    'G#': 'Ab',
    'A#': 'Bb',
  },
  'C#': {
    'Eb': 'D#',
    'Bb': 'A#',
  },
  'Db': {
    'B': 'Cb',
    'F#': 'Gb',
  },
  'D': {
    'D#': 'Eb',
    'A#': 'Bb',
    'Gb': 'F#',
  },
  'Eb': {
    'D#': 'Eb',
    'F#': 'Gb',
    'G#': 'Ab',
    'A#': 'Bb'
  },
  'E': {
    'Ab': 'G#',
    'A#': 'Bb',
    'D#': 'Eb',
    'Db': 'C#',
    'Eb': 'D#',
  },
  'F': {
    'A#': 'Bb',
    'F#': 'Gb',
    'D#': 'Eb',
    'G#': 'Ab',
  },
  'F#': {
    'Bb': 'A#',
    'Eb': 'D#',
  },
  'Gb': {
    'A#': 'Bb',
    'D#': 'Eb',
    'G#': 'Ab',
    'B': 'Cb',
    'E': 'Fb',
  },
  'G': {
    'A#': 'Bb',
    'D#': 'Eb',
    'G#': 'Ab',
    'C#': 'Db',
  },
  'G#': {
    'A#': 'Bb',
    'D#': 'Eb',
    'Cb': 'B#',
  },
  'Am': {
    'G#': 'Ab',
    'F#': 'Gb',
    'C#': 'Db',
    'D#': 'Eb',
    'A#': 'Bb',
  },
  'Bbm': {
    'Cb': 'B',
    'Gb': 'F#',
  },
  'Bm': {
    'A#': 'Bb',
    'D#': 'Eb',
  },
  'C#m': {
    'A#': 'Bb',
    'D#': 'Eb',
    'Gb': 'F#',
  },
  'Cm': {
    'G#': 'Ab',
    'A#': 'Bb',
    'D#': 'Eb',
    'F#': 'Gb',
    'C#': 'Db',
  },
  'Dm': {
    'A#': 'Bb',
    'D#': 'Eb',
    'F#': 'Gb',
    'G#': 'Ab',
    'C#': 'Db',
  },
  'Em': {
    'A#': 'Bb',
    'D#': 'Eb',
    'C#': 'Db',
  },
  'F#m': {
    'A#': 'Bb',
    'D#': 'Eb',
    'Gb': 'F#',
    'Ab': 'G#',
    'Db': 'C#',
  },
  'Fm': {
    'G#': 'Ab',
    'A#': 'Bb',
    'D#': 'Eb',
    'F#': 'Gb',
    'C#': 'Db',
  },
  'Gm': {
    'G#': 'Ab',
    'A#': 'Bb',
    'D#': 'Eb',
    'C#': 'Db',
    'F#': 'Gb',
  },
  'G#m': {
    'Bb': 'A#',
    'Eb': 'D#',
  },
  'B': {
    'Eb': 'D#',
  },
  'Lab': {
    'Si': 'Dob',
  },
  'Dob': {
    'Si': 'Dob',
    'La#': 'Sib',
    'Mi': 'Fab',
  },
  'Do': {
    'Do#': 'Reb',
    'Re#': 'Mib',
    'Fa#': 'Solb',
    'Sol#': 'Lab',
    'La#': 'Sib',
  },
  'Do#': {
    'Mib': 'Re#',
    'Sib': 'La#',
  },
  'Reb': {
    'Si': 'Dob',
    'Fa#': 'Solb',
  },
  'Re': {
    'Re#': 'Mib',
    'La#': 'Sib',
    'Solb': 'Fa#',
  },
  'Mib': {
    'Re#': 'Mib',
    'Fa#': 'Solb',
    'Sol#': 'Lab',
    'La#': 'Sib'
  },
  'Mi': {
    'Lab': 'Sol#',
    'La#': 'Sib',
    'Re#': 'Mib',
    'Reb': 'Do#',
    'Mib': 'Re#',
  },
  'Fa': {
    'La#': 'Sib',
    'Fa#': 'Solb',
    'Re#': 'Mib',
    'Sol#': 'Lab',
  },
  'Fa#': {
    'Sib': 'La#',
    'Mib': 'Re#',
  },
  'Solb': {
    'La#': 'Sib',
    'Re#': 'Mib',
    'Sol#': 'Lab',
    'Si': 'Dob',
    'Mi': 'Fab',
  },
  'Sol': {
    'La#': 'Sib',
    'Re#': 'Mib',
    'Sol#': 'Lab',
    'Do#': 'Reb',
  },
  'Sol#': {
    'La#': 'Sib',
    'Re#': 'Mib',
    'Dob': 'Si#',
  },
  'Lam': {
    'Sol#': 'Lab',
    'Fa#': 'Solb',
    'Do#': 'Reb',
    'Re#': 'Mib',
    'La#': 'Sib',
  },
  'Sibm': {
    'Dob': 'Si',
    'Solb': 'Fa#',
  },
  'Sim': {
    'La#': 'Sib',
    'Re#': 'Mib',
  },
  'Do#m': {
    'La#': 'Sib',
    'Re#': 'Mib',
    'Solb': 'Fa#',
  },
  'Dom': {
    'Sol#': 'Lab',
    'La#': 'Sib',
    'Re#': 'Mib',
    'Fa#': 'Solb',
    'Do#': 'Reb',
  },
  'Rem': {
    'La#': 'Sib',
    'Re#': 'Mib',
    'Fa#': 'Solb',
    'Sol#': 'Lab',
    'Do#': 'Reb',
  },
  'Mim': {
    'La#': 'Sib',
    'Re#': 'Mib',
    'Do#': 'Reb',
  },
  'Fa#m': {
    'La#': 'Sib',
    'Re#': 'Mib',
    'Solb': 'Fa#',
    'Lab': 'Sol#',
    'Reb': 'Do#',
  },
  'Fam': {
    'Sol#': 'Lab',
    'La#': 'Sib',
    'Re#': 'Mib',
    'Fa#': 'Solb',
    'Do#': 'Reb',
  },
  'Solm': {
    'Sol#': 'Lab',
    'La#': 'Sib',
    'Re#': 'Mib',
    'Do#': 'Reb',
    'Fa#': 'Solb',
  },
  'Sol#m': {
    'Sib': 'La#',
    'Mib': 'Re#',
  },
  'Si': {
    'Mib': 'Re#',
  },
};

export default enharmonics;
