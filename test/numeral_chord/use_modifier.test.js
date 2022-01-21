import Chord from '../../src/chord';
import '../matchers';

describe('Chord', () => {
  describe('useModifier', () => {
    describe('for a chord without modifier', () => {
      it('does not change the chord', () => {
        const chord = new Chord({
          base: 'IV',
          modifier: null,
          suffix: null,
          bassBase: 'IV',
          bassModifier: null,
        });

        const switchedChord = chord.useModifier('b');

        expect(switchedChord).toBeChord({
          base: 'IV', modifier: null, suffix: null, bassBase: 'IV', bassModifier: null,
        });
      });
    });

    describe('for #', () => {
      it('changes to b', () => {
        const chord = new Chord({
          base: 'V',
          modifier: '#',
          suffix: null,
          bassBase: 'V',
          bassModifier: '#',
        });

        const switchedChord = chord.useModifier('b');
        expect(switchedChord).toBeChord({
          base: 'VI', modifier: 'b', suffix: null, bassBase: 'VI', bassModifier: 'b',
        });
      });
    });

    describe('for b', () => {
      it('changes to #', () => {
        const chord = new Chord({
          base: 'V',
          modifier: 'b',
          suffix: null,
          bassBase: 'V',
          bassModifier: 'b',
        });

        const switchedChord = chord.useModifier('#');
        expect(switchedChord).toBeChord({
          base: 'IV', modifier: '#', suffix: null, bassBase: 'IV', bassModifier: '#',
        });
      });
    });
  });
});
