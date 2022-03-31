import Chord from '../../src/chord';

import '../matchers';

describe('Chord', () => {
  describe('numeric', () => {
    describe('constructor', () => {
      it('assigns the right instance variables', () => {
        const chord = new Chord({
          base: 1,
          modifier: 'b',
          suffix: 'sus',
          bassBase: 3,
          bassModifier: '#',
        });

        expect(chord).toBeChord({
          base: 1, modifier: 'b', suffix: 'sus', bassBase: 3, bassModifier: '#',
        });
      });
    });
  });
});
