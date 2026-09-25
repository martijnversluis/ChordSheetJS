import {
  BRIDGE, CHORUS, GRID, PART, TAB, VERSE,
} from '../constants';

const PRE_CHORUS = 'pre-chorus';

const KNOWN_TOKEN_PREFIXES: Record<string, string> = {
  [VERSE]: 'V',
  [CHORUS]: 'C',
  [BRIDGE]: 'B',
  [PRE_CHORUS]: 'PC',
  [PART]: 'P',
  [TAB]: 'TAB',
  [GRID]: 'G',
  intro: 'I',
  instrumental: 'INST',
  tag: 'T',
  end: 'E',
};

const RESERVED_PREFIXES = Object.values(KNOWN_TOKEN_PREFIXES);

export interface SectionTokenPrefix {
  prefix: string;
  inferred: boolean;
}

/**
 * Assigns a token prefix to a section type. Known section types get their documented prefix, other
 * section types get a deterministic prefix that does not claim a reserved one.
 */
class SectionTokenizer {
  private inferredPrefixes: Record<string, string> = {};

  prefixFor(type: string): SectionTokenPrefix {
    const knownPrefix = KNOWN_TOKEN_PREFIXES[type];

    if (knownPrefix) {
      return { prefix: knownPrefix, inferred: false };
    }

    this.inferredPrefixes[type] ||= this.inferPrefix(type);
    return { prefix: this.inferredPrefixes[type], inferred: true };
  }

  private inferPrefix(type: string): string {
    const letters = type.replace(/[^\p{L}\p{N}]/gu, '').toUpperCase();
    const candidates = [
      this.initials(type),
      ...Array.from({ length: letters.length }, (_value, index) => letters.slice(0, index + 1)),
    ];

    return candidates.find((candidate) => candidate.length > 0 && !this.isTaken(candidate)) || letters;
  }

  private initials(type: string): string {
    return type
      .split(/[\s-]+/)
      .map((word) => word.slice(0, 1))
      .join('')
      .toUpperCase();
  }

  private isTaken(prefix: string): boolean {
    return RESERVED_PREFIXES.includes(prefix) || Object.values(this.inferredPrefixes).includes(prefix);
  }
}

export default SectionTokenizer;
