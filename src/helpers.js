import Chord from './chord';
import { isPresent } from './utilities';
import Key from './key';

export function transposeDistance(transposeKey, songKey) {
  if (/^\d+$/.test(transposeKey)) {
    return parseInt(transposeKey, 10);
  }

  return Key.distance(songKey, transposeKey);
}

function chordTransposeDistance(capo, transposeKey, songKey) {
  let transpose = -1 * (capo || 0);

  if (isPresent(transposeKey) && isPresent(songKey)) {
    transpose += transposeDistance(transposeKey, songKey);
  }
  return transpose;
}

export function renderChord(chord, lineKey, transposeKey, song) {
  let chordObj = Chord.parse(chord);
  const { capo, key: songKey } = song;

  if (!chordObj) {
    return chord;
  }

  chordObj = chordObj.transpose(chordTransposeDistance(capo, transposeKey, songKey));

  if (isPresent(transposeKey)) {
    chordObj = chordObj.useModifier(transposeKey.modifier);
  }

  if (isPresent(lineKey)) {
    chordObj = chordObj.normalize(lineKey);
  }

  return chordObj.toString();
}
