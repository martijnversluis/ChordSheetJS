import Chord from '../chord';
import Key from '../key';

const FULLY_DIMINISHED_SUFFIXES = new Set(['dim', 'dim7', 'o', 'o7']);
const DIMINISHED_CANDIDATE = /(?:dim7?|o7?)(?:\s|\/|\)|$)/i;

export interface SequenceChord {
  source: Chord;
  normalized: Chord;
}

export function hasLeadingToneDiminishedCandidate(chords: string): boolean {
  return DIMINISHED_CANDIDATE.test(chords);
}

export function respellLeadingToneDiminished(current: SequenceChord, following: Chord): Chord {
  const { root } = current.normalized;
  const followingRoot = following.root;
  if (!root || !followingRoot || !FULLY_DIMINISHED_SUFFIXES.has(current.source.suffix || '')) {
    return current.normalized;
  }
  if (root.explicitAccidental) return current.normalized;
  if (!(root.isChordSymbol() || root.isChordSolfege())) return current.normalized;
  if (!(followingRoot.isChordSymbol() || followingRoot.isChordSolfege())) return current.normalized;
  if (root.effectiveGrade !== Key.shiftGrade(followingRoot.effectiveGrade - 1)) return current.normalized;

  return current.source.set({ root: root.respellAsScaleDegree(followingRoot, 7) });
}
