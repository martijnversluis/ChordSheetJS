Chord
  = "(" chord:(Numeral / Numeric / ChordSolfege / ChordSymbol) ")" {
      return { type: "chord", ...chord, column: location().start.column, optional: true };
    }
  / chord:(Numeral / Numeric / ChordSolfege / ChordSymbol) {
      return { type: "chord", ...chord, column: location().start.column };
    }

ChordAccidental
  = "#" / "b"

ChordSymbol
  = root:ChordSymbolRoot accidental:ChordAccidental? suffix:ChordSuffix bass:ChordSymbolBass? {
      const suffixProps = typeof suffix === 'string' || suffix === null
        ? { suffix }
        : { quality: suffix.quality, extensions: suffix.extensions };
  	  return { base: root, accidental, ...suffixProps, ...bass, chordType: "symbol" };
    }
  / bass:ChordSymbolBass {
      return { base: null, accidental: null, suffix: null, ...bass, chordType: "symbol" };
    }

ChordSymbolRoot
  = [A-Ga-g]

ChordSymbolBass
  = "/" root:ChordSymbolRoot accidental:ChordAccidental? {
      return { bassBase: root, bassAccidental: accidental };
    }

ChordSolfege
  = root:ChordSolfegeRoot accidental:ChordAccidental? suffix:ChordSuffix bass:ChordSolfegeBass? {
      const suffixProps = typeof suffix === 'string' || suffix === null
        ? { suffix }
        : { quality: suffix.quality, extensions: suffix.extensions };
  	  return { base: root, accidental, ...suffixProps, ...bass, chordType: "solfege" };
    }
  / bass:ChordSolfegeBass {
      return { base: null, accidental: null, suffix: null, ...bass, chordType: "solfege" };
    }

ChordSolfegeRoot
  = "Do"i / "Re"i / "Mi"i / SolfegeFa / "Sol"i / "La"i / "Si"i

SolfegeFa
  = "Fa" !("dd"i / "ug"i) { return "Fa"; }
  / "fa" !("dd"i / "ug"i) { return "fa"; }

ChordSolfegeBass
  = "/" root:ChordSolfegeRoot accidental:ChordAccidental? {
      return { bassBase: root, bassAccidental: accidental };
    }

Numeral
  = accidental:ChordAccidental? root:NumeralRoot suffix:ChordSuffix bass:NumeralBass? {
      const suffixProps = typeof suffix === 'string' || suffix === null
        ? { suffix }
        : { quality: suffix.quality, extensions: suffix.extensions };
      return { base: root, accidental, ...suffixProps, ...bass, chordType: "numeral" };
    }
  / bass:NumeralBass {
      return { base: null, accidental: null, suffix: null, ...bass, chordType: "numeral" };
    }

NumeralRoot
  = "III"i / "VII"i / "II"i / "IV"i / "VI"i / "I"i / "V"i

NumeralBass
  = "/" accidental:ChordAccidental? root:NumeralRoot {
      return { bassBase: root, bassAccidental: accidental };
    }

Numeric
  = accidental:ChordAccidental? root:NumericRoot suffix:ChordSuffix bass:NumericBass? {
      const suffixProps = typeof suffix === 'string' || suffix === null
        ? { suffix }
        : { quality: suffix.quality, extensions: suffix.extensions };
      return { base: root, accidental, ...suffixProps, ...bass, chordType: "numeric" };
    }
  / bass:NumericBass {
      return { base: null, accidental: null, suffix: null, ...bass, chordType: "numeric" };
    }

NumericRoot
  = [1-7]

NumericBass
  = "/" accidental:ChordAccidental? root:NumericRoot {
      return { bassBase: root, bassAccidental: accidental };
    }
