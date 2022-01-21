import Chord from '../../src/chord';
import '../matchers';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('useModifier', () => {
      describe('for a chord without modifier', () => {
        it('does not change the chord', () => {
          const chord = new Chord({
            base: 'F',
            modifier: null,
            suffix: null,
            bassBase: 'F',
            bassModifier: null,
          });

          const switchedChord = chord.useModifier('b');

          expect(switchedChord).toBeChord({
            base: 'F', modifier: null, suffix: null, bassBase: 'F', bassModifier: null,
          });
        });
      });

      describe('for #', () => {
        it('changes to b', () => {
          const chord = new Chord({
            base: 'G',
            modifier: '#',
            suffix: null,
            bassBase: 'G',
            bassModifier: '#',
          });

          const switchedChord = chord.useModifier('b');
          expect(switchedChord).toBeChord({
            base: 'A', modifier: 'b', suffix: null, bassBase: 'A', bassModifier: 'b',
          });
        });
      });

      describe('for b', () => {
        it('changes to #', () => {
          const chord = new Chord({
            base: 'G',
            modifier: 'b',
            suffix: null,
            bassBase: 'G',
            bassModifier: 'b',
          });

          const switchedChord = chord.useModifier('#');
          expect(switchedChord).toBeChord({
            base: 'F', modifier: '#', suffix: null, bassBase: 'F', bassModifier: '#',
          });
        });
      });
    });
  });
});
