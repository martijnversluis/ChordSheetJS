import ChordSymbol from './chord_symbol';
import NumericChord from './numeric_chord';

const chordRegex = (
  /^(?<base>[A-G])(?<modifier>#|b)?(?<suffix>[^/\s]*)(\/(?<bassBase>[A-G])(?<bassModifier>#|b)?)?$/i
);

const numericChordRegex = (
  /^(?<modifier>#|b)?(?<base>[1-7])(?<suffix>[^/\s]*)(\/(?<bassModifier>#|b)?(?<bassBase>[0-7]))?$/
);

const classMapping = [
  [numericChordRegex, NumericChord],
  [chordRegex, ChordSymbol],
];

/**
 * Tries to parse a chord string into a chord
 * @param chordString the chord string, eg Esus4/G# or 1sus4/#3
 * @returns {null|ChordSymbol|NumericChord}
 */
function parseChord(chordString) {
  for (let i = 0, count = classMapping.length; i < count; i += 1) {
    const [regex, Klass] = classMapping[i];
    const match = chordString.match(regex);

    if (match) {
      return new Klass(match.groups);
    }
  }

  return null;
}

export default parseChord;
