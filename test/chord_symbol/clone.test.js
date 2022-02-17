import Chord from '../../src/chord';
import '../matchers';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('clone', () => {
      it('assigns the right instance variables', () => {
        const chord = new Chord({
          base: 'E',
          modifier: 'b',
          suffix: 'sus4',
          bassBase: 'G',
          bassModifier: '#',
        });

        const clonedChord = chord.clone();
        expect(clonedChord).toBeChord({
          base: 'E', modifier: 'b', suffix: 'sus4', bassBase: 'G', bassModifier: '#',
        });
      });
    });
  });
});
