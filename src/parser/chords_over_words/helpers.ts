import { chopFirstWord as chopFirstWordFunc } from '../parser_helpers';

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

interface RhythmSymbol {
  type: 'symbol',
  value: '/' | '|' | '-' | 'x',
  column: number,
}

interface NoChord {
  type: 'noChord',
  value: string,
  column: number,
}

interface ChordInstruction {
  type: 'instruction',
  value: string,
  column: number,
}

type DirectionLine = SerializedLine;
type InlineMetadata = SerializedLine;

interface ChordsLine {
  type: 'chordsLine',
  items: (Chord | RhythmSymbol | NoChord | ChordInstruction)[]
}

interface LyricsLine {
  type: 'lyricsLine',
  content: Lyrics,
}

type ChordSheetLine = DirectionLine | InlineMetadata | ChordsLine | LyricsLine;

function combineChordSheetLines(
  newLine: NewLine | null,
  lines: ChordSheetLine[],
  trailingLine: ChordSheetLine | null,
): ChordSheetLine[] {
  const hasEmptyLine = newLine && newLine.length > 0;
  const emptyLines = (hasEmptyLine ? [{ type: 'line', items: [] }] : []) as ChordSheetLine[];
  return [...emptyLines, ...lines, trailingLine].filter((x) => x !== null);
}

function applySoftLineBreaks(line: string): (SerializedSoftLineBreak | SerializedChordLyricsPair | null)[] {
  // Split on backslash and handle the space separately to preserve trailing space
  return line
    .split(/\\\s+/)
    .flatMap((lyric, index) => ([
      index === 0 ? null : { type: 'softLineBreak', content: ' ' },
      lyric.length === 0 ? null : { type: 'chordLyricsPair', chords: '', lyrics: lyric },
    ]));
}

type ChordItem = Chord | NoChord | ChordInstruction | RhythmSymbol;
type ChordProperties = Omit<Chord, 'type'>;

function chordProperties(chord: Chord): ChordProperties {
  // Disable no-unused-vars until destructuredObjectIgnorePattern is available
  const { type: _type, ...properties } = chord;
  return properties;
}

function getChordData(item: ChordItem) {
  if (item.type === 'chord') {
    return { chord: chordProperties(item) };
  }
  if (item.type === 'instruction') {
    return { chords: item.value, isInstruction: true };
  }
  if (item.type === 'symbol') {
    return { chords: item.value, isRhythmSymbol: true };
  }
  return { chords: item.value };
}

function buildSoftLineBreakResult(
  chordData: ReturnType<typeof getChordData>,
  firstWord: string,
  rest: string | null,
): (SerializedChordLyricsPair | SerializedSoftLineBreak)[] {
  const cleanFirstWord = firstWord.replace(/\\\s*$/, '');
  const result: (SerializedChordLyricsPair | SerializedSoftLineBreak)[] = [
    { ...chordData, type: 'chordLyricsPair', lyrics: cleanFirstWord } as SerializedChordLyricsPair,
    { type: 'softLineBreak', content: ' ' } as SerializedSoftLineBreak,
  ];

  if (rest) {
    result.push(...applySoftLineBreaks(rest).filter((x) => x !== null));
  }

  return result;
}

function buildChordLyricsPairForItem(
  item: ChordItem,
  nextItem: ChordItem | undefined,
  lyrics: string,
  chopFirstWord: boolean,
): (SerializedChordLyricsPair | SerializedSoftLineBreak)[] | SerializedChordLyricsPair {
  const start = item.column - 1;
  const end = nextItem ? nextItem.column - 1 : lyrics.length;
  const pairLyrics = lyrics.substring(start, end);
  const [firstWord, rest] = chopFirstWord ? chopFirstWordFunc(pairLyrics) : [pairLyrics, null];
  const chordData = getChordData(item);

  const hasSoftLineBreakInFirst = firstWord && /\\\s*$/.test(firstWord);

  if (hasSoftLineBreakInFirst) {
    return buildSoftLineBreakResult(chordData, firstWord, rest);
  }

  if (rest) {
    return [
      { ...chordData, type: 'chordLyricsPair', lyrics: `${firstWord} ` } as SerializedChordLyricsPair,
      ...applySoftLineBreaks(rest),
    ].filter((x) => x !== null);
  }

  return { ...chordData, type: 'chordLyricsPair', lyrics: firstWord } as SerializedChordLyricsPair;
}

function isChordItem(item: Chord | RhythmSymbol | NoChord | ChordInstruction): item is ChordItem {
  return item.type === 'chord' || item.type === 'noChord' || item.type === 'instruction' || item.type === 'symbol';
}

function constructItemLyricsPairs(
  items: ChordItem[],
  lyrics: string,
  chopFirstWord: boolean,
): (SerializedChordLyricsPair | SerializedSoftLineBreak)[] {
  return items
    .map((item, i) => buildChordLyricsPairForItem(item, items[i + 1], lyrics, chopFirstWord))
    .flat();
}

function pairChordsWithLyrics(
  chordsLine: ChordsLine,
  lyricsLine: LyricsLine,
  chopFirstWord: boolean,
): SerializedLine {
  const { content: lyrics } = lyricsLine;

  const chordItems = chordsLine.items.filter(isChordItem);
  const chordLyricsPairs = constructItemLyricsPairs(chordItems, lyrics, chopFirstWord);
  const firstItem = chordItems[0];

  if (firstItem && firstItem.column > 1) {
    const firstItemPosition = firstItem.column;

    if (firstItemPosition > 0) {
      chordLyricsPairs.unshift({
        type: 'chordLyricsPair',
        chords: '',
        lyrics: lyrics.substring(0, firstItemPosition - 1),
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

function chordsLineItemToChordLyricsPair(
  item: Chord | RhythmSymbol | NoChord | ChordInstruction,
): SerializedChordLyricsPair {
  switch (item.type) {
    case 'chord':
      return {
        type: 'chordLyricsPair', chord: item, chords: '', lyrics: null,
      };
    case 'symbol':
      return {
        type: 'chordLyricsPair', chords: item.value, lyrics: null, isRhythmSymbol: true,
      };
    case 'noChord':
      return { type: 'chordLyricsPair', chords: item.value, lyrics: null };
    case 'instruction':
      return {
        type: 'chordLyricsPair', chords: item.value, lyrics: null, isInstruction: true,
      };
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

function buildLine(
  chordSheetLine: ChordSheetLine,
  nextLine: ChordSheetLine,
  chopFirstWord: boolean,
): [SerializedLine, boolean] {
  const { type } = chordSheetLine;

  if (type === 'lyricsLine') {
    return [lyricsToLine(chordSheetLine), false];
  } if (type === 'chordsLine') {
    if (nextLine && nextLine.type === 'lyricsLine' && nextLine.content && nextLine.content.length > 0) {
      return [pairChordsWithLyrics(chordSheetLine, nextLine, chopFirstWord), true];
    }
    return [chordsToLine(chordSheetLine), false];
  }
  return [chordSheetLine, false];
}

function arrangeChordSheetLines(chordSheetLines: ChordSheetLine[], chopFirstWord: boolean): SerializedLine[] {
  const arrangedLines: SerializedLine[] = [];
  let lineIndex = 0;
  const lastLineIndex = chordSheetLines.length - 1;

  while (lineIndex <= lastLineIndex) {
    const chordSheetLine = chordSheetLines[lineIndex];
    const nextLine = chordSheetLines[lineIndex + 1];
    const [arrangedLine, skipNextLine] = buildLine(chordSheetLine, nextLine, chopFirstWord);
    arrangedLines.push(arrangedLine);
    lineIndex += (skipNextLine ? 2 : 1);
  }

  return arrangedLines;
}

export function composeChordSheetContents(
  newLine: NewLine | null,
  lines: ChordSheetLine[],
  trailingLine: ChordSheetLine | null,
  chopFirstWord: boolean,
) {
  const allLines = combineChordSheetLines(newLine, lines, trailingLine);
  return arrangeChordSheetLines(allLines, chopFirstWord);
}
