ChordSheet
  = lines:ComponentWithNewline* trailingLine:Component? {
      return {
        type: 'chordSheet',
        lines: [...lines, trailingLine].flat(),
      };
    }

ComponentWithNewline
  = component:Component NewLine {
      return component;
    }

Component
  = Section / Line

Section =
  ABCSection / GridSection/ LYSection / TabSection

TabSection
  = startTag:TabStartTag NewLine content:$(!TabEndTag SectionCharacter)* endTag:TabEndTag {
      return helpers.buildSection(startTag, endTag, content);
    }

TabStartTag
  = "{" _ tagName:("sot" / "start_of_tab") _ tagColonWithValue: TagColonWithValue? _ "}" {
      return helpers.buildTag(tagName, tagColonWithValue, location());
    }

TabEndTag
  = "{" _ tagName:("eot" / "end_of_tab") _ "}" {
      return helpers.buildTag(tagName, null, location());
    }

ABCSection
  = startTag:ABCStartTag NewLine content:$(!ABCEndTag SectionCharacter)* endTag:ABCEndTag {
      return helpers.buildSection(startTag, endTag, content);
    }

ABCStartTag
  = "{" _ tagName:("start_of_abc") _ tagColonWithValue: TagColonWithValue? _ "}" {
      return helpers.buildTag(tagName, tagColonWithValue, location());
    }

ABCEndTag
  = "{" _ tagName:("end_of_abc") _ "}" {
      return helpers.buildTag(tagName, null, location());
    }

LYSection
  = startTag:LYStartTag NewLine content:$(!LYEndTag SectionCharacter)* endTag:LYEndTag {
      return helpers.buildSection(startTag, endTag, content);
    }

LYStartTag
  = "{" _ tagName:("start_of_ly") _ tagColonWithValue: TagColonWithValue? _ "}" {
      return helpers.buildTag(tagName, tagColonWithValue, location());
    }

LYEndTag
  = "{" _ name:("end_of_ly") _ "}" {
      return helpers.buildTag(name, null, location());
    }

GridSection
  = startTag:GridStartTag NewLine content:$(!GridEndTag SectionCharacter)* endTag:GridEndTag {
      return helpers.buildSection(startTag, endTag, content);
    }

GridStartTag
  = "{" _ tagName:("sog" / "start_of_grid") _ tagColonWithValue: TagColonWithValue? _ "}" {
      return helpers.buildTag(tagName, tagColonWithValue, location());
    }

GridEndTag
  = "{" _ tagName:("eog" / "end_of_grid") _ "}" {
      return helpers.buildTag(tagName, null, location());
    }

SectionCharacter
  = .

LineWithNewline
  = line: Line NewLine {
      return line;
    }

Line
  = lyrics:$(Lyrics?) tokens:Token* chords:Chord? comment:Comment? Space* {
      return helpers.buildLine([
          lyrics ? { type: 'chordLyricsPair', chords: '', lyrics } : null,
          ...tokens.flat(),
          chords ? { type: 'chordLyricsPair', chords, lyrics: '' } : null,
          comment ? { type: 'comment', comment } : null,
        ].filter(x => x),
      );
    }

Token
  = ChordDefinition
  / Tag
  / AnnotationLyricsPair
  / chordLyricsPair:ChordLyricsPair
  / MetaTernary
  / lyrics:Lyrics {
      return helpers.applySoftLineBreaks(lyrics);
    }

Comment
  = Space? "#" comment:$([^\r\n]*) {
      return comment;
    }

AnnotationLyricsPair
  = annotation:Annotation lyrics:$(Lyrics*) space:$(Space*) {
      return {
        type: 'chordLyricsPair',
        annotation: annotation || '',
        lyrics: lyrics + (space || ''),
      };
    }

ChordLyricsPair
  = chords:Chord lyrics:LyricsChar* space:$(Space*) {
      const mergedLyrics = lyrics.map(c => c.char || c).join('') + (space || '');
      return helpers.breakChordLyricsPairOnSoftLineBreak(chords || '', mergedLyrics);
    }

Lyrics
  = lyrics:LyricsCharOrSpace+ {
      return lyrics.map(c => c.char || c).join('');
    }

LyricsCharOrSpace
  = (LyricsChar / Space)

Annotation
  = !Escape "[*" annotation:ChordChar+ "]" {
      return annotation.map(c => c.char || c).join('');
    }

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
      / " "  { return { type: 'char', char: (options?.softLineBreaks ? '\xa0' : ' ') }; }
    ) {
      return sequence;
    }

ChordDefinition
  = "{" _ name:("chord" / "define") _ ":" _ value:ChordDefinitionValue _ "}" {
      const { text, ...chordDefinition } = value;

      return {
        type: 'tag',
        name,
        value: text,
        chordDefinition,
        location: location().start,
      };
    }

ChordDefinitionValue
  = name:$([A-Za-z0-9]+) _ "base-fret" __ baseFret:FretNumber __ "frets" frets:FretWithLeadingSpace+ fingers:ChordFingersDefinition? {
      return { name, baseFret, frets, fingers, text: text() };
    }

ChordFingersDefinition
  = __ "fingers" fingers:FingerNumberWithLeadingSpace+ {
      return fingers;
    }

FingerNumberWithLeadingSpace
  = __ finger:FingerNumber {
      return finger;
    }

FingerNumber
  = number:[1-9] {
      return parseInt(number, 10);
    }

FretWithLeadingSpace
  = __ fret:Fret {
      return fret;
    }

Fret
  = _ fret:(FretNumber / OpenFret / NonSoundingString) {
      return fret;
    }

FretNumber
  = number:[1-9] {
      return parseInt(number, 10);
    }

OpenFret
  = "0" {
      return 0;
    }

NonSoundingString
  = "-1" / "N" / "x"

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

__ "whitespace"
  = WhitespaceCharacter+

_ "optional whitespace"
  = WhitespaceCharacter*

WhitespaceCharacter
  = [ \t\n\r]

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
