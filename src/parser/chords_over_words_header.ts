// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
function combineChordSheetLines(newLine: string | null, lines, trailingLine): any[] {
  const hasEmptyLine = newLine && newLine.length > 0;
  const emptyLines = hasEmptyLine ? [{ type: 'line', items: [] }] : [];
  return [...emptyLines, ...lines, trailingLine];
}

function constructChordLyricsPairs(chords, lyrics) {
  return chords.map((chord, i) => {
    const nextChord = chords[i + 1];
    const start = chord.column - 1;
    const end = nextChord ? nextChord.column - 1 : lyrics.length;
    const pairLyrics = lyrics.substring(start, end);
    const [firstWord, rest] = chopFirstWord(pairLyrics);
    const chordData = (chord.type === 'chord') ? { chord } : { chords: chord.value };

    if (rest) {
      return [
        { type: 'chordLyricsPair', ...chordData, lyrics: `${firstWord} ` },
        { type: 'chordLyricsPair', chords: '', lyrics: rest },
      ];
    }

    return { type: 'chordLyricsPair', ...chordData, lyrics: firstWord };
  }).flat();
}

function pairChordsWithLyrics(chordsLine, lyricsLine) {
  const { content: lyrics } = lyricsLine;

  const chords = chordsLine.items;
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

function lyricsStringToLine(lyrics: string) {
  return {
    type: 'line',
    items: [
      {
        type: 'chordLyricsPair',
        lyrics,
      },
    ],
  };
}

function chordsLineItemToChordLyricsPair(item) {
  switch (item.type) {
    case 'chord':
      return { type: 'chordLyricsPair', chord: item };
    case 'symbol':
      return { type: 'chordLyricsPair', chords: item.value };
    default:
      throw new Error(`Unexpected chordsLine item ${item}`);
  }
}

function chordsToLine(chordsLine) {
  return {
    type: 'line',
    items: chordsLine.items.map((item) => chordsLineItemToChordLyricsPair(item)),
  };
}

function lyricsToLine(lyricsLine) {
  const { content } = lyricsLine;

  if (content && content.length > 0) {
    return lyricsStringToLine(content);
  }

  return { type: 'line', items: [] };
}

function buildLine(chordSheetLine, nextLine) {
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

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
function arrangeChordSheetLines(chordSheetLines: any[]) {
  const arrangedLines: any[] = [];
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
