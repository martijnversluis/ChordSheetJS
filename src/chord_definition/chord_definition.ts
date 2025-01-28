import { Fret } from '../constants';
import { parse } from '../parser/chord_definition/peg_parser';

/**
 * Represents a chord definition.
 *
 * Definitions are made using the `{chord}` or `{define}` directive.
 * A chord definitions overrides a previous chord definition for the exact same chord.
 *
 * @see https://chordpro.org/chordpro/directives-define/
 * @see https://chordpro.org/chordpro/directives-chord/
 */
class ChordDefinition {
  /**
   * The chord name, e.g. `C`, `Dm`, `G7`.
   * @type {string}
   */
  name: string;

  /**
   * Defines the offset for the chord, which is the position of the topmost finger.
   * The offset must be 1 or higher.
   * @type {number}
   */
  baseFret: number;

  /**
   * Defines the string positions.
   * Strings are enumerated from left (lowest) to right (highest), as they appear in the chord diagrams.
   * Fret positions are relative to the offset minus one, so with base-fret 1 (the default),
   * the topmost fret position is 1. With base-fret 3, fret position 1 indicates the 3rd position.
   * `0` (zero) denotes an open string. Use `-1`, `N` or `x` to denote a non-sounding string.
   * @type {Fret[]}
   */
  frets: Fret[];

  /**
   * defines finger settings. This part may be omitted.
   *
   * For the frets and the fingers positions, there must be exactly as many positions as there are strings,
   * which is 6 by default. For the fingers positions, values corresponding to open or damped strings are ignored.
   * Finger settings may be numeric (0 .. 9) or uppercase letters (A .. Z).
   * Note that the values -, x, X, and N are used to designate a string without finger setting.
   * @type {number[]}
   */
  fingers: number[];

  constructor(name: string, baseFret: number, frets: Fret[], fingers?: number[]) {
    this.name = name;
    this.baseFret = baseFret;
    this.frets = frets;
    this.fingers = fingers || [];
  }

  /**
   * Parses a chord definition in the form of:
   * - <name> base-fret <offset> frets <pos> <pos> … <pos>
   * - <name> base-fret <offset> frets <pos> <pos> … <pos> fingers <pos> <pos> … <pos>
   * @param chordDefinition
   * @returns {ChordDefinition}
   * @see https://chordpro.org/chordpro/directives-define/#common-usage
   */
  static parse(chordDefinition: string): ChordDefinition {
    const {
      name,
      baseFret,
      frets,
      fingers,
    } = parse(chordDefinition.trim());

    return new ChordDefinition(name, baseFret, frets, fingers);
  }

  clone(): ChordDefinition {
    return new ChordDefinition(this.name, this.baseFret, [...this.frets], [...this.fingers]);
  }
}

export default ChordDefinition;
