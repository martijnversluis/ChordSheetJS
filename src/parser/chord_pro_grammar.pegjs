ChordSheet
  = lines: LineWithNewline* line: Line? {
      return {
        type: 'chordSheet',
        lines: [...lines, line],
      };
    }

LineWithNewline
  = line: Line NewLine {
      return line;
    }

Line
  = lyrics:$(Lyrics?) tokens:Token* chords:Chord? comment:Comment? Space* {
      return {
        type: 'line',
        items: [
          lyrics ? { type: 'chordLyricsPair', chords: '', lyrics } : null,
          ...tokens,
          chords ? { type: 'chordLyricsPair', chords, lyrics: '' } : null,
          comment ? { type: 'comment', comment } : null,
        ].filter(x => x),
      };
    }

Token
  = Tag
  / ChordLyricsPair
  / MetaTernary
  / lyrics:Lyrics {
      return { type: 'chordLyricsPair', chords: '', lyrics };
    }

Comment
  = Space? "#" comment:$([^\r\n]*) {
      return comment;
    }

ChordLyricsPair
  = chords: Chord lyrics:$(LyricsChar*) space:$(Space*) {
      return {
        type: 'chordLyricsPair',
        chords: chords || '',
        lyrics: lyrics + (space || ''),
      };
    }

Lyrics
  = lyrics: LyricsCharOrSpace+ {
      return lyrics.map(c => c.char || c).join('');
    }

LyricsCharOrSpace
  = (LyricsChar / Space)

Chord
  = !Escape "[" chords:ChordChar* "]" {
      return chords.map(c => c.char || c).join('');
    }

ChordChar
  = [^\]\r\n]
  / Escape
    sequence:(
        "\\" { return { type: 'char', char: '\\' }; }
      / "]"  { return { type: 'char', char: ']'  }; }
    ) {
      return sequence;
    }

MetaTernary
  = "%{" _ variableName:$(MetaVariableName?) valueTest:MetaValueTest? _ expressions:MetaTernaryTrueFalseExpressions? _ "}" {
      return {
        type: 'ternary',
        variable: variableName.length > 0 ? variableName : null,
        valueTest,
        ...expressions,
        location: location().start,
      };
    }

MetaValueTest
  = "=" _ testValue:MetaTestValue {
      return testValue;
    }

MetaTestValue
  = $(Char+)

MetaTernaryTrueFalseExpressions
  = "|" _ trueExpression:MetaExpression _ falseExpression:MetaTernaryFalseExpression? _ {
      return {
        type: 'ternary',
        trueExpression,
        falseExpression,
        location: location().start,
      };
    }

MetaTernaryFalseExpression
  = "|" _ falseExpression:MetaExpression {
      return falseExpression;
    }

MetaVariableName
  = [a-zA-Z0-9-_]+

MetaExpression
  = ($(Char+) / MetaTernary)+

LyricsChar
  = WordChar
  / "]" { return { type: 'char', char: ']'    }; }
  / "|" { return { type: 'char', char: '|'    }; }
  / "}" { return { type: 'char', char: '\x7d' }; }

Char
  = WordChar
  / Space

WordChar
  = [^\|\[\]\\\{\}%#\r\n\t ]
  / Escape
    sequence:(
        "\\" { return { type: 'char', char: '\\'   }; }
      / "|"  { return { type: 'char', char: '|'    }; }
      / "["  { return { type: 'char', char: '['    }; }
      / "]"  { return { type: 'char', char: ']'    }; }
      / "{"  { return { type: 'char', char: '\x7b' }; }
      / "}"  { return { type: 'char', char: '\x7d' }; }
      / "%"  { return { type: 'char', char: '%'    }; }
      / "#"  { return { type: 'char', char: '#'    }; }
    ) {
      return sequence;
    }

Tag
  = "{" _ tagName:$(TagName) _ tagColonWithValue: TagColonWithValue? _ "}" {
      return {
        type: 'tag',
        name: tagName,
        value: tagColonWithValue,
        location: location().start,
      };
    }

TagColonWithValue
  = ":" _ tagValue:TagValue {
      return tagValue.map(c => c.char || c).join('');
    }

TagName
  = [a-zA-Z-_]+

TagValue
  = TagValueChar*

TagValueChar
  = [^}\\\r\n]
  / Escape
    sequence:(
        "\\" { return { type: 'char', char: '\\'   }; }
      / "}"  { return { type: 'char', char: '\x7d' }; }
      / "{"  { return { type: 'char', char: '\x7b' }; }
    ) {
      return sequence;
    }

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

Percent
  = "%"
