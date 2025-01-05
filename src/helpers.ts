import Chord from './chord';
import Key from './key';
import { capos, majorKeys, minorKeys } from './key_config';
import Song from './chord_sheet/song';
import { CAPO, CHORD_STYLE, ChordType } from './chord_sheet/tag';
import Line from './chord_sheet/line';
import FormattingContext from './formatter/formatting_context';
import { Modifier } from './constants';

export function transposeDistance(transposeKey: string, songKey: string): number {
  if (/^\d+$/.test(transposeKey)) {
    return parseInt(transposeKey, 10);
  }

  return Key.distance(songKey, transposeKey);
}

function chordTransposeDistance(
  capo: number | null,
  transposeKey: string | null,
  songKey: string | null,
  renderKey: Key | null | undefined,
) {
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

function changeChordType(
  chord: Chord,
  type: ChordType,
  referenceKey: Key | null,
): Chord {
  switch (type) {
    case 'symbol':
      return chord.toChordSymbol(referenceKey);
    case 'solfege':
      return chord.toChordSolfege(referenceKey);
    case 'numeral':
      return chord.toNumeral(referenceKey);
    case 'number':
      return chord.toNumeric(referenceKey);
    default:
      return chord;
  }
}

interface RenderChordOptions {
  renderKey?: Key | null;
  useUnicodeModifier?: boolean;
  normalizeChords?: boolean;
  decapo?: boolean;
}

function effectiveModifier(renderKey: Key | null, contextKey: Key | null): Modifier | null {
  if (renderKey?.modifier) {
    return renderKey.modifier;
  }

  if (contextKey?.modifier) {
    return contextKey.modifier;
  }

  return null;
}

function shapeChord(
  {
    chord,
    effectiveTransposeDistance,
    modifier,
    normalizeChords,
    effectiveKey,
    chordStyle,
  } : {
    chord: Chord,
    effectiveTransposeDistance: number,
    modifier: Modifier | null,
    normalizeChords: boolean,
    effectiveKey: Key | null,
    chordStyle: ChordType,
  },
) {
  const transposedChord = chord.transpose(effectiveTransposeDistance);
  const correctedChord = modifier ? transposedChord.useModifier(modifier) : transposedChord;
  const normalizedChord = (normalizeChords ? correctedChord.normalize(effectiveKey) : transposedChord);

  return changeChordType(normalizedChord, chordStyle, effectiveKey);
}

/**
 * Renders a chord in the context of a line and song and taking into account some options
 * @param chordString The chord to render
 * @param line The line the chord is in
 * @param song The song the line is in
 * @param renderKey The key to render the chord in. If not provided, the line key will be used,
 * or the song key if the line key is not provided.
 * @param useUnicodeModifier Whether to use unicode modifiers ('\u266f'/'\u266d') or plain text ('#'/'b').
 * Default `false`.
 * @param normalizeChords Whether to normalize the chord to the key (default `true`)
 * @param decapo Whether to transpose all chords to eliminate the capo (default `false`)
 */
export function renderChord(
  chordString: string,
  line: Line,
  song: Song,
  {
    renderKey = null,
    useUnicodeModifier = false,
    normalizeChords = true,
    decapo = false,
  }: RenderChordOptions = {},
): string {
  const chord = Chord.parse(chordString);

  if (!chord) {
    return chordString;
  }

  const songKey = song.key;
  const capoString = song.metadata.getSingle(CAPO);
  const capo = (decapo && capoString) ? parseInt(capoString, 10) : null;
  const chordStyle = song.metadata.getSingle(CHORD_STYLE) as ChordType;

  const effectiveTransposeDistance = chordTransposeDistance(capo, line.transposeKey, songKey, renderKey);
  const contextKey = Key.wrap(line.key || song.key);
  const modifier = effectiveModifier(renderKey, contextKey);
  const effectiveKey = renderKey || contextKey?.transpose(effectiveTransposeDistance) || null;

  return shapeChord({
    chord,
    effectiveTransposeDistance,
    modifier,
    normalizeChords,
    effectiveKey,
    chordStyle,
  })
    .toString({ useUnicodeModifier });
}

/**
 * Returns applicable capos for the provided key
 * @param {Key|string} key The key to get capos for
 * @returns {Object.<string, string>} The available capos, where the keys are capo numbers and the
 * values are the effective key for that capo.
 */
export function getCapos(key: Key | string): Record<string, string> {
  const keyObj = Key.wrapOrFail(key);
  const chordType = keyObj.type === 'solfege' ? 'solfege' : 'symbol';
  return capos[chordType][Key.toString(key)];
}

/**
 * Returns applicable keys to transpose to from the provided key
 * @param {Key|string} key The key to get keys for
 * @returns {Array<string>} The available keys
 */
export function getKeys(key: Key | string): string[] {
  const keyObj = Key.wrapOrFail(key);
  const chordType = keyObj.type === 'solfege' ? 'solfege' : 'symbol';
  return keyObj.isMinor() ? minorKeys[chordType] : majorKeys[chordType];
}

export function testSelector(
  { selector, isNegated }: { selector: string, isNegated: boolean },
  { configuration, metadata }: FormattingContext,
) {
  if (selector === configuration.instrument?.type) {
    return !isNegated;
  }

  if (selector === configuration.user?.name) {
    return !isNegated;
  }

  const metadataValue = metadata.getSingle(selector);
  const metadataValueTruthy = metadataValue && metadataValue !== '';

  return isNegated ? !metadataValueTruthy : !!metadataValueTruthy;
}
