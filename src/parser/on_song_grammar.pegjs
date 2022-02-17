// https://www.onsongapp.com/docs/features/formats/onsong/

ChordSheet
  = metadata:Metadata __ sections:Section* {
    return { type: "chordsheet", metadata, sections }
  }

// https://www.onsongapp.com/docs/features/formats/onsong/metadata/
Metadata
    // First line is implicitly title
  = first:(!Metatag value:MetaValue EOL {
      return { type: "metatag", name: "title", value }
    })?
    // Second line is implicitly artist
    second:(!Metatag value:MetaValue EOL {
      return { type: "metatag", name: "artist", value }
    })?
    rest:(@Metatag __)*
  {
    return [ first, second, ...rest ].filter(Boolean)
  }

Metatag "metatag"
  = name:MetaName _ ":" _ value:MetaValue EOL {
    return { type: "metatag", name: name.toLowerCase().trim(), value }
  }

MetaName
  = $[^\r\n:]+

MetaValue
  = $[^\r\n]+

// https://www.onsongapp.com/docs/features/formats/onsong/section/
Section
    // Section with explcit name and maybe a body
  = name:SectionName __ items:SectionBody* { return { type: 'section', name, items } }
    // Section without explicit name
  / items:SectionBody+ { return { type: 'section', name: null, items } }

SectionName
  = name:MetaName _ ":" EOL {
    return name.trim()
  }

SectionBody
  = @Stanza __

Stanza
  = lines:Line+ {
    return { type: 'stanza', lines }
  }

Line
  = parts:(ChordLyricsPair / JustChords / JustLyrics)+ EOL {
    return {type: 'line', parts }
  }

JustChords
  = chords:Chord {
    return { type: "ChordLyricsPair", chords, lyrics: "" }
  }

JustLyrics
  = lyrics:Lyrics {
    return { type: "ChordLyricsPair", lyrics, chords: "" }
  }

ChordLyricsPair
  = chords:Chord lyrics:Lyrics {
    return { type: "ChordLyricsPair", chords: chords || '', lyrics }
  }

Chord "chord"
  = !Escape "[" chords:$(ChordChar*) "]" {
    return chords;
  }

ChordChar
  = [^\]]

Lyrics "lyrics"
  = $(Char+)

// MusicalInstruction // e.g. (Repeat 8x)
//  = "(" [^)]+ ")"

Char
  = [^\|\[\]\\#\r\n]

Escape
  = "\\"

Space
  = "\t" / " "

NewLine "new line"
  = "\r\n" / "\r" / "\n"

EOL "end of line" // Strict linebreak or end of file
  = _ (NewLine / EOF)

EOF
  = !.

_ // Insignificant space
  = Space*

__ // Insignificant whitespace
  = (Space / NewLine)*
