import Chord from '../chord';
import ChordLyricsPair from './chord_lyrics_pair';
import Key from '../key';
import type Song from './song';

import { Accidental } from '../constants';

class ChordTranspositionContext {
  private sourceRoot: Key | null = null;

  private targetRoot: Key | null = null;

  private trackInheritedBasses = false;

  static forSong(song: Song): ChordTranspositionContext {
    const context = new ChordTranspositionContext();
    song.foreachItem((item) => {
      if (item instanceof ChordLyricsPair && /^\(?\//.test(item.chords.trim())) {
        context.trackInheritedBasses = true;
      }
    });
    return context;
  }

  transpose(
    sourcePair: ChordLyricsPair,
    delta: number,
    sourceKey: Key | null,
    targetKey: Key | null,
    normalizeChordSuffix: boolean,
    accidental: Accidental | null,
  ): ChordLyricsPair {
    let targetPair = sourcePair.transpose(delta, targetKey, { normalizeChordSuffix, sourceKey });
    if (accidental) targetPair = targetPair.preferAccidental(accidental);
    return this.trackInheritedBasses ? this.finalizePair(sourcePair, targetPair) : targetPair;
  }

  private finalizePair(sourcePair: ChordLyricsPair, targetPair: ChordLyricsPair): ChordLyricsPair {
    const sourceChord = sourcePair.chord;
    const respelledPair = this.respellInheritedBass(sourceChord, targetPair);
    this.sourceRoot = sourceChord?.root || this.sourceRoot;
    this.targetRoot = respelledPair.chord?.root || this.targetRoot;
    return respelledPair;
  }

  private respellInheritedBass(sourceChord: Chord | null, targetPair: ChordLyricsPair): ChordLyricsPair {
    const sourceBass = sourceChord?.bass || null;
    const targetChord = targetPair.chord;
    const { sourceRoot, targetRoot } = this;
    if (!sourceBass || sourceChord?.root || !targetChord?.bass || targetChord.root || !sourceRoot || !targetRoot) {
      return targetPair;
    }

    return targetPair.changeChord((chord) => chord.set({
      bass: chord.bass?.respellForTransposition(sourceBass, sourceRoot, targetRoot)
        .normalize().normalizeEnharmonics(targetRoot),
    }));
  }
}

export default ChordTranspositionContext;
