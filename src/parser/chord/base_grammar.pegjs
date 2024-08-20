Chord
  = chord:(Numeral / Numeric / ChordSolfege / ChordSymbol) {
      return { type: "chord", ...chord, column: location().start.column };
    }

ChordModifier
  = "#" / "b"

ChordSymbol
  = root:ChordSymbolRoot modifier:ChordModifier? suffix:$(ChordSuffix) bass:ChordSymbolBass? {
  	  return { base: root, modifier, suffix, ...bass, chordType: "symbol" };
    }
  / bass:ChordSymbolBass {
      return { base: null, modifier: null, suffix: null, ...bass, chordType: "symbol" };
    }

ChordSymbolRoot
  = [A-Ga-g]

ChordSymbolBass
  = "/" root:ChordSymbolRoot modifier:ChordModifier? {
      return { bassBase: root, bassModifier: modifier };
    }

ChordSolfege
  = root:ChordSolfegeRoot modifier:ChordModifier? suffix:$(ChordSuffix) bass:ChordSolfegeBass? {
  	  return { base: root, modifier, suffix, ...bass, chordType: "solfege" };
    }
  / bass:ChordSolfegeBass {
      return { base: null, modifier: null, suffix: null, ...bass, chordType: "solfege" };
    }

ChordSolfegeRoot
  = "Do"i / "Re"i / "Mi"i / "Fa"i / "Sol"i / "La"i / "Si"i

ChordSolfegeBass
  = "/" root:ChordSolfegeRoot modifier:ChordModifier? {
      return { bassBase: root, bassModifier: modifier };
    }

Numeral
  = modifier:ChordModifier? root:NumeralRoot suffix:$(ChordSuffix) bass:NumeralBass? {
      return { base: root, modifier, suffix, ...bass, chordType: "numeral" };
    }
  / bass:NumeralBass {
      return { base: null, modifier: null, suffix: null, ...bass, chordType: "numeral" };
    }

NumeralRoot
  = "III"i / "VII"i / "II"i / "IV"i / "VI"i / "I"i / "V"i

NumeralBass
  = "/" modifier:ChordModifier? root:NumeralRoot {
      return { bassBase: root, bassModifier: modifier };
    }

Numeric
  = modifier:ChordModifier? root:NumericRoot suffix:$(ChordSuffix) bass:NumericBass? {
      return { base: root, modifier, suffix, ...bass, chordType: "numeric" };
    }
  / bass:NumericBass {
      return { base: null, modifier: null, suffix: null, ...bass, chordType: "numeric" };
    }

NumericRoot
  = [1-7]

NumericBass
  = "/" modifier:ChordModifier? root:NumericRoot {
      return { bassBase: root, bassModifier: modifier };
    }
