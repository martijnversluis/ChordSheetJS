import Chord from '../chord';
import Key from '../key';
import { NullableChordStyle } from '../constants';
import { callChain } from '../utilities';
import { transposeDistance } from '../helpers';

interface ConstructorOptions {
  capo: number;
  contextKey: Key | null;
  decapo: boolean;
  normalizeChords: boolean;
  normalizeChordSuffix: boolean;
  renderKey: Key | null;
  songKey: Key | null;
  style: NullableChordStyle;
  transposeKey: string | null;
  useUnicodeModifier: boolean;
}

const defaultConstructorOptions = {
  capo: 0,
  contextKey: null,
  decapo: false,
  normalizeChords: true,
  normalizeChordSuffix: true,
  renderKey: null,
  songKey: null,
  style: null,
  transposeKey: null,
  useUnicodeModifier: false,
};

class ChordRenderer {
  capo: number;

  contextKey: Key | null;

  normalizeChords: boolean;

  normalizeChordSuffix: boolean;

  renderKey: Key | null;

  songKey: Key | null;

  style: NullableChordStyle;

  transposeKey: string | null;

  useUnicodeModifier: boolean;

  constructor(options: Partial<ConstructorOptions> = {}) {
    const config: ConstructorOptions = { ...defaultConstructorOptions, ...options };

    this.capo = config.decapo ? config.capo : 0;
    this.contextKey = config.contextKey;
    this.normalizeChords = config.normalizeChords;
    this.normalizeChordSuffix = config.normalizeChordSuffix;
    this.renderKey = config.renderKey;
    this.songKey = config.songKey;
    this.style = config.style;
    this.transposeKey = config.transposeKey;
    this.useUnicodeModifier = config.useUnicodeModifier;
  }

  render(chordOrString: Chord | string | null): string {
    if (chordOrString instanceof Chord) return this.renderChord(chordOrString);
    const input = chordOrString || '';
    const chord = Chord.parse(input);
    return chord ? this.renderChord(chord) : input;
  }

  private renderChord(chord: Chord): string {
    return callChain<Chord>(
      chord,
      [
        (c: Chord) => c.transpose(this.effectiveTransposeDistance),
        (c: Chord) => (this.accidental ? c.useAccidental(this.accidental) : c),
        (c: Chord) => (
          this.normalizeChords ? c.normalize(this.effectiveKey, { normalizeSuffix: this.normalizeChordSuffix }) : c
        ),
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

  private get accidental() {
    return this.renderKey?.accidental || this.contextKey?.accidental || null;
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
