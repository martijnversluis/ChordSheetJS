import Chord from './chord';
import { presence } from './utilities';
import Key from './key';

function transposeDistance(transposeKey, songKey) {
  if (/^\d+$/.test(transposeKey)) {
    return parseInt(transposeKey, 10);
  }

  return Key.distance(songKey, transposeKey);
}

/* eslint import/prefer-default-export: 0 */
export function renderChord(chord, lineKey, songKey, transposeKey) {
  const distance = presence(transposeKey) ? transposeDistance(transposeKey, songKey) : 0;
  let chordObj = Chord.parse(chord);

  if (!chordObj) {
    return chord;
  }

  if (presence(transposeKey) && presence(songKey)) {
    chordObj = chordObj.transpose(distance).useModifier(transposeKey.modifier);
  }

  if (presence(lineKey)) {
    chordObj = chordObj.normalize(lineKey); // normalize by key functionality not yet implemented.
  }

  return chordObj.toString();
}
