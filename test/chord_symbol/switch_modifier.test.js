import ChordSymbol from '../../src/chord_symbol';
import '../matchers';

describe('ChordSymbol', () => {
  describe('switchModifier', () => {
    describe('for a chord without modifier', () => {
      it('does not change the chord', () => {
        const chord = new ChordSymbol({
          base: 'F',
          modifier: null,
          suffix: null,
          bassBase: 'F',
          bassModifier: null,
        });

        const switchedChord = chord.switchModifier();
        expect(switchedChord).toBeChord('F', null, null, 'F', null);
      });
    });

    describe('for a b chord', () => {
      it('changes to #', () => {
        const chord = new ChordSymbol({
          base: 'G',
          modifier: '#',
          suffix: null,
          bassBase: 'G',
          bassModifier: '#',
        });

        const switchedChord = chord.switchModifier();
        expect(switchedChord).toBeChord('A', 'b', null, 'A', 'b');
      });
    });

    describe('for a # chord', () => {
      it('changes to b', () => {
        const chord = new ChordSymbol({
          base: 'G',
          modifier: 'b',
          suffix: null,
          bassBase: 'G',
          bassModifier: 'b',
        });

        const switchedChord = chord.switchModifier();
        expect(switchedChord).toBeChord('F', '#', null, 'F', '#');
      });
    });
  });
});
