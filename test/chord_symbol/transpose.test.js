import ChordSymbol from '../../src/chord_symbol';
import '../matchers';

describe('ChordSymbol', () => {
  describe('transpose', () => {
    describe('when delta > 0', () => {
      it('tranposes up', () => {
        const chord = new ChordSymbol({
          base: 'D',
          modifier: 'b',
          suffix: null,
          bassBase: 'A',
          bassModifier: '#',
        });

        const transposedChord = chord.transpose(5);
        expect(transposedChord).toBeChord('G', 'b', null, 'D', '#');
      });
    });

    describe('when delta < 0', () => {
      it('Does not change the chord', () => {
        const chord = new ChordSymbol({
          base: 'A',
          modifier: '#',
          suffix: null,
          bassBase: 'B',
          bassModifier: 'b',
        });

        const transposedChord = chord.transpose(-4);
        expect(transposedChord).toBeChord('F', '#', null, 'G', 'b');
      });
    });

    describe('when delta = 0', () => {
      it('Does not change the chord', () => {
        const chord = new ChordSymbol({
          base: 'B',
          modifier: '#',
          suffix: null,
          bassBase: 'C',
          bassModifier: 'b',
        });

        const tranposedChord = chord.transpose(0);
        expect(tranposedChord).toBeChord('B', '#', null, 'C', 'b');
      });
    });
  });
});
