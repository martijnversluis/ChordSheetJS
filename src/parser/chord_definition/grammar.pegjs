ChordDefinitionValue
  = name:$([A-Za-z0-9]+) _ "base-fret" __ baseFret:FretNumber __ "frets" frets:FretWithLeadingSpace+ fingers:ChordFingersDefinition? {
      return { name, baseFret, frets, fingers, text: text() };
    }

ChordFingersDefinition
  = __ "fingers" fingers:FingerWithLeadingSpace+ {
      return fingers;
    }

FingerWithLeadingSpace
  = __ finger:Finger {
      return finger;
    }

Finger
  = FingerNumber / FingerLetter / NoFingerSetting

FingerNumber
  = number:[0-9] {
      return parseInt(number, 10);
    }

FingerLetter
  = [a-zA-Z]

NoFingerSetting
  = "-" / "x" / "X" / "n" / "N"

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
  = "-1" / "n" / "N" / "x" / "X"
