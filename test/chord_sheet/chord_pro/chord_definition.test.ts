import { ChordDefinition } from '../../../src';
import { Fret } from '../../../src/constants';

describe('ChordDefinition', () => {
  describe('#clone', () => {
    it('returns a deep copy', () => {
      const frets: Fret[] = ['x', 3, 2, 3, 1, 'x'];
      const fingers: number[] = [1, 2, 3, 4, 5, 6];

      const chordDefinition = new ChordDefinition('C', 1, frets, fingers);
      const clone = chordDefinition.clone();

      expect(clone.name).toEqual('C');
      expect(clone.baseFret).toEqual(1);
      expect(clone.frets).toEqual(frets);
      expect(clone.fingers).toEqual(fingers);

      expect(clone.frets).not.toBe(frets);
      expect(clone.fingers).not.toBe(fingers);
    });
  });

  describe('::parse', () => {
    it('parses a chord definition', () => {
      const chordDefinition = ChordDefinition.parse(' D7 base-fret 3 frets x 3 2 3 1 x ');

      expect(chordDefinition.name).toEqual('D7');
      expect(chordDefinition.baseFret).toEqual(3);
      expect(chordDefinition.frets).toEqual(['x', 3, 2, 3, 1, 'x']);
      expect(chordDefinition.fingers).toEqual([]);
    });

    it('parses a chord definition with fingers', () => {
      const chordDefinition = ChordDefinition.parse('D7 base-fret 3 frets x 3 2 3 1 x fingers 1 2 3 4 5 6');

      expect(chordDefinition.name).toEqual('D7');
      expect(chordDefinition.baseFret).toEqual(3);
      expect(chordDefinition.frets).toEqual(['x', 3, 2, 3, 1, 'x']);
      expect(chordDefinition.fingers).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('parses a chord definition without base-fret', () => {
      const chordDefinition = ChordDefinition.parse('D7 frets x 3 2 3 1 x fingers 1 2 3 4 5 6');

      expect(chordDefinition.name).toEqual('D7');
      expect(chordDefinition.baseFret).toEqual(1);
      expect(chordDefinition.frets).toEqual(['x', 3, 2, 3, 1, 'x']);
      expect(chordDefinition.fingers).toEqual([1, 2, 3, 4, 5, 6]);
    });

    [
      'D7 base-fret 1 frets N 3 2 3 1 N fingers a 2 3 4 5 6',
      'D7 base-fret 1 frets N 3 2 3 1 N fingers A 2 3 4 5 6',
      'D7 base-fret 1 frets N 3 2 3 1 N fingers x 2 3 4 5 6',
      'D7 base-fret 1 frets N 3 2 3 1 N fingers X 2 3 4 5 6',
      'D7 base-fret 1 frets N 3 2 3 1 N fingers n 2 3 4 5 6',
      'D7 base-fret 1 frets N 3 2 3 1 N fingers N 2 3 4 5 6',
      'D7 base-fret 1 frets N 3 2 3 1 N fingers - 2 3 4 5 6',
      'D7 base-fret 1 frets N 3 2 3 1 N fingers 0 2 3 4 5 6',
    ].forEach((definitionString) => {
      it(`can parse ${definitionString}`, () => {
        expect(() => ChordDefinition.parse(definitionString)).not.toThrow();
      });
    });
  });
});
