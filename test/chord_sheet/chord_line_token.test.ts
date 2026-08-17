import {
  ChordLineTokenKind,
  chordLineStyleRole,
  classifyChordLineToken,
  isTokenVariantValid,
  resolveChordLineTokenClassification,
} from '../../src';

describe('chord-line token classification', () => {
  it.each(['constructor', '__proto__', 'toString'])(
    'treats prototype-key token text %s as a chord',
    (value) => {
      expect(classifyChordLineToken(value)).toEqual({ kind: 'chord', variant: null });
    },
  );

  it.each(['constructor', '__proto__', 'toString'])(
    'safely rejects prototype-key token kind %s',
    (kind) => {
      expect(isTokenVariantValid(kind, null)).toBe(false);
      expect(resolveChordLineTokenClassification('C', '', false, { kind, variant: null }))
        .toEqual({ kind: 'chord', variant: null });
    },
  );

  it.each(['constructor', '__proto__', 'toString'])(
    'safely falls back for prototype-key style role %s',
    (kind) => {
      expect(chordLineStyleRole(kind as ChordLineTokenKind, 'C')).toBe('chord');
    },
  );
});
