import Chord from '../chord';
import Key from '../key';
import { NullableChordStyle } from '../constants';
import { transposeDistance } from '../helpers';
import { callChain } from '../utilities';

class ChordRenderer {
  capo: number;

  contextKey: Key | null;

  normalizeChords: boolean;

  renderKey: Key | null;

  songKey: Key | null;

  style: NullableChordStyle;

  transposeKey: string | null;

  useUnicodeModifier: boolean;

  constructor(
    {
      capo,
      contextKey,
      decapo,
      normalizeChords,
      renderKey,
      songKey,
      style,
      transposeKey,
      useUnicodeModifier,
    }: {
      capo: number,
      contextKey: Key | null,
      decapo: boolean,
      normalizeChords: boolean,
      renderKey: Key | null,
      songKey: Key | null,
      style: NullableChordStyle,
      transposeKey: string | null,
      useUnicodeModifier: boolean,
    } = {
      capo: 0,
      contextKey: null,
      decapo: false,
      normalizeChords: true,
      renderKey: null,
      songKey: null,
      style: null,
      transposeKey: null,
      useUnicodeModifier: false,
    },
  ) {
    this.capo = decapo ? capo : 0;
    this.contextKey = contextKey;
    this.normalizeChords = normalizeChords;
    this.renderKey = renderKey;
    this.songKey = songKey;
    this.style = style;
    this.transposeKey = transposeKey;
    this.useUnicodeModifier = useUnicodeModifier;
  }

  render(chordString: string): string {
    const chord = Chord.parse(chordString);

    if (!chord) {
      return chordString;
    }

    return callChain<Chord>(
      chord,
      [
        (c: Chord) => c.transpose(this.effectiveTransposeDistance),
        (c: Chord) => (this.modifier ? c.useModifier(this.modifier) : c),
        (c: Chord) => (this.normalizeChords ? c.normalize(this.effectiveKey) : c),
        (c: Chord) => this.changeChordType(c),
      ],
    ).toString({ useUnicodeModifier: this.useUnicodeModifier });
  }

  private changeChordType(chord: Chord): Chord {
    switch (this.style) {
      case 'symbol':
        return chord.toChordSymbol(this.effectiveKey);
      case 'solfege':
        return chord.toChordSolfege(this.effectiveKey);
      case 'numeral':
        return chord.toNumeral(this.effectiveKey);
      case 'number':
        return chord.toNumeric(this.effectiveKey);
      default:
        return chord;
    }
  }

  private get modifier() {
    return this.renderKey?.modifier || this.contextKey?.modifier || null;
  }

  private get effectiveKey() {
    if (this.renderKey) {
      return this.renderKey;
    }

    if (!this.contextKey) {
      return null;
    }

    return this.contextKey.transpose(this.effectiveTransposeDistance);
  }

  private get effectiveTransposeDistance() {
    let transpose = -1 * this.capo;

    if (this.songKey) {
      if (this.transposeKey) {
        transpose += transposeDistance(this.transposeKey, this.songKey);
      }

      if (this.renderKey) {
        transpose += Key.distance(this.songKey, this.renderKey);
      }
    }

    return transpose;
  }
}

export default ChordRenderer;
