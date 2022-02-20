// https://www.onsongapp.com/docs/features/formats/onsong/
ChordSheet
  = metadata:Metadata sections:Section* {
    return { type: "chordsheet", metadata, sections }
  }

// https://www.onsongapp.com/docs/features/formats/onsong/metadata/
Metadata
  = (@Metatag EOL __)*

Metatag "metatag"
  = "{" _ @Metatag _ "}"
  / name:((@MetaName _ ":") / ImplicitMetaName) _ value:MetaValue {
      return { type: "metatag", name: name.toLowerCase().trim(), value }
    }

MetaName
  = $[^\r\n:{]+

ImplicitMetaName
  = & { return location().start.line <= 2 } {
      switch(location().start.line) {
        case 1: return 'title'; // First line is implicitly title
        case 2: return 'artist'; // Second line is implicitly artist
      }
    }

MetaValue
  = $[^\r\n}]+

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
  = @(Tab / Stanza) __

Stanza
  = lines:Line+ {
    return { type: 'stanza', lines }
  }

Line
  = parts:(MusicalInstruction / ChordLyricsPair)+ EOL {
    return {type: 'line', parts }
  }

ChordLyricsPair
  = chords:Chord lyrics:Lyrics {
      return { type: "ChordLyricsPair", chords: chords || '', lyrics }
    }
  / chords:Chord {
      return { type: "ChordLyricsPair", chords, lyrics: "" }
    }
  / lyrics:Lyrics {
    return { type: "ChordLyricsPair", lyrics, chords: "" }
  }

Chord "chord"
  = !Escape "[" chords:$(ChordChar*) "]" {
    return chords;
  }

ChordChar
  = [^\]]

Lyrics "lyrics"
  = $Char+

Tab
  = SotDirective NewLine content:$(!EotDirective TabLine __)+ EotDirective {
      return { type: 'tab', content }
    }
  / StartOfTabDirective NewLine content:$(!EndOfTabDirective TabLine __)+ EndOfTabDirective {
      return { type: 'tab', content }
    }

SotDirective = "{sot}"
StartOfTabDirective = "{start_of_tab}"
EotDirective = "{eot}"
EndOfTabDirective = "{end_of_tab}"
TabLine = [^\r\n]+ NewLine

MusicalInstruction // e.g. (Repeat 8x)
  = "(" content:$[^)]+ ")" {
      return { type: 'instruction', content }
    }

Char
  = [^\|\[\\#\(\r\n]

Escape
  = "\\"

Space "space"
  = [ \t]

NewLine "new line"
  = "\r\n" / "\r" / "\n"

EOL "end of line" // Strict linebreak or end of file
  = _ (NewLine / EOF)

EOF "end of file"
  = !.

_ // Insignificant space
  = Space*

__ // Insignificant whitespace
  = (Space / NewLine)*
