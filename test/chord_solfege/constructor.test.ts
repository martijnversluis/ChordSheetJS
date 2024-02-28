import Chord from '../../src/chord';
import { SOLFEGE } from '../../src';

describe('Chord', () => {
  describe('chord solfege', () => {
    describe('constructor', () => {
      it('assigns the right instance variables', () => {
        expect(Chord.parse('Mibsus/Sol#')?.toString()).toEqual('Mibsus/Sol#');
      });

      it('marks simple minor keys as minor', () => {
        expect(Chord.parse('Mim')?.isMinor()).toBe(true);
      });

      it('marks complex minor keys as minor', () => {
        const chord = new Chord({ base: 'Mi', suffix: 'm7', chordType: SOLFEGE });

        expect(chord.root?.minor).toBe(true);
      });
    });
  });
});
