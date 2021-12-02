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
    });
  });
});
