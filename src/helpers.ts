import Chord from './chord';
import Key from './key';
import { capos, majorKeys, minorKeys } from './key_config';
import Song from './chord_sheet/song';
import { CAPO } from './chord_sheet/tag';
import Line from './chord_sheet/line';

export function transposeDistance(transposeKey: string, songKey: string): number {
  if (/^\d+$/.test(transposeKey)) {
    return parseInt(transposeKey, 10);
  }

  return Key.distance(songKey, transposeKey);
}

function chordTransposeDistance(capo: number, transposeKey: string | null, songKey: string, renderKey: Key | null) {
  let transpose = -1 * (capo || 0);

  if (songKey) {
    if (transposeKey) {
      transpose += transposeDistance(transposeKey, songKey);
    }

    if (renderKey) {
      transpose += Key.distance(songKey, renderKey);
    }
  }

  return transpose;
}

export function renderChord(chordString: string, line: Line, song: Song, renderKey: Key | null = null): string {
  const chord = Chord.parse(chordString);
  const songKey = song.key;
  const capo = parseInt(song.metadata.getSingle(CAPO), 10);

  if (!chord) {
    return chordString;
  }

  const effectiveTransposeDistance = chordTransposeDistance(capo, line.transposeKey, songKey, renderKey);
  const effectiveKey = renderKey || Key.wrap(line.key || song.key)?.transpose(effectiveTransposeDistance) || null;

  return chord
    .transpose(effectiveTransposeDistance)
    .normalize(effectiveKey)
    .toString();
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
