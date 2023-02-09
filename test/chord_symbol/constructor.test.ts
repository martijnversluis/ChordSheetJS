import Chord from '../../src/chord';
import '../matchers';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('constructor', () => {
      it('assigns the right instance variables', () => {
        const chord = new Chord({
          base: 'E',
          modifier: 'b',
          suffix: 'sus',
          bassBase: 'G',
          bassModifier: '#',
        });

        expect(chord).toBeChord({
          base: 'E', modifier: 'b', suffix: 'sus', bassBase: 'G', bassModifier: '#',
        });
      });

      it('marks simple minor keys as minor', () => {
        const chord = new Chord({ base: 'E', suffix: 'm' });

        expect(chord.root?.minor).toBe(true);
      });

      it('marks complex minor keys as minor', () => {
        const chord = new Chord({ base: 'E', suffix: 'm7' });

        expect(chord.root?.minor).toBe(true);
      });
    });
  });
});
