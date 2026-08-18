import Chord from '../chord';
import ChordLyricsPair from './chord_lyrics_pair';
import Item from './item';
import Key from '../key';
import Literal from './chord_pro/literal';
import type Song from './song';
import Tag from './tag';
import { classifyChordLineToken, isFlowSymbolKind } from './chord_line_token';

import {
  ABC, LILYPOND, SVG, TEXTBLOCK,
} from '../constants';
import { KEY, NEW_KEY } from './tags';
import {
  SequenceChord,
  hasLeadingToneDiminishedCandidate,
  respellLeadingToneDiminished,
} from './sequence_enharmonic_rules';

const GRID_TOKEN = /(\s|^)(\S+)(?=\s|$)/g;

interface ChordSequenceEntry extends SequenceChord {
  segment: number;
}

type ChordLocation =
  | { pair: ChordLyricsPair }
  | { literal: Literal; tokenIndex: number };

function normalizeEntries(entries: ChordSequenceEntry[]): Chord[] {
  const normalized = entries.map((entry) => entry.normalized);
  let previousRootedIndex: number | null = null;
  let segment: number | null = null;

  entries.forEach((entry, index) => {
    if (entry.segment !== segment) {
      segment = entry.segment;
      previousRootedIndex = null;
    }
    if (!entry.normalized.root) {
      previousRootedIndex = null;
      return;
    }
    if (previousRootedIndex !== null) {
      const previous = entries[previousRootedIndex];
      normalized[previousRootedIndex] = respellLeadingToneDiminished(
        { ...previous, normalized: normalized[previousRootedIndex] },
        entry.source,
      );
    }
    previousRootedIndex = index;
  });

  return normalized;
}

class SongSequenceEnharmonicNormalizer {
  private entries: ChordSequenceEntry[] = [];

  private locations: ChordLocation[] = [];

  private segment = 0;

  constructor(private song: Song, private key: Key | string | null) {}

  normalize(): Song {
    if (!this.hasDiminishedCandidate()) return this.song;
    this.collectEntries();
    const replacements = this.replacements();
    if (replacements.pairs.size === 0 && replacements.literals.size === 0) return this.song;

    return this.song.mapItems((item) => {
      if (item instanceof ChordLyricsPair) return this.replacePair(item, replacements.pairs);
      if (item instanceof Literal) return this.replaceLiteral(item, replacements.literals);
      return item;
    });
  }

  private hasDiminishedCandidate(): boolean {
    return this.song.lines.some((line) => line.items.some((item) => {
      if (item instanceof ChordLyricsPair) return hasLeadingToneDiminishedCandidate(item.chords);
      return item instanceof Literal && this.isMusicalLiteral(item) &&
        hasLeadingToneDiminishedCandidate(item.string);
    }));
  }

  private collectEntries() {
    this.song.lines.forEach((line) => {
      if (line.isEmpty()) this.segment += 1;
      const context = this.key || line.key || this.song.key;
      line.items.forEach((item) => this.collectItem(item, context));
    });
  }

  private collectItem(item: Item, context: Key | string | null) {
    if (item instanceof Tag && this.isBoundary(item)) {
      this.segment += 1;
    } else if (item instanceof ChordLyricsPair) {
      this.collectPair(item, context);
    } else if (item instanceof Literal && this.isMusicalLiteral(item)) {
      this.addLiteral(item, context);
    }
  }

  private collectPair(pair: ChordLyricsPair, context: Key | string | null) {
    const { chord } = pair;
    if (!chord && pair.chords.trim() && !isFlowSymbolKind(pair.tokenKind)) this.segment += 1;
    this.addChord(chord, context, { pair });
  }

  private addLiteral(literal: Literal, context: Key | string | null) {
    let tokenIndex = 0;
    literal.string.replace(GRID_TOKEN, (_match, _space, token) => {
      const chord = Chord.parse(token);
      if (chord) {
        this.addChord(chord, context, { literal, tokenIndex });
        tokenIndex += 1;
      } else if (classifyChordLineToken(token).kind === 'no-chord') {
        this.segment += 1;
      }
      return _match;
    });
  }

  private addChord(chord: Chord | null, context: Key | string | null, location: ChordLocation) {
    if (!chord) return;
    this.entries.push({
      source: chord,
      normalized: chord.normalize(context, { normalizeSuffix: false }),
      segment: this.segment,
    });
    this.locations.push(location);
  }

  private replacements(): {
    pairs: Map<ChordLyricsPair, Chord>;
    literals: Map<Literal, Map<number, Chord>>;
    } {
    const pairs = new Map<ChordLyricsPair, Chord>();
    const literals = new Map<Literal, Map<number, Chord>>();
    normalizeEntries(this.entries).forEach((chord, index) => {
      const entry = this.entries[index];
      const addsSequenceSpelling = !!chord.root?.sequenceSpelling && !entry.source.root?.sequenceSpelling;
      if (chord.toString() === entry.normalized.toString() && !addsSequenceSpelling) return;
      this.recordReplacement(this.locations[index], chord, pairs, literals);
    });
    return { pairs, literals };
  }

  private recordReplacement(
    location: ChordLocation,
    chord: Chord,
    pairs: Map<ChordLyricsPair, Chord>,
    literals: Map<Literal, Map<number, Chord>>,
  ) {
    if ('pair' in location) {
      pairs.set(location.pair, chord);
      return;
    }
    const tokens = literals.get(location.literal) || new Map<number, Chord>();
    tokens.set(location.tokenIndex, chord);
    literals.set(location.literal, tokens);
  }

  private replacePair(pair: ChordLyricsPair, replacements: Map<ChordLyricsPair, Chord>): ChordLyricsPair {
    const chord = replacements.get(pair);
    return chord ? pair.set({ chords: chord.toString(), chordObj: chord }) : pair;
  }

  private replaceLiteral(literal: Literal, replacements: Map<Literal, Map<number, Chord>>): Literal {
    const tokens = replacements.get(literal);
    if (!tokens) return literal;
    let tokenIndex = 0;
    const string = literal.string.replace(GRID_TOKEN, (match, space, token) => {
      if (!Chord.parse(token)) return match;
      const chord = tokens.get(tokenIndex);
      tokenIndex += 1;
      return chord ? `${space}${chord}` : match;
    });
    return new Literal(string);
  }

  private isMusicalLiteral(literal: Literal): boolean {
    const type = literal.parentLine?.type;
    return !type || ![ABC, LILYPOND, SVG, TEXTBLOCK].includes(type);
  }

  private isBoundary(tag: Tag): boolean {
    return [KEY, NEW_KEY].includes(tag.name) || tag.isSectionDelimiter();
  }
}

export default function normalizeSongSequenceEnharmonics(
  song: Song,
  key: Key | string | null = null,
): Song {
  return new SongSequenceEnharmonicNormalizer(song, key).normalize();
}
