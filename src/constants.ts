/**
 * Used to mark a paragraph as bridge
 * @constant
 * @type {string}
 */
export const BRIDGE = 'bridge';

/**
 * Used to mark a paragraph as chorus
 * @constant
 * @type {string}
 */
export const CHORUS = 'chorus';

/**
 * Used to mark a paragraph as grid
 * @constant
 * @type {string}
 */
export const GRID = 'grid';

/**
 * Used to mark a paragraph as containing lines with both verse and chorus type
 * @constant
 * @type {string}
 */
export const INDETERMINATE = 'indeterminate';

/**
 * Used to mark a paragraph as not containing a line marked with a type
 * @constant
 * @type {string}
 */
export const NONE = 'none';

/**
 * Used to mark a paragraph as tab
 * @constant
 * @type {string}
 */
export const TAB = 'tab';

/**
 * Used to mark a paragraph as verse
 * @constant
 * @type {string}
 */
export const VERSE = 'verse';

/**
 * Used to mark a paragraph as part
 * @constant
 * @type {string}
 */
export const PART = 'part';

/**
 * Used to mark a section as Lilypond notation
 * @constant
 * @type {string}
 */
export const LILYPOND = 'ly';

/**
 * Used to mark a section as ABC music notation
 * @constant
 * @type {string}
 */
export const ABC = 'abc';

export type ParagraphType =
  'abc' |
  'bridge' |
  'chorus' |
  'grid' |
  'indeterminate' |
  'ly' |
  'none' |
  'tab' |
  'verse' |
  'part' |
  string;

export const SYMBOL = 'symbol';
export const NUMERIC = 'numeric';
export const NUMERAL = 'numeral';
export const SOLFEGE = 'solfege';

export const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

export const FLAT = 'b';
export const SHARP = '#';
export type Accidental = '#' | 'b';
export const NO_ACCIDENTAL = 'NM';
export type NoAccidental = 'NM';
export type AccidentalMaybe = Accidental | NoAccidental;

/**
 * @deprecated Use Accidental instead
 */
export type Modifier = Accidental;
/**
 * @deprecated Use NO_ACCIDENTAL instead
 */
export const NO_MODIFIER = NO_ACCIDENTAL;
/**
 * @deprecated Use NoAccidental instead
 */
export type NoModifier = NoAccidental;
/**
 * @deprecated Use AccidentalMaybe instead
 */
export type ModifierMaybe = AccidentalMaybe;

export type ChordType = 'symbol' | 'solfege' | 'numeric' | 'numeral';
export type ChordStyle = 'symbol' | 'solfege' | 'number' | 'numeral';
export type NullableChordStyle = ChordStyle | null;

export const MINOR = 'm';
export const MAJOR = 'M';

export type Mode = 'M' | 'm';

export type FretNumber = number;
export type OpenFret = 0;
export type NonSoundingString = '-1' | 'N' | 'x';

export type StringNumber = 1 | 2 | 3 | 4 | 5 | 6;
export type FingerNumber = 1 | 2 | 3 | 4 | 5 | OpenFret;

export const nonSoundingString = ['N', '-1', 'x'] as NonSoundingString[];
export const openFret = 0 as OpenFret;

export type Fret = FretNumber | OpenFret | NonSoundingString;

export const START_TAG = 'start_tag';
export const END_TAG = 'end_tag';
export const AUTO = 'auto';
