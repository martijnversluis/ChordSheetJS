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

LineWithNewline
  = line: Line NewLine {
      return line;
    }

Line
  = lyrics:$(Lyrics?) tokens:Token* chords:Chord? comment:Comment? Space* {
      return helpers.buildLine([
          lyrics ? { type: 'chordLyricsPair', chords: '', lyrics } : null,
          ...helpers.combineChordLyricsPairs(tokens.flat(), options.chopFirstWord),
          chords ? { type: 'chordLyricsPair', chords, lyrics: '' } : null,
          comment ? { type: 'comment', comment } : null,
        ].filter(x => x !== null),
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
  / "%" !"{" { return { type: 'char', char: '%'    }; }
  / "]"      { return { type: 'char', char: ']'    }; }
  / "|"      { return { type: 'char', char: '|'    }; }
  / "}"      { return { type: 'char', char: '\x7d' }; }

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
  = "{" _ name:("chord" / "define") selector:TagSelector? _ ":" _ value:ChordDefinitionValue _ "}" {
      const { text, ...chordDefinition } = value;

      return {
        type: 'tag',
        name,
        value: text,
        chordDefinition,
        location: location().start,
        selector: selector?.value,
        isNegated: selector?.isNegated,
      };
    }

Tag
  = "{" _ tagName:$(TagName) selector:TagSelector? _ tagColonWithValue:TagColonWithValue? "}" {
      return helpers.buildTag(tagName, tagColonWithValue, selector, location());
    }

TagSelector
  = "-" value:TagSelectorValue negator:TagSelectorNegator? {
      return {
        value,
        isNegated: !!negator,
      };
    }

TagSelectorNegator
  = "!" {
      return true;
    }

TagSelectorValue
  = $([a-zA-Z0-9-_]+)

TagColonWithValue
  = ":" tagValue:TagValue {
      return tagValue;
    }

TagValue
  = attributes:TagAttributes {
      return { attributes: attributes };
    }
  / value:TagSimpleValue {
      return { value: value };
    }

TagAttributes
  = attributes:TagAttributeWithLeadingSpace+ {
      const obj = {};

      attributes.forEach((pair) => {
        obj[pair[0]] = pair[1];
      });

      return obj;
    }

TagAttributeWithLeadingSpace
  = __ attribute:TagAttribute {
      return attribute;
    }

TagAttribute
  = name:TagAttributeName _ "=" _ value:TagAttributeValue {
      return [name, value];
    }

TagName
  = [a-zA-Z_]+

TagSimpleValue
  = _ chars:TagValueChar* {
      return chars.map(c => c.char || c).join('');
    }

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

TagAttributeName
  = $([a-zA-Z-_]+)

TagAttributeValue
  = "\"" value:$(TagAttributeValueChar*) "\"" {
      return value;
    }

TagAttributeValueChar
  = [^"}]
  / Escape
    sequence: (
      "\\" { return { type: 'char', char: '\\'   }; }
      / "}"  { return { type: 'char', char: '\x7d' }; }
      / "\"" { return { type: 'char', char: '"' }; }
    ) {
      return sequence;
    }
