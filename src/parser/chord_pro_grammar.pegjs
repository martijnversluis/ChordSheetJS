ChordSheet
  = lines: LineWithNewline* line: Line? {
  return {
    type: "chordSheet",
    lines: [...lines, line]
  }
}

LineWithNewline
  = line: Line NewLine {
  return line
}

Line
  = lyrics:Lyrics? tokens:Token* chord:Chord? comment:Comment? {
  return {
    type: "line",
    items: [
      lyrics ? {type: "chordLyricsPair", chord: null, lyrics} : null,
      ...tokens,
      chord ? {type: "chordLyricsPair", chord, lyrics: null} : null,
      comment ? {type: "comment", comment} : null
    ].filter(x => x)
  }
}

Token
  = (Tag / ChordLyricsPair / MetaTernary)

Comment
  = Space? "#" comment:$([^\r\n]*) {
  return comment;
}

ChordLyricsPair
  = chord: Chord lyrics:$(Lyrics*) {
  return { type: "chordLyricsPair", chord, lyrics }
}

Lyrics
  = lyrics: LyricsChar+ {
  return lyrics.map(c => c.char || c).join("");
}

Chord
  = !Escape "[" chord:ChordChar* "]" {
  return chord.map(c => c.char || c).join("");
}

ChordChar
  = [^\]\r\n]
  / Escape
    sequence:(
        "\\" { return {type: "char", char: "\\"}; }
      / "]" { return {type: "char", char: "]"}; }
    )
    { return sequence; }

MetaTernary
  = "%{" _ variableName:$(MetaVariableName?) _ expressions:MetaTernaryTrueFalseExpressions? _ "}" {
  return {
    "type": "metaTernary",
    variable: variableName,
    expressions
  };
}

MetaTernaryTrueFalseExpressions
  = "|" _ trueExpression:MetaExpression _ falseExpression:MetaTernaryFalseExpression? _ {
  return {
    "type": "trueFalseExpression",
    trueExpression,
    falseExpression
  }
}

MetaTernaryFalseExpression
  = "|" _ falseExpression:MetaExpression {
  return {"type": "falseExpression", falseExpression: falseExpression };
}

MetaVariableName
  = [a-zA-Z0-9-_]+

MetaExpression
  = ($(Char+) / MetaTernary)+

LyricsChar
  = Char
  / "]" { return {type: "char", char: "]"}; }
  / "}" { return {type: "char", char: "\x7d"}; }
  / "%" { return {type: "char", char: "%"}; }

Char
  = [^\|\[\]\\\{\}%#\r\n]
  / Escape
    sequence:(
        "\\" { return {type: "char", char: "\\"}; }
      / "|" { return {type: "char", char: "|"}; }
      / "[" { return {type: "char", char: "["}; }
      / "]" { return {type: "char", char: "]"}; }
      / "{" { return {type: "char", char: "\x7b"}; }
      / "}" { return {type: "char", char: "\x7d"}; }
      / "%" { return {type: "char", char: "%"}; }
      / "#" { return {type: "char", char: "#"}; }
    )
    { return sequence; }

Tag
  = "{" _ tagName:$(TagName) _ tagColonWithValue: TagColonWithValue? _ "}" {
  return {
    type: "tag",
    name: tagName,
    value: tagColonWithValue
  }
}

TagColonWithValue
  = ":" _ tagValue:$(TagValue) {
  return tagValue;
}

TagName
  = [a-zA-Z-_]+

TagValue
  = TagValueChar+

TagValueChar
  = [^\}\r\n]
  / Escape
    sequence:(
        "\\" { return {type: "char", char: "\\"}; }
      / "}" { return {type: "char", char: "\x7d"}; }
    )
    { return sequence; }

_ "whitespace"
  = [ \t\n\r]*

Space "space"
  = [ \t]+

NewLine
  = CarriageReturn / LineFeed / CarriageReturnLineFeed

CarriageReturnLineFeed
  = CarriageReturn LineFeed

LineFeed
  = "\n"

CarriageReturn
  = "\r"

Escape
  = "\\"

Pound
  = "#"
