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
    return helpers.composeChordSheetContents(newLine, lines, trailingLine, options.chopFirstWord !== false);
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
  = _S_ symbol:RhythmSymbol _S_ {
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
  = _S_ chord:Chord ![a-zA-Z] _S_ {
      return chord;
    }

DirectionLine
  = line:$(_S_ keyword:Keyword _S_ WordChar* _S_) {
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
  = key:$(MetadataKey) _S_ Colon _S_ value:$(MetadataValue) {
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
  = "{" _S_ pair:MetadataPairWithoutBrackets _S_ "}" {
    return pair;
  }

MetadataPairWithoutBrackets
  = key:$(MetadataKey) _S_ Colon _S_ value:$(MetadataValue) {
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

_S_ "whitespace"
  = [ \t]*
