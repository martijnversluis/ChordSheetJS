import ChordSymbol from '../../src/chord_symbol';

describe('ChordSymbol', () => {
  describe('toString', () => {
    it('returns the right string representation', () => {
      const chord = new ChordSymbol({
        base: 'E',
        modifier: 'b',
        suffix: 'sus4',
        bassBase: 'G',
        bassModifier: '#',
      });

      expect(chord.toString()).toEqual('Ebsus4/G#');
    });

    describe('without bass modifier', () => {
      it('returns the right string representation', () => {
        const chord = new ChordSymbol({
          base: 'E',
          modifier: 'b',
          suffix: 'sus4',
          bassBase: 'G',
        });

        expect(chord.toString()).toEqual('Ebsus4/G');
      });
    });

    describe('without bass note', () => {
      it('returns the right string representation', () => {
        const chord = new ChordSymbol({
          base: 'E',
          modifier: 'b',
          suffix: 'sus4',
        });

        expect(chord.toString()).toEqual('Ebsus4');
      });
    });

    describe('without modifier', () => {
      it('returns the right string representation', () => {
        const chord = new ChordSymbol({
          base: 'E',
          suffix: 'sus4',
        });

        expect(chord.toString()).toEqual('Esus4');
      });
    });

    describe('without suffix', () => {
      it('returns the right string representation', () => {
        const chord = new ChordSymbol({
          base: 'E',
          modifier: 'b',
        });

        expect(chord.toString()).toEqual('Eb');
      });
    });
  });
});
