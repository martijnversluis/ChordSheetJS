export const majorKeys: Record<'symbol' | 'solfege', string[]> = {
  solfege: ['La', 'Sib', 'Si', 'Do', 'Do#', 'Reb', 'Re', 'Mib', 'Mi', 'Fa', 'Fa#', 'Solb', 'Sol', 'Sol#', 'Lab'],
  symbol: ['A', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab'],
};

export const minorKeys: Record<'symbol' | 'solfege', string[]> = {
  solfege: ['Fa#m', 'Solm', 'Sol#m', 'Lam', 'Sibm', 'Sim', 'Dom', 'Do#m', 'Rem', 'Re#m', 'Mibm', 'Mim', 'Fam'],
  symbol: ['F#m', 'Gm', 'G#m', 'Am', 'Bbm', 'Bm', 'Cm', 'C#m', 'Dm', 'D#m', 'Ebm', 'Em', 'Fm'],
};

export const capos: Record<'symbol' | 'solfege', Record<string, Record<string, string>>> = {
  solfege: {
    'Sib': {
      1: 'La', 3: 'Sol', 6: 'Mi', 8: 'Re', 10: 'Do',
    },
    'Re': {
      2: 'Do', 5: 'La', 7: 'Sol', 10: 'Mi',
    },
    'Mib': {
      1: 'Re', 3: 'Do', 6: 'La', 8: 'Sol',
    },
    'Db': {
      1: 'Do', 4: 'La', 6: 'Sol', 9: 'Mi',
    },
    'Do#': {
      1: 'Do', 4: 'La', 6: 'Sol', 9: 'Mi',
    },
    'Mi': {
      2: 'Re', 4: 'Do', 7: 'La', 9: 'Sol',
    },
    'Fa': {
      1: 'Mi', 3: 'Re', 5: 'Do', 6: 'Si', 8: 'La', 10: 'Sol',
    },
    'Fa#': {
      2: 'Mi', 4: 'Re', 6: 'Do', 7: 'Si', 9: 'La',
    },
    'Solb': {
      2: 'Mi', 4: 'Re', 6: 'Do', 7: 'Si', 9: 'La',
    },
    'Sol': {
      3: 'Mi', 5: 'Re', 7: 'Do', 8: 'Si', 10: 'La',
    },
    'Sol#': {
      1: 'Sol', 4: 'Mi', 6: 'Re', 8: 'Do',
    },
    'Lab': {
      1: 'Sol', 4: 'Mi', 6: 'Re', 8: 'Do',
    },
    'La': {
      2: 'Sol', 5: 'Mi', 7: 'Re', 9: 'Do',
    },
    'Si': {
      2: 'La', 4: 'Sol', 7: 'Mi', 9: 'Re',
    },
    'Do': {
      3: 'La', 5: 'Sol', 8: 'Mi', 10: 'Re',
    },
    'Lam': { 3: 'Fa#m', 5: 'Mim', 7: 'Rem' },
    'Sibm': {
      1: 'Am', 4: 'Fa#m', 6: 'Mim', 8: 'Rem',
    },
    'Sim': { 2: 'Lam', 5: 'Fa#m', 7: 'Mim' },
    'Dom': {
      1: 'Sim', 3: 'Lam', 6: 'Fa#m', 8: 'Mim',
    },
    'Do#m': {
      2: 'Sim', 4: 'Lam', 7: 'Fa#m', 9: 'Mim',
    },
    'Rem': { 3: 'Sim', 5: 'Lam', 8: 'Fa#m' },
    'Mibm': { 1: 'Rem', 4: 'Sim', 6: 'Lam' },
    'Re#m': { 1: 'Rem', 4: 'Sim', 6: 'Lam' },
  },
  symbol: {
    'Bb': {
      1: 'A', 3: 'G', 6: 'E', 8: 'D', 10: 'C',
    },
    'D': {
      2: 'C', 5: 'A', 7: 'G', 10: 'E',
    },
    'Eb': {
      1: 'D', 3: 'C', 6: 'A', 8: 'G',
    },
    'Db': {
      1: 'C', 4: 'A', 6: 'G', 9: 'E',
    },
    'C#': {
      1: 'C', 4: 'A', 6: 'G', 9: 'E',
    },
    'E': {
      2: 'D', 4: 'C', 7: 'A', 9: 'G',
    },
    'F': {
      1: 'E', 3: 'D', 5: 'C', 6: 'B', 8: 'A', 10: 'G',
    },
    'F#': {
      2: 'E', 4: 'D', 6: 'C', 7: 'B', 9: 'A',
    },
    'Gb': {
      2: 'E', 4: 'D', 6: 'C', 7: 'B', 9: 'A',
    },
    'G': {
      3: 'E', 5: 'D', 7: 'C', 8: 'B', 10: 'A',
    },
    'G#': {
      1: 'G', 4: 'E', 6: 'D', 8: 'C',
    },
    'Ab': {
      1: 'G', 4: 'E', 6: 'D', 8: 'C',
    },
    'A': {
      2: 'G', 5: 'E', 7: 'D', 9: 'C',
    },
    'B': {
      2: 'A', 4: 'G', 7: 'E', 9: 'D',
    },
    'C': {
      3: 'A', 5: 'G', 8: 'E', 10: 'D',
    },
    'Am': { 3: 'F#m', 5: 'Em', 7: 'Dm' },
    'Bbm': {
      1: 'Am', 4: 'F#m', 6: 'Em', 8: 'Dm',
    },
    'Bm': { 2: 'Am', 5: 'F#m', 7: 'Em' },
    'Cm': {
      1: 'Bm', 3: 'Am', 6: 'F#m', 8: 'Em',
    },
    'C#m': {
      2: 'Bm', 4: 'Am', 7: 'F#m', 9: 'Em',
    },
    'Dm': { 3: 'Bm', 5: 'Am', 8: 'F#m' },
    'Ebm': { 1: 'Dm', 4: 'Bm', 6: 'Am' },
    'D#m': { 1: 'Dm', 4: 'Bm', 6: 'Am' },
  },
};
