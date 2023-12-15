/* eslint max-len: 0 */

import { getKeys } from '../src/helpers';

describe('getKeys', () => {
  it('returns the applicable keys for a major key symbol', () => {
    expect(getKeys('A')).toEqual(['A', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab']);
  });

  it('returns the applicable keys for a minor key symbol', () => {
    expect(getKeys('Dm')).toEqual(['F#m', 'Gm', 'G#m', 'Am', 'Bbm', 'Bm', 'Cm', 'C#m', 'Dm', 'D#m', 'Ebm', 'Em', 'Fm']);
  });

  it('returns the applicable keys for a major key solfege', () => {
    expect(getKeys('La')).toEqual(['La', 'Sib', 'Si', 'Do', 'Do#', 'Reb', 'Re', 'Mib', 'Mi', 'Fa', 'Fa#', 'Solb', 'Sol', 'Sol#', 'Lab']);
  });

  it('returns the applicable keys for a minor key solfege', () => {
    expect(getKeys('Rem')).toEqual(['Fa#m', 'Solm', 'Sol#m', 'Lam', 'Sibm', 'Sim', 'Dom', 'Do#m', 'Rem', 'Re#m', 'Mibm', 'Mim', 'Fam']);
  });
});
