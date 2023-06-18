import Chord from '../../src/chord';
import { SYMBOL } from '../../src';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('constructor', () => {
      it('assigns the right instance variables', () => {
        expect(Chord.parse('Ebsus/G#')?.toString()).toEqual('Ebsus/G#');
      });

      it('marks simple minor keys as minor', () => {
        expect(Chord.parse('Em')?.isMinor()).toBe(true);
      });

      it('marks complex minor keys as minor', () => {
        const chord = new Chord({ base: 'E', suffix: 'm7', chordType: SYMBOL });

        expect(chord.root?.minor).toBe(true);
      });
    });
  });
});
