import Chord from '../../src/chord';
import '../matchers';

describe('Chord', () => {
  describe('numeral', () => {
    describe('constructor', () => {
      it('assigns the right instance variables', () => {
        const chord = new Chord({
          base: 'I',
          modifier: 'b',
          suffix: 'sus4',
          bassBase: 'III',
          bassModifier: '#',
        });

        expect(chord).toBeChord({
          base: 'I', modifier: 'b', suffix: 'sus4', bassBase: 'III', bassModifier: '#',
        });
      });
    });
  });
});
