Chord
  = chordSymbol:ChordSymbol {
    return { type: "chord", ...chordSymbol, column: location().start.column };
  }

ChordSymbol
  = root:ChordSymbolRoot modifier:ChordModifier? suffix:$(ChordSuffix) bass:ChordBass? {
  	  return { base: root, modifier, suffix, ...bass };
    }

ChordSymbolRoot
  = [A-Ga-g]

ChordModifier
  = "#" / "b"

ChordSuffix
  = [a-zA-Z0-9()]*

ChordBass
  = "/" root:ChordSymbolRoot modifier:ChordModifier? {
      return { bassBase: root, bassModifier: modifier };
    }
