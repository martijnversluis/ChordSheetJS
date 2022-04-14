import Chord from '../../src/chord';
import '../matchers';

describe('Chord', () => {
  describe('numeric', () => {
    describe('useModifier', () => {
      describe('for a chord without modifier', () => {
        it('does not change the chord', () => {
          const chord = new Chord({
            base: 4,
            modifier: null,
            suffix: null,
            bassBase: 4,
            bassModifier: null,
          });

          const switchedChord = chord.useModifier('b');

          expect(switchedChord).toBeChord({
            base: 4, modifier: null, suffix: null, bassBase: 4, bassModifier: null,
          });
        });
      });

      describe('for #', () => {
        it('changes to b', () => {
          const chord = new Chord({
            base: 5,
            modifier: '#',
            suffix: null,
            bassBase: 5,
            bassModifier: '#',
          });

          const switchedChord = chord.useModifier('b');
          expect(switchedChord).toBeChord({
            base: 6, modifier: 'b', suffix: null, bassBase: 6, bassModifier: 'b',
          });
        });
      });

      describe('for b', () => {
        it('changes to #', () => {
          const chord = new Chord({
            base: 5,
            modifier: 'b',
            suffix: null,
            bassBase: 5,
            bassModifier: 'b',
          });

          const switchedChord = chord.useModifier('#');
          expect(switchedChord).toBeChord({
            base: 4, modifier: '#', suffix: null, bassBase: 4, bassModifier: '#',
          });
        });
      });
    });
  });
});
