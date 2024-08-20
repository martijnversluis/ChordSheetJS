import { chopFirstWord } from '../parser_helpers';

import {
  SerializedChord,
  SerializedChordLyricsPair,
  SerializedLine,
  SerializedSoftLineBreak,
} from '../../serialized_types';

type CarriageReturn = '\r';
type LineFeed = '\n';
type CarriageReturnLineFeed = '\r\n';
type NewLine = CarriageReturn | LineFeed | CarriageReturnLineFeed;

type Lyrics = string;
type Chord = { column: number, value: string } & SerializedChord;

type RhythmSymbol = {
  type: 'symbol',
  value: '/' | '|' | '-' | 'x',
  column: number,
};

type DirectionLine = SerializedLine;
type InlineMetadata = SerializedLine;

type ChordsLine = {
  type: 'chordsLine',
  items: Array<Chord | RhythmSymbol>
};

type LyricsLine = {
  type: 'lyricsLine',
  content: Lyrics,
};

type ChordSheetLine = DirectionLine | InlineMetadata | ChordsLine | LyricsLine;

function combineChordSheetLines(
  newLine: NewLine | null,
  lines: ChordSheetLine[],
  trailingLine: ChordSheetLine | null,
): ChordSheetLine[] {
  const hasEmptyLine = newLine && newLine.length > 0;
  const emptyLines = (hasEmptyLine ? [{ type: 'line', items: [] }] : []) as ChordSheetLine[];
  return [...emptyLines, ...lines, trailingLine].filter(x => x !== null);
}

function applySoftLineBreaks(line: string): Array<SerializedSoftLineBreak | SerializedChordLyricsPair | null> {
  return line
    .split(/\\\s+/)
    .flatMap((lyric, index) => ([
      index === 0 ? null : { type: 'softLineBreak' },
      lyric.length === 0 ? null : { type: 'chordLyricsPair', chords: '', lyrics: lyric },
    ]));
}

type ChordProperties = Omit<Chord, 'type'>;

function chordProperties(chord: Chord): ChordProperties {
  // Disable no-unused-vars until destructuredObjectIgnorePattern is available
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { type: _type, ...properties } = chord;
  return properties;
}

function constructChordLyricsPairs(
  chords: Chord[],
  lyrics: string,
): Array<SerializedChordLyricsPair | SerializedSoftLineBreak> {
  return chords.map((chord, i) => {
    const nextChord = chords[i + 1];
    const start = chord.column - 1;
    const end = nextChord ? nextChord.column - 1 : lyrics.length;
    const pairLyrics = lyrics.substring(start, end);
    const [firstWord, rest] = chopFirstWord(pairLyrics);
    const chordData = (chord.type === 'chord') ? { chord: chordProperties(chord) } : { chords: chord.value };

    if (rest) {
      return [
        { ...chordData, type: 'chordLyricsPair', lyrics: `${firstWord} ` } as SerializedChordLyricsPair,
        ...applySoftLineBreaks(rest),
      ].filter(x => x !== null);
    }

    return { ...chordData, type: 'chordLyricsPair', lyrics: firstWord } as SerializedChordLyricsPair;
  }).flat();
}

function pairChordsWithLyrics(chordsLine: ChordsLine, lyricsLine: LyricsLine): SerializedLine {
  const { content: lyrics } = lyricsLine;

  const chords = chordsLine.items as Chord[];
  const chordLyricsPairs = constructChordLyricsPairs(chords, lyrics);
  const firstChord = chords[0];

  if (firstChord && firstChord.column > 1) {
    const firstChordPosition = firstChord.column;

    if (firstChordPosition > 0) {
      chordLyricsPairs.unshift({
        type: 'chordLyricsPair',
        chords: '',
        lyrics: lyrics.substring(0, firstChordPosition - 1),
      });
    }
  }

  return { type: 'line', items: chordLyricsPairs };
}

function lyricsStringToLine(lyrics: string): SerializedLine {
  return {
    type: 'line',
    items: [
      {
        type: 'chordLyricsPair',
        chords: '',
        lyrics,
      },
    ],
  };
}

function chordsLineItemToChordLyricsPair(item: Chord | RhythmSymbol): SerializedChordLyricsPair {
  switch (item.type) {
    case 'chord':
      return { type: 'chordLyricsPair', chord: item, chords: '', lyrics: null };
    case 'symbol':
      return { type: 'chordLyricsPair', chords: item.value, lyrics: null };
    default:
      throw new Error(`Unexpected chordsLine item ${item}`);
  }
}

function chordsToLine(chordsLine: ChordsLine): SerializedLine {
  return {
    type: 'line',
    items: chordsLine.items.map((item) => chordsLineItemToChordLyricsPair(item)),
  };
}

function lyricsToLine(lyricsLine: LyricsLine): SerializedLine {
  const { content } = lyricsLine;

  if (content && content.length > 0) {
    return lyricsStringToLine(content);
  }

  return { type: 'line', items: [] };
}

function buildLine(chordSheetLine: ChordSheetLine, nextLine: ChordSheetLine): [SerializedLine, boolean] {
  const { type } = chordSheetLine;

  if (type === 'lyricsLine') {
    return [lyricsToLine(chordSheetLine), false];
  } if (type === 'chordsLine') {
    if (nextLine && nextLine.type === 'lyricsLine' && nextLine.content && nextLine.content.length > 0) {
      return [pairChordsWithLyrics(chordSheetLine, nextLine), true];
    }
    return [chordsToLine(chordSheetLine), false];
  }
  return [chordSheetLine, false];
}

function arrangeChordSheetLines(chordSheetLines: ChordSheetLine[]): SerializedLine[] {
  const arrangedLines: SerializedLine[] = [];
  let lineIndex = 0;
  const lastLineIndex = chordSheetLines.length - 1;

  while (lineIndex <= lastLineIndex) {
    const chordSheetLine = chordSheetLines[lineIndex];
    const nextLine = chordSheetLines[lineIndex + 1];
    const [arrangedLine, skipNextLine] = buildLine(chordSheetLine, nextLine);
    arrangedLines.push(arrangedLine);
    lineIndex += (skipNextLine ? 2 : 1);
  }

  return arrangedLines;
}

export function composeChordSheetContents(
  newLine: NewLine | null,
  lines: ChordSheetLine[],
  trailingLine: ChordSheetLine | null,
) {
  const allLines = combineChordSheetLines(newLine, lines, trailingLine);
  return arrangeChordSheetLines(allLines);
}
