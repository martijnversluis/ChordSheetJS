ChordSheet
  = metadataLines:Metadata? lines:ChordSheetContents? {
      return {
        type: "chordSheet",
        lines: [
          ...metadataLines,
          ...lines,
        ]
      };
    }

ChordSheetContents
  = newLine:NewLine? lines:ChordSheetLineWithNewLine* trailingLine:ChordSheetLine? {
    return helpers.composeChordSheetContents(newLine, lines, trailingLine);
  }

ChordSheetLineWithNewLine
  = item:ChordSheetLine NewLine {
    return item;
  }

ChordSheetLine
  = line:DirectionLine { return line; }
  / line:InlineMetadata { return line; }
  / &(ChordsLine !WordChar) line:ChordsLine { return line; }
  / line:LyricsLine { return line; }

SingleChordsLine
  = chordsLine:ChordsLine & (NewLine ChordsLine) {
      return chordsLine;
    }

ChordsLine
  = items:(ChordWithSpacing / RhythmSymbolWithSpacing)+ {
      return {
        type: "chordsLine",
        items
      };
    }

RhythmSymbolWithSpacing
  = _ symbol:RhythmSymbol _ {
      return symbol;
    }

RhythmSymbol
  = symbol:("/" / "|" / "-" / "x") {
      return {
        type: "symbol",
        value: symbol,
        column: location().start.column
      };
    }

LyricsLine
  = lyrics:Lyrics {
    return { type: "lyricsLine", content: lyrics };
  }

Lyrics
  = $(WordChar*)

NonEmptyLyrics
  = $(WordChar+)

ChordWithSpacing
  = _ chord:Chord _ {
      return chord;
    }

DirectionLine
  = line:$(_ keyword:Keyword _ WordChar* _) {
      return {
        type: "line",
        items: [
          { type: "tag", name: "comment", value: line }
        ]
      };
    }

Keyword
  = "verse"i
  / "chorus"i
  / "bridge"i
  / "tag"i
  / "interlude"i
  / "instrumental"i
  / "intro"i

WordChar
  = [^\n\r]

Metadata
  = pairs:MetadataPairWithNewLine* trailingPair:MetadataPair? MetadataSeparator? {
      return [...pairs, trailingPair]
        .filter(x => x)
        .map(([key, value]) => ({
          type: "line",
          items: [
            { type: "tag", name: key, value },
          ],
        }));
    }

InlineMetadata
  = key:$(MetadataKey) _ Colon _ value:$(MetadataValue) {
      return {
        type: "line",
        items: [
          { type: "tag", name: key, value },
        ],
      }
    }

MetadataPairWithNewLine
  = pair:MetadataPair NewLine {
      return pair;
    }

MetadataPair
  = MetadataPairWithBrackets / MetadataPairWithoutBrackets

MetadataPairWithBrackets
  = "{" _ pair:MetadataPairWithoutBrackets _ "}" {
    return pair;
  }

MetadataPairWithoutBrackets
  = key:$(MetadataKey) _ Colon _ value:$(MetadataValue) {
    return [key, value];
  }

Colon
  = ":"

MetadataKey
  = [a-zA-Z0-9-_]+

MetadataValue
  = [^\n\r}]+

MetadataSeparator
  = "---" NewLine

_ "whitespace"
  = [ \t]*

NewLine
  = CarriageReturn / LineFeed / CarriageReturnLineFeed

CarriageReturnLineFeed
  = CarriageReturn LineFeed

LineFeed
  = "\n"

CarriageReturn
  = "\r"
