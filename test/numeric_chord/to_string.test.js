import NumericChord from '../../src/numeric_chord';

describe('NumericChord', () => {
  describe('toString', () => {
    describe('with bass note', () => {
      it('returns the right string representation', () => {
        const chord = new NumericChord({
          base: '1',
          modifier: 'b',
          suffix: 'sus4',
          bassBase: '3',
          bassModifier: '#',
        });

        expect(chord.toString()).toEqual('b1sus4/#3');
      });

      describe('without bass modifier', () => {
        it('returns the right string representation', () => {
          const chord = new NumericChord({
            base: '1',
            modifier: 'b',
            suffix: 'sus4',
            bassBase: '3',
          });

          expect(chord.toString()).toEqual('b1sus4/3');
        });
      });
    });

    describe('without bass note', () => {
      it('returns the right string representation', () => {
        const chord = new NumericChord({
          base: '1',
          modifier: 'b',
          suffix: 'sus4',
        });

        expect(chord.toString()).toEqual('b1sus4');
      });
    });

    describe('without modifier', () => {
      it('returns the right string representation', () => {
        const chord = new NumericChord({
          base: '1',
          suffix: 'sus4',
        });

        expect(chord.toString()).toEqual('1sus4');
      });
    });

    describe('without suffix', () => {
      it('returns the right string representation', () => {
        const chord = new NumericChord({
          base: '1',
          modifier: 'b',
        });

        expect(chord.toString()).toEqual('b1');
      });
    });
  });
});
