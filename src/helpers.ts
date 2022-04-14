import Chord from './chord';
import { isPresent } from './utilities';
import Key from './key';
import { capos, majorKeys, minorKeys } from './key_config.json';

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

/**
 * Returns applicable capos for the provided key
 * @param {Key|string} key The key to get capos for
 * @returns {Object.<string, string>} The available capos, where the keys are capo numbers and the
 * values are the effective key for that capo.
 */
export function getCapos(key) {
  return capos[Key.toString(key)];
}

/**
 * Returns applicable keys to transpose to from the provided key
 * @param {Key|string} key The key to get keys for
 * @returns {Array<string>} The available keys
 */
export function getKeys(key) {
  const keyObj = Key.wrap(key);
  return keyObj.isMinor() ? minorKeys : majorKeys;
}
