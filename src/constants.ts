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

export type ParagraphType = 'bridge' | 'chorus' | 'grid' | 'indeterminate' | 'none' | 'tab' | 'verse';

export const SYMBOL = 'symbol';
export const NUMERIC = 'numeric';
export const NUMERAL = 'numeral';

export const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

export const FLAT = 'b';
export const SHARP = '#';
export type Modifier = '#' | 'b';
export const NO_MODIFIER = 'NM';
export type NoModifier = 'NM';
export type ModifierMaybe = Modifier | NoModifier;

export type ChordType = 'symbol' | 'numeric' | 'numeral';

export const MINOR = 'm';
export const MAJOR = 'M';

export type Mode = 'M' | 'm';
