// This is a gramar for the OnSong format as documented here:
// https://www.onsongapp.com/docs/features/formats/onsong/

{
  const warnings = options.warnings || []

  function warn(message, location) {
    warnings.push({message, location})
  }
}

ChordSheet
  = metadata:Metadata sections:Section* {
    return { type: "chordsheet", metadata, sections, warnings }
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
    // {start_of_*}
  = DirectiveSection
    // Section with explcit name and maybe a body
  / name:SectionName __ items:SectionBody* { return { type: 'section', name, items } }
    // Section without explicit name
  / items:SectionBody+ { return { type: 'section', name: null, items } }

DirectiveSection
  = "{" _ ("start_of_" / "so") type:DirectiveSectionTypes _ name:(":" _ @MetaValue)? "}" EOL
    items:SectionBody*
    "{" _ ("end_of_" / "eo") DirectiveSectionTypes _ "}" EOL // FIXME: must match start tag
    {
      return { type: 'section', name: name || type, items }
    }

DirectiveSectionTypes
  = "b" "ridge"? { return "bridge" }
  / "c" "horus"? { return "chorus" }
  / "p" "art"?   { return "part" }
  / "v" "erse"?  { return "verse" }

SectionName
  = name:MetaName _ ":" EOL {
    return name.trim()
  }

SectionBody
  = !SectionName @(Tab / Stanza) __

Stanza
  = lines:Line+ {
    return { type: 'stanza', lines }
  }

Line
  = parts:(@ChordsOverLyrics / @(MusicalInstruction / ChordLyricsPair)+ EOL) {
    return {type: 'line', parts }
  }

// The other way to express chords in lyrics is to place the chords on a line above the lyrics and
// use space characters to align the chords with lyrics. This is supported since most music found
// in other formats use this technique. Here is an example of chords over lyrics:
//
// Verse 1:
//         D           G        D
// Amazing Grace, how sweet the sound,
//                          A7
// That saved a wretch like me.
//   D                  G      D
// I once was lost, but now am found,
//                A7    D
// Was blind, but now I see.
ChordsOverLyrics
  = chords:(_ @(chord:Chord { return { chord, column: location().start.column } }))+ EOL
    lyrics:(@Lyrics EOL)? {
      // FIXME:
      // Is there a better way to do this in PEG?
      // Or, is there a more idiomatic way to merge chords and lyrics into pairs?

      // First chord does not start at beginning of line, add an empty chord
      if(chords[0]?.column > 1) chords.unshift({chord: '', column: 1})

      // Ensure lyrics are a string
      if(!lyrics) lyrics = ''

      const items = [];

      for (let index = 0; index < chords.length; index++) {
        const { chord, column } = chords[index];
        const startColumn = column - 1;
        const endColumn = chords[index + 1]?.column - 1 || lyrics.length;
        const l = lyrics.padEnd(endColumn, ' ').slice(startColumn, endColumn)

        items.push({type: 'ChordLyricsPair', chords: chord, lyrics: l})
      }

      return items;
    }

ChordLyricsPair
  = chords:BracketedChord lyrics:Lyrics {
      return { type: "ChordLyricsPair", chords: chords || '', lyrics }
    }
  / chords:BracketedChord {
      return { type: "ChordLyricsPair", chords, lyrics: "" }
    }
  / lyrics:Lyrics {
    return { type: "ChordLyricsPair", lyrics, chords: "" }
  }

BracketedChord "chord"
  = !Escape "[" @Chord "]"
  / !Escape "[" chord:$[^\]]+ "]" {
      warn(`Unknown chord: ${chord}`, location())
    }


// OnSong recognizes chords using the following set of rules:
// https://www.onsongapp.com/docs/features/formats/onsong/chords/#chords-over-lyrics
Chord
  = $(ChordLetter SharpOrFlat? ChordModifier? ChordNumericPosition? ("/" ChordLetter SharpOrFlat?)?)

// It must start with a capital A, B, C, D, E, F, G or H (used in some languages)
ChordLetter = [A-H]
SharpOrFlat = [#♯b♭]
ChordModifier = "add" / "sus" / "m" / "min" / "man" / "aug" / "dim"
ChordNumericPosition = $([0234579] / "11" / "13") SharpOrFlat?

Lyrics "lyrics"
  = $Char+

Tab
  = "{" _ "sot" _ "}" NewLine content:$(TabLine __)+ "{" _ "eot" _ "}" {
      return { type: 'tab', content }
    }
  / "{start_of_tab}" NewLine content:$(TabLine __)+ "{end_of_tab}" {
      return { type: 'tab', content }
    }

TabLine = [^\r\n{]+ NewLine

MusicalInstruction // e.g. (Repeat 8x)
  = "(" content:$[^)]+ ")" {
      return { type: 'instruction', content }
    }

Char
  = [^\|\[\\{#\(\r\n]

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
