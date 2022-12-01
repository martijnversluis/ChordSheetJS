import Chord from './chord';
import { isPresent } from './utilities';
import Key from './key';
import { capos, majorKeys, minorKeys } from './key_config';
import Song from './chord_sheet/song';
import Line from './chord_sheet/line';

export function transposeDistance(transposeKey: string, songKey: string): number {
  if (/^\d+$/.test(transposeKey)) {
    return parseInt(transposeKey, 10);
  }

  return Key.distance(songKey, transposeKey);
}

function chordTransposeDistance(capo: number, transposeKey: string | null, songKey: string) {
  let transpose = -1 * (capo || 0);

  if (transposeKey && isPresent(songKey)) {
    transpose += transposeDistance(transposeKey, songKey);
  }
  return transpose;
}

export function renderChord(chord: string, line: Line, song: Song): string {
  let chordObj = Chord.parse(chord);
  const songKey = song.key;
  const capo = parseInt(song.metadata.getSingle('capo'), 10);

  if (!chordObj) {
    return chord;
  }

  chordObj = chordObj.transpose(chordTransposeDistance(capo, line.transposeKey, songKey));

  if (line.key) {
    chordObj = chordObj.normalize(line.key);
  }

  return chordObj.toString();
}

/**
 * Returns applicable capos for the provided key
 * @param {Key|string} key The key to get capos for
 * @returns {Object.<string, string>} The available capos, where the keys are capo numbers and the
 * values are the effective key for that capo.
 */
export function getCapos(key: Key | string): Record<string, string> {
  return capos[Key.toString(key)];
}

/**
 * Returns applicable keys to transpose to from the provided key
 * @param {Key|string} key The key to get keys for
 * @returns {Array<string>} The available keys
 */
export function getKeys(key: Key | string): string[] {
  const keyObj = Key.wrapOrFail(key);
  return keyObj.isMinor() ? minorKeys : majorKeys;
}
