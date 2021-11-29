import Chord from './chord';
import { presence } from './utilities';
import Key from './key';

function transposeDistance(lineKey, songKey) {
  if (/^\d+$/.test(lineKey)) {
    return parseInt(lineKey, 10);
  }

  return Key.distance(songKey, lineKey);
}

/* eslint import/prefer-default-export: 0 */
export function renderChord(chord, lineKey, songKey) {
  if (presence(chord) && presence(lineKey) && presence(songKey)) {
    return Chord.parse(chord).transpose(transposeDistance(lineKey, songKey)).useModifier(lineKey.modifier).toString();
  }

  return chord;
}
