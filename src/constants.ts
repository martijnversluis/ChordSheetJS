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
export type Modifier = '#' | 'b';
export const NO_MODIFIER = 'NM';
export type NoModifier = 'NM';
export type ModifierMaybe = Modifier | NoModifier;

export type ChordType = 'symbol' | 'solfege' | 'numeric' | 'numeral';
export type ChordStyle = 'symbol' | 'solfege' | 'number' | 'numeral';
export type NullableChordStyle = ChordStyle | null;

export const MINOR = 'm';
export const MAJOR = 'M';

export type Mode = 'M' | 'm';

type FretNumber = number;
type OpenFret = '0';
type NonSoundingString = '-1' | 'N' | 'x';

export type Fret = FretNumber | OpenFret | NonSoundingString;

export const START_TAG = 'start_tag';
export const END_TAG = 'end_tag';
export const AUTO = 'auto';
