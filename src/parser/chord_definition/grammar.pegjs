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
