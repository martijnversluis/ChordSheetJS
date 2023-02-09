// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
function combineChordSheetLines(newLine: string | null, lines, trailingLine): any[] {
  const hasEmptyLine = newLine && newLine.length > 0;
  const emptyLines = hasEmptyLine ? [{ type: 'line', items: [] }] : [];
  return [...emptyLines, ...lines, trailingLine];
}

function pairChordsWithLyrics(chordsLine, lyricsLine) {
  const { content: lyrics } = lyricsLine;

  const chords = chordsLine.items;

  const chordLyricsPairs = chords.map((chord, i) => {
    const nextChord = chords[i + 1];
    const start = chord.column - 1;
    const end = nextChord ? nextChord.column - 1 : lyrics.length;
    const pairLyrics = lyrics.substring(start, end);
    const secondWordPosition = pairLyrics.search(/(?<=\s+)\S/);

    const chordData = (chord.type === 'chord') ? { chord } : { chords: chord.value };

    if (secondWordPosition !== -1 && secondWordPosition < end) {
      return [
        { type: 'chordLyricsPair', ...chordData, lyrics: `${pairLyrics.substring(0, secondWordPosition).trim()} ` },
        { type: 'chordLyricsPair', chords: '', lyrics: pairLyrics.substring(secondWordPosition) },
      ];
    }
    const trimmedLyrics = /.+\s+$/.test(pairLyrics) ? `${pairLyrics.trim()} ` : pairLyrics;
    return { type: 'chordLyricsPair', ...chordData, lyrics: trimmedLyrics };
  }).flat();

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

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
function arrangeChordSheetLines(chordSheetLines: any[]) {
  const arrangedLines: any[] = [];
  let lineIndex = 0;
  const lastLineIndex = chordSheetLines.length - 1;

  while (lineIndex <= lastLineIndex) {
    const chordSheetLine = chordSheetLines[lineIndex];
    const { type } = chordSheetLine;

    if (type === 'lyricsLine') {
      arrangedLines.push(lyricsToLine(chordSheetLine));
    } else if (type === 'chordsLine') {
      const nextLine = chordSheetLines[lineIndex + 1];

      if (nextLine && nextLine.type === 'lyricsLine' && nextLine.content && nextLine.content.length > 0) {
        arrangedLines.push(pairChordsWithLyrics(chordSheetLine, nextLine));
        lineIndex += 1;
      } else {
        arrangedLines.push(chordsToLine(chordSheetLine));
      }
    } else {
      arrangedLines.push(chordSheetLine);
    }

    lineIndex += 1;
  }

  return arrangedLines;
}
